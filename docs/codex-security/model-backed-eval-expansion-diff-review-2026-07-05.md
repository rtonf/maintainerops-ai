# Security Diff Review: Model-Backed Eval Expansion

Date: 2026-07-05

## Scope

Reviewed the working-tree change that expands manual model-backed eval readiness and the follow-up normalization changes from the approved live eval run.

Changed areas:

- `src/eval/run-model-eval.ts`
- `src/eval/run-model-eval.test.ts`
- `src/labels.ts`
- `src/labels.test.ts`
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
- Confirmed dependency-update label completion, metadata risk capping, and direct security-boundary action normalization do not add write behavior or broaden repository access.
- Confirmed the approved live API run stayed within the explicit `$0.50` budget ceiling.

## Verification

- `npm run verify`
- `npm run eval:model:list`
- Expected no-key guard: `npm run eval:model -- --max-cases 1`
- Approved live run: `npm run eval:model -- --suite all --budget-usd 0.5 --max-cases 10 --max-output-tokens 1200 --summary-json`

## Result

No new reportable security issue was found in this diff.

## Notes

- The new `examples/evals/model-backed.json` file contains synthetic or already-public maintainer workflow cases only.
- Live OpenAI API execution remains opt-in and budget-gated.
- The 10-case live model-backed eval passed after normalization fixes, with successful-run estimated cost `$0.001724` and cumulative estimate `$0.005114`.
