# Legacy GitHub Actions workflow command marker reaches Action stdout

- **Finding:** MOAI-003
- **Severity:** Medium
- **Priority:** P2
- **Affected code:** `src/format.ts`, `src/action.ts`, `action.yml`, `.github/workflows/maintainerops.yml`
- **Affected code range observed:** `v0.1.0` through `v0.1.14`, including revision `40ab2aaf0875d0b9074642ba4f51223f1bd4200a`
- **Fixed revision:** Not identified in the reviewed history

## Executive Summary

MaintainerOps AI copies public issue and pull-request titles into its offline
review packet and writes that packet directly to the GitHub Actions log. The
report formatter tries to protect this output from workflow commands, but its
sanitizer only rewrites `::` when it appears at the beginning of a line. A
title such as `routine change ##[add-mask]attacker-value` therefore survives
unchanged when it is embedded in the generated summary and evidence.

The GitHub Actions runner recognizes the legacy `##[` command prefix at any
position within a log line. A public issue or pull-request author can therefore
cause the runner to interpret report content as commands such as `warning`,
`error`, `add-mask`, or `stop-commands`. The demonstrated impact is runner and
log-command integrity: false annotations, attacker-chosen masking, or changes
to later command processing. This does not establish shell execution,
repository writes, or a privilege escalation in the supplied workflow, which
uses read-only permissions, offline analysis, and no contributor-code checkout.

I reviewed revision `40ab2aaf0875d0b9074642ba4f51223f1bd4200a` directly, compared
the sanitizer with the initial `v0.1.0` implementation, and ran only the safe
local formatter reproduction shipped beside this report. I did not contact
GitHub, invoke a live runner, or test a production workflow. The official
runner source trace used for the parser behavior is revision
`8efad23e6e87e8494afd6ac6c73d68cb35cacdb4`.

## Background

The repository workflow is triggered by `pull_request_target` and `issues`.
It grants only `contents: read`, `issues: read`, and `pull-requests: read`,
then invokes the action with `offline: true` and `authorized: true`. There is
no checkout step and no later shell step in the supplied job. The security
boundary is therefore the handling of public GitHub metadata inside a
maintainer-authorized automation run.

The GitHub API adapter treats the title as ordinary work-item data. Both issue
and pull-request paths assign the remote title without a command-specific
encoding:

```ts
// src/github.ts, fetchIssueWorkItem and fetchPullRequestWorkItem
title: issue.title,
// ...
title: pr.title,
```

The action entry point resolves that work item and selects the offline
analyzer when the workflow passes `offline: true`:

```ts
// src/analyze.ts
if (options.offline || !process.env.OPENAI_API_KEY) {
  return analyzeOffline(item);
}
```

That design is useful for deterministic triage, but it means the title remains
attacker-controlled text all the way into the report formatter.

## Vulnerability Details

We can follow the vulnerable value through four small transitions.

First, a public actor supplies a title. `fetchIssueWorkItem` and
`fetchPullRequestWorkItem` copy it into `MaintainerWorkItem.title`. The offline
analyzer then places the title in two maintainer-facing fields:

```ts
// src/offlineAnalyzer.ts, buildSummary
const parts = [`${item.kind.replace("_", " ")} "${item.title}" needs maintainer review.`];

// src/offlineAnalyzer.ts, buildEvidence
{ source: "title", reference: item.title,
  note: "Used as the primary maintainer-facing context." }
```

Second, `formatAssessment` sanitizes those assessment fields with
`sanitizeForStdout` before composing the markdown report. The decisive guard
is only line-leading and only covers the modern-looking `::` form:

```ts
// src/format.ts
function sanitizeForStdout(value: string): string {
  return redactSecrets(value).replace(/^::/gm, "\\::");
}
```

For the title `routine change ##[add-mask]attacker-value`, the summary becomes
the following. The legacy marker is after ordinary text, so the regular
expression does not match it:

```text
pull request "routine change ##[add-mask]attacker-value" needs maintainer review.
```

The same title is also used as the evidence reference. The extra `safeInline`
call in the markdown path collapses newlines, but it does not remove or split
the embedded `##[` sequence. Secret redaction does not alter this marker
either.

Third, the action emits the completed report before it writes the optional
step-summary and output files:

```ts
// src/action.ts
const report = await executeCli(args);
process.stdout.write(`${report}\n`);
await writeActionReport(report, ...);
```

The configured workflow requests markdown, so a title embedded in the summary
or evidence reaches the runner-monitored stdout in the normal path.

Finally, the official `actions/runner` source identifies `##[` as the legacy
`ActionCommand.Prefix`. Its output manager checks whether a line contains the
command prefix and sends such lines to command processing. The parser uses an
`IndexOf` search rather than requiring the prefix at offset zero, then parses
registered commands and their data. As a result, the line above is not merely
displayed text: the runner can interpret the substring beginning at `##[` as a
legacy workflow command.

## Exploitability Analysis

The strongest practical route is a public title containing a recognized
low-side-effect command and attacker-chosen data. For example:

```text
routine change ##[warning]review-needed
```

Because the title is placed inside the generated summary, we do not need to
control a separate model field, add a newline, or race another process. The
runner's offset-independent legacy parser is enough. `warning` and `error`
can create misleading annotations or log entries that appear to be generated
by the workflow. `add-mask` can register an attacker-selected value for later
masking, which can hide matching text and reduce log clarity. `stop-commands`
can change whether later runner commands are processed until its token is
seen; the effect is more useful in a consumer workflow with subsequent
commands than in the supplied one-step job.

The input is constrained by the GitHub title field and by the report's normal
formatting, but those constraints do not affect the primitive: the marker is
short, valid inside a quoted title, and does not need to be at the beginning of
the line. The existing secret redaction also does not recognize or remove
workflow command syntax.

There is an important boundary on the result. Workflow commands are handled
by the runner, not passed to a shell as shell syntax. The supplied workflow
does not execute pull-request code, does not check out the contributor branch,
and exposes read-only repository metadata. I therefore treat arbitrary shell
execution, repository modification, secret disclosure, and privilege
escalation as unproven consequences of this finding. The validated primitive
is control over runner annotations, masking, command interpretation, and log
integrity.

## Proof of Concept

The bundled `poc/legacy-command-marker.js` is a safe local reproduction of the
formatter boundary. It uses the same vulnerable regular expression, embeds a
title in the same style as the offline summary, and checks that the legacy
marker survives at a nonzero offset. It also checks a proposed marker
neutralization for comparison. It does not call the GitHub API, write a
workflow file, or invoke an Actions runner.

From the unpacked report directory:

```sh
cd poc
node legacy-command-marker.js
```

Representative output:

```text
[+] input: routine change ##[add-mask]attacker-value
[+] vulnerable output: pull request "routine change ##[add-mask]attacker-value" needs maintainer review.
[+] legacy marker survived at offset 29
[+] proposed output: pull request "routine change # #[add-mask]attacker-value" needs maintainer review.
[+] no network, GitHub API, or runner was contacted
```

This demonstrates the source-level trigger and output state. It intentionally
does not claim that a local string check is equivalent to executing the
workflow on GitHub; the runner parser behavior is established separately by
the official runner source trace described above.

## Remediation

The invariant should be: no untrusted report value may contain a recognized
GitHub Actions command marker when the final report is emitted to stdout or
serialized into an action-facing output. The check must apply at every offset,
and it must cover both the modern `::` marker and the legacy `##[` marker.

A minimal source-level fix is to break both marker tokens after secret
redaction:

```ts
function sanitizeForStdout(value: string): string {
  return redactSecrets(value)
    .replace(/::/g, ": :")
    .replace(/##\[/g, "# #[");
}
```

The exact replacement text can be chosen to suit the report format, but it
must not leave either parser token contiguous. The same boundary policy should
be applied to every untrusted field in both markdown and JSON output; in
particular, the JSON branch should not bypass final output sanitization for
work-item fields.

I recommend regression tests that pass the following values through
`formatAssessment` in both formats:

- `routine change ##[warning]review-needed`, with the marker after ordinary text;
- `##[add-mask]value` at the start of a line and after a newline;
- `routine change ::warning::review-needed`, with the modern marker after text;
- the same values in the title, summary, evidence reference, comment draft,
  labels, and security notes.

The assertions should verify that the emitted stdout string contains neither
contiguous marker form in attacker-controlled fields, while preserving the
ordinary report text. Keeping the existing read-only permissions and avoiding
contributor-code checkout are useful defense-in-depth controls, but they do
not replace output neutralization.

## Summary

We can reach the bug with ordinary public issue or pull-request metadata: the
title is copied into the offline assessment, embedded in the report, and
written to stdout. The sanitizer protects only line-leading `::` text, while
the runner still recognizes legacy `##[` commands at arbitrary offsets. A
single crafted title can therefore influence runner command handling and log
integrity without executing repository code.

The clean fix is to neutralize both command syntaxes at the final output
boundary and cover every output format with regression tests. Future variant
analysis should search all action output paths for parser-specific markers and
verify that fields copied from public GitHub metadata cannot bypass the final
serializer through alternate formats or direct stdout writes.
