# Maintenance Log: 2026-07-05

Today's maintenance focused on API-backed eval readiness without making new API calls.

## Completed

- Rechecked npm latest: `maintainerops-ai@0.1.11`.
- Rechecked GitHub Release latest: `v0.1.11`.
- Rechecked GitHub Marketplace: listing shows `v0.1.11`, but the Marketplace-rendered README still showed older evidence text from the latest Marketplace release snapshot.
- Rechecked open issues: only Issue #6 and Issue #60 remain open.
- Expanded `npm run eval:model` from a fixed smoke selection to a dedicated model-backed eval case file with `smoke`, `expanded`, and `all` suites.
- Added API-free case listing with `npm run eval:model:list`.
- Added explicit `--case`, `--cases-file`, and `--summary-json` controls.
- Added checks for expected recommended action, forbidden recommended actions, minimum risk, and maximum risk.
- Added 10 model-backed eval candidates covering security, release readiness, dependency updates, Marketplace release drift, license metadata, and external feedback false positives.
- Added unit tests for model eval argument parsing, case selection, and result validation.
- Added model-backed eval methodology and v0.1.12 release planning docs.
- Added an API-free security diff review for the model-backed eval expansion.
- Merged PR #72 after required checks passed.
- Closed Issue #60 as complete after the 10-case expansion landed.
- Opened Issue #73 for the remaining explicitly approved live 10-case model-backed eval run.
- Ran the Issue #73 live 10-case model-backed eval after explicit API approval.
- Fixed normalization gaps found by the live eval: dependency update labels, metadata risk capping, equivalent issue actions, and direct security-boundary actions.
- Re-ran the 10-case model-backed eval successfully.

## Verification

- `npm run build:cli`
- `node dist/eval/run-model-eval.js --list --suite all`
- `npm test`
- `npm run verify`
- `npm run eval:model:list`
- Expected no-key guard: `npm run eval:model -- --max-cases 1` failed clearly with `OPENAI_API_KEY is required for model-backed evals.`
- Security diff review: `docs/codex-security/model-backed-eval-expansion-diff-review-2026-07-05.md`
- PR #72 checks passed before merge.
- Post-merge CodeQL run passed on `main`.
- `npm run eval:model -- --suite all --budget-usd 0.5 --max-cases 10 --max-output-tokens 1200 --summary-json`; passed 10 cases.

## API Usage

Initial work in this maintenance pass made no OpenAI API calls.

Later in this maintenance pass, explicit API execution was approved for Issue #73:

- Successful-run estimated cost: `$0.001724`.
- Cumulative estimate across failed/adjusted/passing runs: `$0.005114`.
- Approved ceiling: `$0.50`.

## Next

- Prepare and publish the v0.1.12 release.
- Refresh GitHub Marketplace after the release is published.
