# Maintenance Log: 2026-06-23

## Context

Today's maintenance completed a full repository-wide Codex Security rescan and remediated every reportable finding.

## Completed

- Closed all 42 deterministic scan worklist rows with explicit receipts.
- Validated six security candidates and completed attack-path analysis for each.
- Fixed two reportable findings affecting model-boundary secret handling and offline analyzer memory use.
- Added regression tests for prompt redaction, bounded patch analysis, and false-positive routing.
- Hardened the public pull-request workflow and regenerated the committed Action bundle.
- Ran the complete local verification gate successfully.
- Generated public Markdown, HTML, and fix reports.
- Merged the remediation through PR #20.
- Opened Issue #21 to track npm, GitHub Release, and Marketplace publication for `v0.1.8`.
- Verified the merged issue-triggered workflow on GitHub Actions.
- Removed merged local branches, pruned stale remote-tracking refs, and confirmed `main` is the only active GitHub branch.
- Removed regenerated build/test output, an obsolete local environment example, a duplicate screenshot, an empty design directory, and the superseded 2026-06-08 temporary scan workspace.
- Kept `node_modules` for ongoing development, the latest full-scan workspace for the `v0.1.8` release audit, and all public security evidence.
- Synchronized the documented workflow example with the active read-only, commit-pinned workflow.

## Evidence

- Full rescan: `docs/codex-security/full-rescan-2026-06-23.md`
- Browser-readable report: `docs/codex-security/full-rescan-2026-06-23.html`
- Remediation report: `docs/codex-security/full-rescan-fix-report-2026-06-23.md`
- Merged remediation: `https://github.com/rtonf/maintainerops-ai/pull/20`
- Release tracker: `https://github.com/rtonf/maintainerops-ai/issues/21`
- Successful issue-triggered run: `https://github.com/rtonf/maintainerops-ai/actions/runs/28002820413`
- Successful pull-request-triggered run: `https://github.com/rtonf/maintainerops-ai/actions/runs/28002857175`
- Local verification: 26 unit tests, 1 UI smoke test, 7 deterministic eval cases, package validation, publint, and npm audit with 0 vulnerabilities

## Current Gaps

- The scan did not run a live model-backed adversarial eval because `OPENAI_API_KEY` was not configured.
- External maintainer feedback on Issue #6 and Discussion #17 remains the largest evidence gap.

## Next Actions

1. Publish the verified fixes as `maintainerops-ai@0.1.8` with maintainer OTP.
2. Create GitHub Release `v0.1.8` and refresh the Marketplace listing.
3. Convert the first external maintainer response into a regression eval and improvement record.
