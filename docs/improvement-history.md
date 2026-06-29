# Improvement History

## 2026-06-09

- Created MaintainerOps AI as a human-in-the-loop OSS maintainer assistant.
- Added OpenAI Responses API structured output for review packets.
- Added offline heuristic fallback for cost control and deterministic CI.
- Added explicit live GitHub authorization gating.
- Added a Security Review Workbench UI prototype.
- Ran Codex Security repository scan and published the report.
- Fixed four reportable security findings:
  - PR workflows no longer pass `OPENAI_API_KEY` to PR-controlled code.
  - Structured and cloud credential forms are redacted before model submission.
  - JSON reports redact raw work item content.
  - Model-controlled Markdown is neutralized before GitHub Actions stdout.
- Added `npm run verify` with type checking, lint, formatting, unit tests, UI smoke tests, evals, and audit.
- Created public triage example issues for dependency advisory ingestion, release readiness, and prompt-injection-safe comment drafting.
- Published GitHub Release `v0.1.0`.
- Published npm package `maintainerops-ai`.
- Prepared `0.1.1` patch release to remove an accidental local npm authentication helper dependency from the package manifest.

## 2026-06-10

- Triaged, commented on, and closed public workflow issues #1 through #4 with MaintainerOps AI packets.
- Verified the public npm package by running `maintainerops --help` through `npm exec`.
- Added npm version/download badges and npm install evidence to the README evidence path.
- Generated review packet examples from real public repositories:
  - `rtonf/daily-hub-diary-app` pull request #1
  - `rtonf/daily-hub-diary-app` pull request #4
  - `rtonf/maintainerops-ai` issue #3
- Added a post-fix security rescan report summarizing fixed findings, verification commands, and remaining workflow activation risk.
- Documented the GitHub Actions activation blocker: the current GitHub OAuth token still needs `workflow` scope.
- Activated `.github/workflows/maintainerops.yml` after OAuth `workflow` scope was granted.
- Verified the active workflow with a successful manual `workflow_dispatch` run: `https://github.com/rtonf/maintainerops-ai/actions/runs/27284781369`.

## 2026-06-13

- Submitted the Codex for Open Source application using the public repository, npm package, Marketplace Action, Codex Security reports, evals, review packets, and Actions evidence.
- Re-ran `npm run verify` as the first post-application maintenance check.
- Confirmed npm latest remains `maintainerops-ai@0.1.4`.
- Confirmed the GitHub Marketplace listing is public at `https://github.com/marketplace/actions/maintainerops-ai`.
- Found that the Marketplace page still rendered the older `v0.1.4` release README, which contained stale npm-pending wording.
- Prepared `v0.1.5` as a GitHub Action release to refresh the Marketplace-facing README without rewriting an existing public tag; Marketplace still needs the release UI publish step if it displays `v0.1.4`.
- Added a dedicated 2026-06-13 maintenance log and kept Issue #6 as the public feedback target.
- Reworked the GitHub Action runtime to use a prebuilt `@vercel/ncc` bundle, removing per-user `npm ci` and TypeScript build steps from Marketplace workflows.
- Centralized the default OpenAI model in `src/defaults.ts` and changed README setup guidance to avoid hard-coding a changing model id as a user requirement.
- Added direct `offlineAnalyzer` unit coverage for security-sensitive PR routing, documentation issue triage, and large PR test-gap detection.
- Verified the bundled Action fixture path and completed `npm run verify` successfully after the changes.
- Confirmed the GitHub Marketplace listing displays `v0.1.5` as `Latest` and refreshed stale README evidence text.
- Removed local Windows user paths from public Codex Security reports.
- Hardened GitHub API error messages to avoid including response bodies in exceptions.
- Added a PR changed-file pagination cap and runtime enum validation for OpenAI assessment packets.

## 2026-06-15

- Prepared `v0.1.6` as the GitHub Action hardening release for Marketplace publication.
- Updated README, Marketplace notes, and external feedback instructions to use `rtonf/maintainerops-ai@v0.1.6`.
- Kept npm publication unchanged because the immediate goal is to publish the hardened GitHub Action runtime.
- Created GitHub Release `v0.1.6`, verified a fresh manual Actions run, and refreshed Issue #6 for external tester feedback.
- Confirmed GitHub Marketplace displays `v0.1.6` as the latest Action release.

## 2026-06-16

- Repaired Japanese promotion material and added public outreach drafts for X and note.
- Added a 2026-06-16 maintenance log with the first-week summary, current gaps, and next improvements.
- Updated README links so the promotion kit and Japanese outreach material are visible from the public project page.
- Marked the seven-day evidence plan complete through 2026-06-16.
- Published npm `maintainerops-ai@0.1.5` and verified public CLI execution from the registry.

## 2026-06-17

- Added a real review packet for Issue #6 and linked it from the review packet index.
- Fixed a concrete offline analyzer false-positive pattern for feedback/outreach issues that mention security evidence.
- Added unit and deterministic eval coverage for that false-positive case.
- Verified another fresh manual GitHub Actions run on `main`.

## 2026-06-18

- Reviewed the local project tree, GitHub releases, npm package state, Actions runs, and Issue #6 feedback status.
- Prepared source version `0.1.7` as the next npm and Marketplace publication candidate.
- Tightened feedback-request issue triage so outreach issues do not receive noisy security or release labels unless they describe actionable risk.
- Added forbidden-label support to deterministic evals.
- Refreshed public evidence wording so published npm/Marketplace versions and source release candidates are clearly separated.
- Added a release-alignment diff review and `v0.1.7` release candidate checklist.

## 2026-06-20

- Merged the `v0.1.7` release-alignment and feedback-triage improvements through PR #13.
- Published `maintainerops-ai@0.1.7` to npm and verified public CLI execution.
- Published GitHub Release `v0.1.7` and confirmed GitHub Marketplace displays `v0.1.7` as latest.
- Refreshed README, installation evidence, Marketplace examples, and maintenance logs with verified publication state.
- Enabled GitHub Discussions and created Discussion #17 as a public, bilingual external feedback entry point linked to Issue #6.

## 2026-06-22

- Reclassified Issue #6 with `help wanted` and a dedicated `feedback wanted` label.
- Verified a fresh manual Actions run and the complete local verification gate.
- Recorded that external feedback remains at zero and that model-backed eval execution requires an authorized `OPENAI_API_KEY`.

## 2026-06-23

- Ran a complete Codex Security repository-wide rescan across all 42 ranked source/runtime rows.
- Corrected the model-boundary operation order so secret redaction occurs before lossy truncation.
- Removed duplicate aggregate PR patch storage and bounded offline analyzer search text to prevent memory exhaustion.
- Tightened feedback-request and authorization signal matching to reduce routing false positives.
- Changed pull-request automation to a read-only `pull_request_target` path that executes a commit-pinned published Action without checking out contributor code.
- Added regression tests, rebuilt `dist-action/index.js`, and passed the complete verification gate with 26 unit tests and 0 npm audit vulnerabilities.
- Published the canonical rescan report, browser-readable HTML report, and post-fix remediation report.

## 2026-06-24

- Prepared source version `0.1.8` to publish the verified full-rescan remediation.
- Added release notes covering secret-redaction ordering, bounded patch analysis, routing correctness, and read-only workflow hardening.
- Kept public npm, GitHub Release, and Marketplace claims on `v0.1.7` until publication can be verified.
- Detected that the published npm `0.1.8` tarball omitted `dist/cli.js` after generated output was cleaned before publication.
- Withheld the `v0.1.8` GitHub and Marketplace releases and prepared `v0.1.9` with a mandatory `prepack` build.
- Published npm `0.1.9`, verified a clean registry installation, and deprecated broken npm `0.1.8`.
- Published GitHub Release and Marketplace `v0.1.9`, then pinned the active workflow to the release commit.

## 2026-06-29

- Confirmed the public GitHub Marketplace listing displays `v0.1.9` as the latest Action release.
- Refreshed public evidence so README, Issue #6, and maintenance logs match the aligned npm, GitHub Release, and Marketplace state.
- Reviewed and merged Dependabot's production OpenAI SDK update to `openai@6.45.0` after the full local verification gate passed.
- Replaced a stale Dependabot development dependency PR with a clean update from current `main` to avoid reverting the production OpenAI SDK lockfile update.
- Updated TypeScript, Vite, Playwright, ESLint, Prettier, and related development tooling, regenerated the Action bundle, and verified the result with `npm run verify` plus post-merge CodeQL.
- Added OpenSSF Scorecard as a weekly/manual supply-chain health workflow, fixed its initial permission-scope issue, and recorded the first successful scorecard report.
- Expanded the public security policy with private reporting instructions, response targets, vulnerability scope, and disclosure expectations.
- Enabled `main` branch protection with required status checks and recorded the verified configuration.
- Pinned GitHub Actions workflow dependencies to full commit SHAs while retaining version comments for reviewability.
- Adjusted Scorecard result storage to avoid a pinned subaction verification failure while keeping workflow dependencies pinned.
- Re-ran OpenSSF Scorecard successfully after the workflow pinning fixes and recorded the improved `6.8` score.

## 2026-06-30

- Documented the npm Trusted Publishing/provenance plan, including npm package-owner setup requirements and guardrails against adding an active publish workflow before the package settings are configured.
- Opened Issue #48 as the public tracker for npm Trusted Publishing/provenance setup.
- Refreshed Issue #6 with current external tester instructions and supply-chain hardening status.
- Documented the first model-backed eval milestone and recorded that live evals require an authorized OpenAI API key.
- Opened Issue #52 as the public tracker for manual model-backed eval implementation.
