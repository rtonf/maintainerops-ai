# Maintenance Log: 2026-07-01

## Context

Today's maintenance focused on validating the first small live model-backed eval pass after an authorized local OpenAI API key became available.

## Completed

- Confirmed `.env.local` contains `OPENAI_API_KEY` without printing the secret value.
- Confirmed `.env.local` is ignored by Git and will not be committed.
- Ran a 2-case manual model-backed eval using `gpt-4o-mini`.
- Recorded the model-backed eval result in `docs/model-backed-eval-results-2026-07-01.md`.

## Verification

- `npm run build:cli` passed before the live eval.
- Both model outputs were accepted by `assertAssessment`.
- Both cases returned reasonable risk levels.
- Strict label matching failed in both cases because model labels were not normalized to the project's canonical label vocabulary.

## Next

- Add canonical label normalization for model-backed outputs.
- Re-run the same 2-case eval after normalization.
- Keep model-backed evals manual-only until the label contract is stable.
