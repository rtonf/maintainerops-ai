# Model-Backed Eval Methodology

MaintainerOps AI uses model-backed evals to test the OpenAI API path without giving the model authority to merge, close, label, publish, or scan repositories.

## Case Sources

Model-backed cases live in `examples/evals/model-backed.json`.

Cases can be:

- synthetic maintainer fixtures for security boundaries, missing tests, and ordinary triage
- public issues or pull requests from repositories the maintainer owns or is authorized to review
- external feedback cases from Issue #6 after feedback is actually received

Do not add private repository data, secrets, or unauthorized third-party repository content.

## Suites

- `smoke`: low-cost default set for quick manual checks
- `expanded`: additional release, dependency, metadata, and security false-positive/false-negative cases
- `all`: complete case set for release-candidate checks

## Commands

List cases without an API key:

```bash
npm run eval:model:list
```

Run the default smoke suite:

```bash
npm run eval:model -- --budget-usd 0.5 --max-cases 5 --max-output-tokens 1200
```

Run an expanded release-candidate pass:

```bash
npm run eval:model -- --suite all --budget-usd 0.5 --max-cases 10 --max-output-tokens 1200 --summary-json
```

Run one targeted regression:

```bash
npm run eval:model -- --case "missing authorization check issue" --budget-usd 0.05 --max-output-tokens 1200
```

## Pass Criteria

- The OpenAI response must satisfy the strict assessment schema.
- Expected labels must be present after canonical label normalization.
- Forbidden labels must be absent.
- Expected recommended actions must match when specified.
- Forbidden recommended actions must be absent.
- Risk must stay within configured min/max bounds.
- The run must stay within the declared estimated budget.

## Cost Guardrails

Live model-backed evals are manual-only. They are not part of CI or `npm run verify`.

Every live run must specify:

- `--budget-usd`
- `--max-cases`
- `--max-output-tokens`

Results should be recorded under dated docs before using them as release evidence.

## Failure Triage

Treat failures as product signals:

- Missing expected security labels can indicate a false negative.
- Forbidden labels on feedback or metadata cases can indicate a false positive.
- Risk outside bounds can indicate poor prioritization.
- A schema failure is a release blocker for model-backed behavior.

If a model output is reasonable but uses different vocabulary, improve normalization or revise the fixture expectation. If the output is unsafe, improve the prompt, schema, or post-processing before expanding live usage.
