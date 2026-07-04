# v0.1.12 Release Plan

## Purpose

Prepare the next maintenance release around model-backed eval maturity and public evidence freshness.

## Candidate Changes

- Dedicated model-backed eval case file: `examples/evals/model-backed.json`.
- `npm run eval:model:list` for API-free case inspection.
- `npm run eval:model` support for `--suite`, `--case`, `--cases-file`, and `--summary-json`.
- Additional model-backed expectations for recommended action, forbidden recommended actions, min risk, and max risk.
- Unit tests for model eval argument parsing, suite selection, and result validation.
- Documentation for the model-backed eval methodology and v0.1.12 expansion plan.

## Verification Before Release

- `npm run verify`
- `npm run eval:model:list`
- Optional live run only after explicit API spend approval:

```bash
npm run eval:model -- --suite all --budget-usd 0.5 --max-cases 10 --max-output-tokens 1200 --summary-json
```

## Release Notes Draft

MaintainerOps AI v0.1.12 expands model-backed eval readiness. It adds a dedicated 10-case model-backed eval file, smoke/expanded/all suite selection, targeted case execution, API-free case listing, stricter recommended-action and risk-bound checks, and updated methodology docs. Live model-backed evals remain manual-only and budget-gated.

## Open Follow-Ups

- Do not publish until the optional live model-backed eval run is approved or explicitly deferred.
- Refresh GitHub Marketplace after the GitHub Release is published so the public Action page displays the latest README evidence.
- Continue collecting external maintainer feedback in Issue #6 and convert real feedback into future eval cases.
