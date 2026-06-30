# Security Diff Review: Model Eval Label Normalization

Date: 2026-07-01

## Scope

Reviewed the working-tree change that adds model-backed label normalization and a manual `npm run eval:model` command.

Changed areas:

- `src/labels.ts`
- `src/openaiAssessment.ts`
- `src/eval/run-model-eval.ts`
- tests and documentation
- regenerated `dist-action/index.js`

## Checks Performed

- Confirmed model-backed labels are normalized after schema validation.
- Confirmed `npm run eval:model` fails clearly when `OPENAI_API_KEY` is missing.
- Confirmed `npm run verify` passes without running live model-backed evals.
- Searched for accidental secret material in changed source, docs, and generated Action bundle.

## Result

No new reportable security issue was found in this diff.

## Notes

- The new model-backed eval command is intentionally manual-only and is not included in CI, so routine checks do not spend API credits.
- The new command requires `OPENAI_API_KEY` and does not silently fall back to offline heuristics.
- The label normalization layer changes model output labels only; it does not add GitHub mutation, auto-merge, auto-close, release publishing, or external scanning behavior.
