# v0.1.12 Release Plan

## Purpose

Prepare the next maintenance release around model-backed eval maturity and public evidence freshness.

## Candidate Changes

- Dedicated model-backed eval case file: `examples/evals/model-backed.json`.
- `npm run eval:model:list` for API-free case inspection.
- `npm run eval:model` support for `--suite`, `--case`, `--cases-file`, and `--summary-json`.
- Additional model-backed expectations for recommended action, forbidden recommended actions, min risk, and max risk.
- Unit tests for model eval argument parsing, suite selection, and result validation.
- Post-processing improvements for dependency update labels, metadata issue risk capping, and direct security-boundary action normalization.
- Documentation for the model-backed eval methodology and v0.1.12 expansion plan.

## Verification Before Release

- `npm run verify`
- `npm run eval:model:list`
- Live run after explicit API spend approval:

```bash
npm run eval:model -- --suite all --budget-usd 0.5 --max-cases 10 --max-output-tokens 1200 --summary-json
```

Result: passed 10 cases on 2026-07-05. Successful-run estimated cost was `$0.001724`; cumulative retry/pass estimate was `$0.005114`, below the approved `$0.50` ceiling.

## Release Notes Draft

MaintainerOps AI v0.1.12 expands model-backed eval readiness. It adds a dedicated 10-case model-backed eval file, smoke/expanded/all suite selection, targeted case execution, API-free case listing, stricter recommended-action and risk-bound checks, post-processing improvements found by the live eval, and updated methodology docs. The 10-case live model-backed eval passed within the approved budget. Live model-backed evals remain manual-only and budget-gated.

## Open Follow-Ups

- Refresh GitHub Marketplace after the GitHub Release is published so the public Action page displays the latest README evidence.
- Continue collecting external maintainer feedback in Issue #6 and convert real feedback into future eval cases.
