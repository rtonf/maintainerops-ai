# Security Diff Review: Model-Backed Eval Expansion

Date: 2026-07-05

## Scope

Reviewed the working-tree change that expands manual model-backed eval readiness without adding automatic API execution.

Changed areas:

- `src/eval/run-model-eval.ts`
- `src/eval/run-model-eval.test.ts`
- `examples/evals/model-backed.json`
- `package.json`
- model-backed eval and release planning documentation

## Checks Performed

- Confirmed `npm run eval:model` remains manual-only and is not included in `npm run verify` or CI.
- Confirmed `npm run eval:model:list` can inspect cases without requiring `OPENAI_API_KEY`.
- Confirmed `npm run eval:model -- --max-cases 1` fails clearly when `OPENAI_API_KEY` is absent.
- Confirmed new live eval controls keep explicit budget, case count, output token, suite, and targeted case selection.
- Searched changed eval source, fixtures, and docs for accidental API keys or token material.
- Confirmed the new eval fixtures do not add GitHub mutation, auto-merge, auto-close, auto-label, release publishing, or unauthorized repository scanning behavior.

## Verification

- `npm run verify`
- `npm run eval:model:list`
- Expected no-key guard: `npm run eval:model -- --max-cases 1`

## Result

No new reportable security issue was found in this diff.

## Notes

- The new `examples/evals/model-backed.json` file contains synthetic or already-public maintainer workflow cases only.
- Live OpenAI API execution remains opt-in and budget-gated.
- The release plan explicitly says not to publish v0.1.12 until the optional live eval run is approved or explicitly deferred.
