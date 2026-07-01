# Release Plan: v0.1.10

## Goal

Publish the model-backed eval hardening work as the next source, npm, GitHub Release, and Marketplace-ready release.

## Candidate Changes

- npm version bump to `0.1.10`.
- npm Trusted Publishing workflow via `.github/workflows/npm-publish.yml`.
- Manual model-backed eval command: `npm run eval:model`.
- Budget controls for live evals:
  - `--budget-usd`
  - `--max-cases`
  - `--max-output-tokens`
- Expanded selected manual model-backed eval set from 2 cases to 5 cases.
- Usage and estimated cost reporting for `gpt-4o-mini` eval runs.
- Canonical label normalization for model-backed output.
- Work-item-aware safeguards:
  - pull requests without test-like files receive `tests-needed`
  - low-risk external feedback requests stay low risk
  - external feedback requests do not receive security or release labels unless the model recommends security review
  - release-readiness issues receive release-note handling without risk inflation unless security review is recommended
- Verified default OpenAI model: `gpt-4o-mini`.
- OpenSSF Scorecard manual rerun evidence from 2026-07-01.
- npm downloads API evidence: 343 downloads for 2026-06-22 through 2026-06-28.
- GitHub Marketplace evidence: public listing still displays `v0.1.9` as `Latest` before the `v0.1.10` release.

## Verification Required Before Release

- `npm run verify`
- `npm run eval:model -- --budget-usd 0.5 --max-cases 5 --max-output-tokens 1200` only if explicit API-spend approval is still active
- CodeQL on the release PR
- Marketplace Action smoke run after the GitHub Release is published
- npm install proof after publication

## Release Notes Draft

MaintainerOps AI `v0.1.10` adds the first budget-gated model-backed eval workflow and prepares npm Trusted Publishing. The manual `npm run eval:model` command supports bounded live OpenAI evals with explicit budget, case-count, and output-token controls. This release expands selected model-backed eval coverage to five cases, normalizes model-suggested labels to the project's canonical label vocabulary, keeps external feedback issues low risk unless the model recommends security review, and prevents release-readiness issues from inflating risk without an actionable security signal.

## Guardrails

- Do not add model-backed evals to CI.
- Do not spend API credits without explicit maintainer approval.
- Do not publish npm until release artifacts and install evidence are ready.
- Keep manual npm publish as fallback until npm Trusted Publishing in Issue #48 is completed.

## Current Status

- Source changes are merged.
- Source release preparation is in progress.
- Local `npm run verify` passed for the release candidate.
- The 5-case live model-backed eval passed with estimated cost `$0.000803`, below the approved `$0.50` ceiling.
- npm latest remains `maintainerops-ai@0.1.9` until the release is published.
- GitHub Release and Marketplace latest remain `v0.1.9`.
- Issue #48 tracks the first Trusted Publishing release confirmation.
- Issue #60 tracks continuing model-backed eval expansion after the first 5-case release-candidate pass.
