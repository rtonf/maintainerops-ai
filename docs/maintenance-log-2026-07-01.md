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
- Closed Issue #52 as the completed first manual model-backed eval milestone.
- Opened Issue #60 to track expanded model-backed eval cases.
- Added the `v0.1.10` release plan.
- Prepared `.github/workflows/npm-publish.yml` for npm Trusted Publishing after the package-owner setup was reported complete.
- Bumped the source package version to `0.1.10` for the next release candidate.
- Expanded the selected manual model-backed eval set to 5 cases.
- Recorded current public package evidence: npm latest `0.1.9`, Marketplace latest `v0.1.9`, and 343 npm downloads for 2026-06-22 through 2026-06-28.

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
- `npm run eval:model -- --budget-usd 0.5 --max-cases 5 --max-output-tokens 1200` passed 5 live cases.
- Successful live eval estimated cost was `$0.000320`; approximate cumulative cost for failed and passing retry attempts in this pass was `$0.000968`, below the approved `$0.50` ceiling.
- The expanded 5-case live eval estimated cost was `$0.000803`, below the approved `$0.50` ceiling.
- Security diff review found no new reportable issue in the label normalization change.
- Model configuration was updated without making another live API call.
- OpenSSF Scorecard workflow run succeeded: `https://github.com/rtonf/maintainerops-ai/actions/runs/28457339237`.
- Issue #52 closed as completed: `https://github.com/rtonf/maintainerops-ai/issues/52`.
- Issue #60 opened for eval expansion: `https://github.com/rtonf/maintainerops-ai/issues/60`.
- `npm run verify` passed for the `v0.1.10` release-candidate changes with 35 unit tests, 1 Playwright UI smoke test, 7 deterministic eval cases, package dry run, publint, and 0 npm audit vulnerabilities.
- Published the `v0.1.10` GitHub Release.
- The first npm Trusted Publishing run failed before checkout because the `actions/setup-node` pin pointed at a non-existent v7 SHA.
- Corrected the publish workflow to the verified `actions/setup-node` v6 tag SHA.

## Next

- Keep model-backed evals manual-only and budget-gated.
- Re-run the `Publish npm package` workflow manually with `tag=v0.1.10`.
- Confirm the npm Trusted Publishing workflow publishes `maintainerops-ai@0.1.10`.
- Refresh npm install evidence, README evidence, Issue #48, and Issue #6 after publication.
