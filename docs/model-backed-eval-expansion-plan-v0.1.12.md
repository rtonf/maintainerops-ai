# Model-Backed Eval Expansion Plan: v0.1.12

This is the model-backed eval expansion queue for Issue #60. The v0.1.12 source tree now includes the first dedicated manual model-backed eval file at `examples/evals/model-backed.json`. Live execution must remain explicit and budget-gated.

## Candidate Cases

| Case                                 | Source                             | Expected labels                                                                                    | Risk expectation | Why it matters                                                                                              |
| ------------------------------------ | ---------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------- |
| Marketplace release refresh issue    | `rtonf/maintainerops-ai` Issue #67 | `needs-triage`, `release-notes`                                                                    | max `low`        | Release-channel drift should create release-maintenance guidance without inflating security risk.           |
| License detection follow-up issue    | `rtonf/maintainerops-ai` Issue #69 | `needs-triage`                                                                                     | max `low`        | Repository metadata cleanup should not be treated as a vulnerability.                                       |
| External maintainer feedback request | `rtonf/maintainerops-ai` Issue #6  | `needs-triage`; no `security-review`; no `release-notes` unless concrete vuln/release data appears | max `low`        | Outreach text often mentions security evidence, but the tool should avoid false-positive security labeling. |
| Missing authorization check issue    | Synthetic issue fixture            | `needs-triage`, `security-review`                                                                  | min `medium`     | Prevents false negatives on actionable access-control reports.                                              |

## Acceptance Criteria

- Each case has a stable fixture or GitHub work item reference.
- Expected labels are canonical project labels after normalization.
- Expected recommended actions are checked for high-risk and low-risk cases.
- Risk lower and upper bounds are checked.
- Forbidden-label checks are included for outreach and metadata-only cases.
- Live model runs are invoked only with `--budget-usd`, `--max-cases`, and `--max-output-tokens`.

## Suggested First Live Run

```bash
npm run eval:model -- --budget-usd 0.5 --max-cases 3 --max-output-tokens 1200
```

Do not run this in CI. Do not run it without explicit approval for API spend.

## API-Free Readiness Commands

```bash
npm run eval:model:list
npm test
npm run eval
```
