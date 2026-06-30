# Maintenance Log: 2026-07-01

## Context

Today's maintenance focused on validating the first small live model-backed eval pass after an authorized local OpenAI API key became available.

## Completed

- Confirmed `.env.local` contains `OPENAI_API_KEY` without printing the secret value.
- Confirmed `.env.local` is ignored by Git and will not be committed.
- Ran a 2-case manual model-backed eval using `gpt-4o-mini`.
- Recorded the model-backed eval result in `docs/model-backed-eval-results-2026-07-01.md`.
- Added canonical label normalization for model-backed output.
- Added `npm run eval:model` as a manual-only live API eval command.
- Verified the command fails clearly without `OPENAI_API_KEY` instead of silently falling back to offline heuristics.
- Added budget, case-count, and output-token controls to `npm run eval:model`.
- Recorded an API-free security diff review for the label normalization and manual eval command changes.
- Replaced stale unverified model names with the verified `gpt-4o-mini` default in CLI defaults, UI copy, and OpenAI alignment docs.
- Re-ran the OpenSSF Scorecard workflow manually after the model eval maintenance PRs.
- Re-ran the 2-case live model-backed eval after explicit approval to spend up to `$0.50`.

## Verification

- `npm run build:cli` passed before the live eval.
- Both model outputs were accepted by `assertAssessment`.
- Both cases returned reasonable risk levels.
- Strict label matching failed in both cases because model labels were not normalized to the project's canonical label vocabulary.
- Follow-up implementation was verified without additional API calls.
- `npm test` passed with 29 unit tests.
- `npm run eval` passed 7 deterministic offline cases.
- `npm run eval:model` without `OPENAI_API_KEY` failed with the expected explicit credential error.
- `npm run eval:model -- --budget-usd 0.5 --max-cases 2 --max-output-tokens 1200` passed 2 live cases.
- Successful live eval estimated cost was `$0.000320`; approximate cumulative cost for failed and passing retry attempts in this pass was `$0.000968`, below the approved `$0.50` ceiling.
- Security diff review found no new reportable issue in the label normalization change.
- Model configuration was updated without making another live API call.
- OpenSSF Scorecard workflow run succeeded: `https://github.com/rtonf/maintainerops-ai/actions/runs/28457339237`.

## Next

- Keep model-backed evals manual-only and budget-gated.
- Expand the case set only after explicit approval for additional API spend.
