# Manual npm publication accepts a mutable branch ref for Trusted Publishing

**Severity:** High  
**Affected source:** the publication workflow and release verification logic at revision `40ab2aaf0875d0b9074642ba4f51223f1bd4200a`  
**Validation:** bounded local source review and a disposable Git ref-namespace probe; no live workflow, OIDC token, or npm publication was used

## Executive Summary

The manual publication path treats a user-supplied release tag as an
unqualified Git ref. A write-capable actor can supply a value such as
`v0.1.15` while a branch with that name exists. The workflow's checkout action
accepts branch names, tag names, and commit SHAs, so the value can select
`refs/heads/v0.1.15` rather than the intended `refs/tags/v0.1.15`.

That distinction matters because the workflow executes the selected checkout
before it publishes. It runs `npm ci`, loads `scripts/verify-release-tag.mjs`
from that checkout, runs the checkout's `npm run verify` scripts, and finally
runs `npm publish --access public` with job-level `id-token: write`. The
verifier checks only that the input text equals `v` plus the selected
`package.json` version; it does not establish that the input names a tag or
that the tag resolves to an immutable release commit. The selected branch can
also modify the verifier and the package scripts themselves.

The result is a release-integrity failure: a repository writer, or an attacker
controlling such an account, can make the trusted publication job execute and
package branch-controlled code. If the npm Trusted Publisher is configured
for this repository and workflow, the resulting `npm publish` runs through
that trust relationship and can deliver branch-controlled package contents to
consumers.

The affected source is the workflow shape present at the reviewed revision;
the package metadata at that revision reports version `0.1.14`. I reviewed the
revision directly and ran only the safe local ref probe included with this
report. I did not trigger GitHub Actions, request an OIDC token, contact the
npm registry, or test a live publication. I found no fixing revision in the
reviewed history, so an exact fixed-version boundary is not established.

## Background

The workflow supports two publication triggers: a published GitHub Release
and `workflow_dispatch`. The manual trigger declares a free-form string input
named `tag`:

```yaml
# .github/workflows/npm-publish.yml:6-15
workflow_dispatch:
  inputs:
    tag:
      description: "Release tag to publish, for example v0.1.10"
      required: true
      type: string

permissions:
  contents: read
  id-token: write
```

The job is intended to publish only stable release tags. Its package-level
identity is `maintainerops-ai`; at the reviewed revision,
`package.json` declares version `0.1.14` and a `verify` script that chains the
build, test, evaluation, packaging, and audit checks.

Trusted Publishing changes the security boundary of this workflow. npm
associates a trusted publisher with a repository and workflow filename, with
an optional environment. It does not, by itself, turn the workflow's
user-supplied checkout value into an immutable tag identity. The relevant npm
configuration model is documented at
<https://docs.npmjs.com/trusted-publishers/>. GitHub's manual workflow
documentation states that a repository writer can start a `workflow_dispatch`
run; the workflow documentation is at
<https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow>.

Pinning `actions/checkout` to a commit protects the action implementation, but
it does not pin the repository content passed through its `ref` input. The
checkout action documents that this input may name a branch, tag, or SHA; the
workflow does not qualify the value as `refs/tags/...` or resolve it to a SHA.

## Vulnerability Details

### Trigger and ref selection

The manual input reaches the job condition, environment, and checkout without
a namespace check:

```yaml
# .github/workflows/npm-publish.yml:22-30
if: startsWith(github.event.release.tag_name || inputs.tag, 'v') && (github.event_name != 'release' || !github.event.release.prerelease)
env:
  RELEASE_TAG: ${{ github.event.release.tag_name || inputs.tag }}
steps:
  - name: Checkout release ref
    uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7
    with:
      ref: ${{ github.event.release.tag_name || inputs.tag }}
      persist-credentials: false
```

The `startsWith(..., 'v')` expression is only a prefix filter. It does not
require a semantic-version-shaped tag and, more importantly, it does not
require the `refs/tags/` namespace. Git permits a branch and a tag to share
the same leaf name. Thus the text `v0.1.15` can represent either of these
different objects:

| Input text | Possible resolved ref | Security meaning |
| --- | --- | --- |
| `v0.1.15` | `refs/tags/v0.1.15` | Intended release tag |
| `v0.1.15` | `refs/heads/v0.1.15` | Mutable branch selected as release source |

The bundled local probe creates both refs and points them at different
commits. That is enough to establish the missing namespace invariant without
running the remote workflow. We first prove that both names are valid, then
compare their explicitly qualified commit IDs; the branch and tag remain
distinct even though the workflow input is identical.

### Selected source executes before publication

Once the mutable branch is checked out, subsequent commands operate on files
supplied by that branch:

```yaml
# .github/workflows/npm-publish.yml:38-51
- name: Install dependencies
  run: npm ci

- name: Verify release tag matches package version
  run: node scripts/verify-release-tag.mjs "$RELEASE_TAG"

- name: Verify package
  run: npm run verify

- name: Publish package
  run: npm publish --access public
```

The `npm run verify` command is not a workflow-defined, immutable command
list. In the reviewed `package.json`, it expands to the selected checkout's
`check`, lint, formatting, source tests, UI tests, evaluation, package, and
audit scripts. A branch-controlled `package.json`, source tree, lockfile, or
package lifecycle hook therefore controls what the runner executes before the
publish step. The workflow also installs dependencies from that checkout
before the explicit verifier runs.

The trust check does not repair this boundary. `scripts/verify-release-tag.mjs`
is itself loaded from the selected checkout:

```js
// scripts/verify-release-tag.mjs:4-14
export function verifyReleaseTag(tag, version) {
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(`Stable npm publishing requires a stable semantic version, got ${version}.`);
  }

  const expectedTag = `v${version}`;
  if (tag !== expectedTag) {
    throw new Error(
      `Release tag ${tag || "<missing>"} does not match package version ${version}; expected ${expectedTag}.`
    );
  }
}
```

For an unmodified verifier, a branch named `v0.1.15` only needs to contain a
stable `package.json` version `0.1.15` for the check to pass. The check proves
textual agreement between two values that came from the same mutable
checkout; it never proves that the checkout came from a tag. A branch can
also replace this module or the `verify` script, but that stronger bypass is
not required to demonstrate the root cause.

### Concrete attack path

We can carry the attacker-controlled value through the complete path as
follows:

1. A write-capable actor creates or controls `refs/heads/v0.1.15` and gives it
   a package version of `0.1.15`. The branch can contain altered source or
   build/package scripts while retaining a usable lockfile.
2. The actor manually starts the workflow with `tag=v0.1.15`. The job's
   prefix check passes, and the unqualified checkout can select the branch.
3. The runner installs and verifies the selected tree. The unchanged verifier
   accepts the matching text/version pair, while the selected package scripts
   control the checks and build outputs.
4. The job reaches `npm publish --access public` with `id-token: write`. The
   publication step therefore operates after attacker-controlled code has run
   inside the trusted publishing job.

`persist-credentials: false` prevents checkout from persisting its Git
credential, which is useful hardening but does not change the source identity
or remove the OIDC permission. The release-event branch uses a
GitHub-provided `tag_name`, but it is passed through the same unqualified
checkout input; the manual path is the direct attacker-controlled trigger,
and both paths should be covered by the fix.

## Exploitability Analysis

The strongest practical route is a compromised or malicious repository writer
using a branch whose leaf name looks exactly like the intended release tag.
The attacker does not need to alter the default-branch workflow file: manual
dispatch supplies the workflow definition, while checkout supplies the files
that later commands execute. This makes the path viable even when the default
branch is protected and the workflow action pins are correct.

The branch can satisfy the existing checks without changing the verifier by
matching the package version to the branch/tag-shaped input. It can instead
alter the verifier, the `verify` command, a build script, a test hook, or the
packaged files. The latter options are operationally simpler because all of
these files are selected before the publish step. The package must still pass
the practical constraints of `npm ci`, the configured checks, and npm's
package/version and trusted-publisher rules; those constraints reduce
reliability but do not restore release identity.

A second route is a mutable branch that already shares a name with a release
tag and is updated after the expected release source has been reviewed. The
workflow has no commit comparison, so the branch tip selected at run time is
the source that reaches the build. This route is particularly useful where
branch creation is monitored but branch updates receive less scrutiny.

The meaningful boundary is authorization, not public reachability. The actor
needs repository write access and the ability to start the manual workflow.
There is no evidence here of an unauthenticated public trigger. Conversely,
the presence of branch protection, a stable-semver check, full verification,
OIDC provenance, and pinned actions does not prevent this actor from choosing
the wrong source before those controls run.

I did not attempt the remote trigger or npm publication, so this report does
not claim a live package overwrite or a recovered OIDC token. The source-backed
impact is already sufficient for release-integrity risk: attacker-controlled
code executes in the publication job, and the final publish command is placed
after that execution under the job's trusted identity.

## Proof of Concept

The safe artifact in `poc/` creates a temporary local Git repository, adds
both `refs/heads/v0.1.15` and `refs/tags/v0.1.15`, moves the branch to a second
commit, and prints the two explicitly resolved commit IDs. It does not invoke
GitHub Actions or emulate `npm publish`; it isolates the exact missing
namespace check.

From the report directory, run:

```sh
cd poc
node ref-ambiguity.mjs
```

Representative output:

```text
[+] refs/heads/v0.1.15 -> 8a6f5e4c1d2b
[+] refs/tags/v0.1.15  -> 1f93c8b7a204
[+] the same input text is valid for both ref namespaces
[+] no network, Actions runner, OIDC token, or npm publish was used
```

The commit IDs are intentionally generated in a temporary repository and will
differ between runs. The probe requires Node.js 20 or newer and Git, and it
removes its temporary repository automatically. No cleanup is needed beyond
the command completing.

On a corrected workflow, the equivalent checkout must use the tag namespace
or an immutable commit SHA. The local probe is expected to continue showing
that Git supports both namespaces; the security property is that the
publication workflow no longer accepts the unqualified text as its source
selector.

## Remediation

The invariant to restore is: **before any selected repository code executes,
the publication job must select the intended release tag namespace and, for a
strong release-integrity guarantee, the immutable commit resolved from that
tag.** A package version string is not a substitute for Git object identity.

The smallest direct correction for the branch/tag confusion is to qualify the
checkout ref:

```yaml
env:
  RELEASE_TAG: ${{ github.event.release.tag_name || inputs.tag }}

steps:
  - name: Checkout release tag
    uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7
    with:
      ref: refs/tags/${{ env.RELEASE_TAG }}
      persist-credentials: false
```

This prevents `refs/heads/v0.1.15` from satisfying an input intended for
`v0.1.15`. The workflow should also reject anything other than the expected
stable tag shape before checkout, rather than relying on `startsWith`.

For stronger protection against a tag being moved, the workflow should use a
trusted preflight step or job to resolve `refs/tags/$RELEASE_TAG` to a commit
SHA, require the expected tag object type and policy, and pass only that SHA
to the publishing job:

```yaml
# The preflight runs trusted, pinned tooling and emits commit_sha.
- name: Checkout immutable release commit
  uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7
  with:
    ref: ${{ needs.resolve-release.outputs.commit_sha }}
    persist-credentials: false
```

The existing verifier remains useful as defense in depth, but it should be
fed the preflight's resolved identity or otherwise compare the checked-out
commit with the approved tag target. The check must happen before
`npm ci`, `npm run verify`, or any other command whose definition comes from
the selected tree. Removing `workflow_dispatch` entirely and allowing only a
protected release event is a simpler option if manual republishing is not a
requirement.

The publication job should also be placed behind a protected GitHub
Environment, and the same environment should be named in npm Trusted
Publishing. Require approval for manual publication and keep the publish job's
permissions minimal. Regression coverage should create a temporary repository
with the same branch/tag leaf name, assert that the workflow source selector
is fully qualified or a SHA, and exercise a mismatched tag/version plus a
matching version on the wrong namespace. A static workflow policy test should
fail if a publication checkout again receives an unqualified release input.

## Summary

The vulnerability is caused by confusing release-tag text with release-tag
identity. The manual input passes a mutable branch-capable value into
`actions/checkout`; the subsequent verifier checks only text and package
version from the selected tree. We demonstrated the missing Git invariant
locally by creating distinct branch and tag refs with the same leaf name, and
we traced the selected source through dependency installation, verification,
build/test commands, and the final OIDC-enabled publish step.

The practical fix is to remove arbitrary manual source selection or bind it to
`refs/tags/<tag>` and then to an immutable, preflight-resolved commit before
running selected code. Future variant review should search other release and
deployment workflows for unqualified `checkout.ref` values, especially where
the next steps receive cloud, package-registry, signing, or deployment
credentials.
