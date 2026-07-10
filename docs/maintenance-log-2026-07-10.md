# Maintenance Log: 2026-07-10

Today's maintenance focused on turning the repository review into product-quality gates for the next code-bearing release.

## Completed locally

- Reproduced the `latest.ts` test-file false positive and replaced substring matching with shared path-aware conventions.
- Reproduced the public Issue #6 false positive caused by authorization-policy wording and added it as a regression case.
- Made CLI issue and pull request numbers reject partial and unsafe integers.
- Added nested runtime validation for fixture files, checks, arrays, metadata, and optional string fields.
- Made deterministic and model-backed evals fail closed on empty case sets.
- Added deterministic recommended-action, risk, and evidence assertions.
- Added a conservative pre-call model-eval budget ceiling while retaining post-call usage accounting.
- Added GitHub Actions Step Summary and redacted multiline `report` output support.
- Changed Action fixture paths to resolve from the caller workspace.
- Added npm release tag/package version equality and stable-release guards.
- Prepared Scorecard SARIF upload to refresh stale code-scanning alerts.
- Moved CodeQL `security-events: write` from workflow scope to the analysis job.
- Updated contributor guidance, roadmap status, eval documentation, and Japanese no-key demo CTAs.
- Completed the API-free security diff review on 2026-07-11 with no reportable findings.

## Verification

- `npm run check`
- `npm run test:src`: 67 tests passed
- `npm run eval`: 7 cases passed
- Full `npm run verify` and GitHub checks are required before merge.

## External evidence status

- npm, GitHub Release, and Marketplace remain aligned on `v0.1.14` until the next release is intentionally prepared.
- Issue #6 still has no external maintainer report; owner-authored status updates do not count toward the 5-10 report goal.
- The next useful feedback evidence is an external packet run, its usefulness/noise assessment, and a resulting regression or onboarding change.

## Next

- Publish the hardening change through a pull request and confirm required checks.
- After merge, run OpenSSF Scorecard and reconcile current code-scanning alerts in Issue #92.
- Prepare `v0.1.15` only after source, Action bundle, docs, and scan evidence are aligned.
