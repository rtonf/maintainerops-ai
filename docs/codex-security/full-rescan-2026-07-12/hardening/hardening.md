# Security hardening portfolio

## Decision summary

We found two repeated boundary problems and one privileged publication problem. The first two are best addressed by making untrusted text safe at the last local boundary before it is sent to a model or printed to a runner. The publication path needs a separate immutable-source control because sanitization cannot protect a package built from the wrong Git ref.

I recommend **Option 2: one shared untrusted-output boundary** for MOAI-001 and MOAI-003, plus **Option 2: release-only publication with an explicit tag ref** for MOAI-007. These options preserve the existing CLI and Action shape while making the security invariants explicit and testable. We should still land narrow tactical patches first so the current release is protected during migration.

## Evidence and opportunities

| Opportunity | Findings | Recommendation |
| --- | --- | --- |
| One output trust boundary | [MOAI-001, Bearer redaction](../findings/bearer-redaction-bypass/bearer-redaction-bypass.md); [MOAI-003, runner marker](../findings/legacy-runner-command-marker/legacy-runner-command-marker.md) | Consolidate redaction and workflow-output neutralization behind named APIs, then test the final sinks. |
| Immutable release source | [MOAI-007, mutable npm publication ref](../findings/mutable-npm-publish-ref/mutable-npm-publish-ref.md) | Remove arbitrary manual refs or resolve only an approved release tag before OIDC publication. |

## Option 1: narrow local patches

We can make the Bearer expression case-insensitive, neutralize both `##[` and `::` before stdout, and require `refs/tags/` in the npm workflow. This is the quickest and most reversible path. It has low runtime and migration cost, but the invariants remain distributed and future output sinks can repeat the same mistake.

## Option 2: shared boundary APIs (recommended for output handling)

We can introduce explicit functions such as `redactSensitiveText` and `sanitizeWorkflowOutput`, keep them close to their sinks, and prohibit direct printing of untrusted fields through a review rule and tests. The model path receives already-redacted material, while the Action path receives runner-safe material. This adds negligible work to normal packets and makes future callers discoverable. The remaining risk is a missed caller, so a repository search and sink-focused tests are part of the rollout.

## Option 3: remove stdout as a data transport

We could write the packet to an artifact or file and print only a short status line. This gives the runner less untrusted text to parse, but it changes the Action contract, makes debugging less immediate, and adds artifact lifecycle and permissions concerns. It is a good future option for very large packets, not the first fix for the current findings.

## Publication options

For MOAI-007, Option 1 is to remove `workflow_dispatch` and publish only from a published release. Option 2 is to keep an explicit operator path but checkout `refs/tags/${tag}` after validating the tag and protect both the tag namespace and the npm environment. Option 2 is recommended when manual recovery is a real operational requirement; Option 1 is simpler and has the smallest privileged surface.

## Tradeoffs and validation

| Dimension | Output boundary | Immutable publication |
| --- | --- | --- |
| Security | Prevents credential and runner-command representations from crossing sinks; residual risk is an unreviewed sink. | Prevents a same-named branch from supplying the published tree; residual risk is a compromised release authority. |
| Performance/memory | Linear string passes over already-built text; expected cost is source-derived, not measured here. | No material runtime cost; tag verification adds one Git operation. |
| Reliability | Fail closed in tests and preserve readable escaped text; malformed content should not abort ordinary review packets. | Fail closed when the tag is absent, ambiguous, or not the release event's tag. |
| Operations | Central APIs and canary tests are easy to observe; migration requires a sink inventory. | Protected tags/environment and release permissions require repository administration. |
| Compatibility | Existing packet schema and CLI output can remain unchanged. | Manual publication semantics change; document the supported recovery path. |
| Rollback | Revert the helper change while retaining regression tests. | Re-enable only through an audited change to the workflow and protection rules. |

## Migration and acceptance criteria

1. Land the narrow fixes and regression tests for all case variants of Bearer, `##[`, and line-leading `::`.
2. Replace direct output calls with the shared boundary helpers and search for remaining untrusted stdout sinks.
3. Make npm publication tag-scoped, remove arbitrary branch refs, and protect the release tag/environment.
4. Validate with `npm run verify`, a disposable Action canary, and a package-content comparison between the release tag and the checked-out commit.
5. Roll back by reverting the helper/workflow commits; do not bypass tag protection or OIDC restrictions as an emergency workaround.

MOAI-002, MOAI-005, and MOAI-006 remain analyzer-quality follow-ups rather than reportable vulnerabilities. They should become explicit eval cases in a later quality iteration.
