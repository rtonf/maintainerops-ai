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
