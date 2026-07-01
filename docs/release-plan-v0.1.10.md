# Release Plan: v0.1.10

## Goal

Publish the model-backed eval hardening work as the next source, npm, GitHub Release, and Marketplace-ready release.

## Candidate Changes

- Manual model-backed eval command: `npm run eval:model`.
- Budget controls for live evals:
  - `--budget-usd`
  - `--max-cases`
  - `--max-output-tokens`
- Usage and estimated cost reporting for `gpt-4o-mini` eval runs.
- Canonical label normalization for model-backed output.
- Work-item-aware safeguards:
  - pull requests without test-like files receive `tests-needed`
  - low-risk external feedback requests stay low risk
  - external feedback requests do not receive security or release labels unless the model recommends security review
- Verified default OpenAI model: `gpt-4o-mini`.
- OpenSSF Scorecard manual rerun evidence from 2026-07-01.

## Verification Required Before Release

- `npm run verify`
- `npm run eval:model -- --budget-usd 0.5 --max-cases 2 --max-output-tokens 1200` only if explicit API-spend approval is still active
- CodeQL on the release PR
- Marketplace Action smoke run after the GitHub Release is published
- npm install proof after publication

## Release Notes Draft

MaintainerOps AI `v0.1.10` adds the first budget-gated model-backed eval workflow. The new manual `npm run eval:model` command supports bounded live OpenAI evals with explicit budget, case-count, and output-token controls. This release also normalizes model-suggested labels to the project's canonical label vocabulary and keeps external feedback issues low risk unless the model recommends security review.

## Guardrails

- Do not add model-backed evals to CI.
- Do not spend API credits without explicit maintainer approval.
- Do not publish npm until release artifacts and install evidence are ready.
- Keep manual npm publish as fallback until npm Trusted Publishing in Issue #48 is completed.

## Current Status

- Source changes are merged.
- npm latest remains `maintainerops-ai@0.1.9`.
- GitHub Release and Marketplace latest remain `v0.1.9`.
- Issue #60 tracks expanding model-backed eval cases after this milestone.
