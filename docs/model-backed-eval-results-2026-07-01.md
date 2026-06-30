# Model-Backed Eval Results: 2026-07-01

## Scope

This was the first small live OpenAI model-backed eval pass for MaintainerOps AI after an authorized local API key was configured.

- Model: `gpt-4o-mini`
- Cases: 2
- Execution mode: local manual run only
- CI status: not enabled
- Secret handling: API key loaded from ignored local `.env.local`; no key value was printed or committed

## Results

| Case                                               | Schema | Risk | Recommended action      | Label expectation | Notes                                                                                                    |
| -------------------------------------------------- | ------ | ---- | ----------------------- | ----------------- | -------------------------------------------------------------------------------------------------------- |
| security-sensitive pull request without tests      | Pass   | high | `needs_security_review` | Fail              | Model used semantic labels `security` and `needs_security_review` instead of canonical expected labels.  |
| external feedback issue mentions security evidence | Pass   | low  | `needs_human_review`    | Fail              | Model avoided forbidden labels, but used `feedback`, `security`, and `triage` instead of `needs-triage`. |

## Findings

- The Responses API path successfully returned valid structured JSON accepted by `assertAssessment`.
- Both cases produced reasonable risk levels.
- The external feedback issue stayed low risk and did not include the forbidden labels `security-review` or `release-notes`.
- Label vocabulary is not stable enough for strict eval matching.

## Follow-Up

1. Add a canonical label mapping layer for model-backed output.
2. Update model prompts to prefer existing project labels such as `needs-triage`, `security-review`, and `tests-needed`.
3. Keep model-backed evals manual-only until label normalization is implemented and re-tested.
