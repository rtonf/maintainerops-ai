# Model-Backed Eval Expansion Plan: v0.1.12

This is the no-API preparation queue for Issue #60. These cases should be added to the manual model-backed eval set only after fixtures are finalized. Live execution must remain explicit and budget-gated.

## Candidate Cases

| Case                                 | Source                             | Expected labels                                                                                    | Risk expectation | Why it matters                                                                                              |
| ------------------------------------ | ---------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------- |
| Marketplace release refresh issue    | `rtonf/maintainerops-ai` Issue #67 | `needs-triage`, `release-notes`                                                                    | max `low`        | Release-channel drift should create release-maintenance guidance without inflating security risk.           |
| License detection follow-up issue    | `rtonf/maintainerops-ai` Issue #69 | `needs-triage`                                                                                     | max `low`        | Repository metadata cleanup should not be treated as a vulnerability.                                       |
| External maintainer feedback request | `rtonf/maintainerops-ai` Issue #6  | `needs-triage`; no `security-review`; no `release-notes` unless concrete vuln/release data appears | max `low`        | Outreach text often mentions security evidence, but the tool should avoid false-positive security labeling. |

## Acceptance Criteria

- Each case has a stable fixture or GitHub work item reference.
- Expected labels are canonical project labels after normalization.
- Forbidden-label checks are included for outreach and metadata-only cases.
- Live model runs are invoked only with `--budget-usd`, `--max-cases`, and `--max-output-tokens`.

## Suggested First Live Run

```bash
npm run eval:model -- --budget-usd 0.5 --max-cases 3 --max-output-tokens 1200
```

Do not run this in CI. Do not run it without explicit approval for API spend.
