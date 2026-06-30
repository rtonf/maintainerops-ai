# Model-Backed Eval Plan

This document defines the first model-backed eval milestone for MaintainerOps AI.

## Current Status

- Deterministic offline evals are active and run with `npm run eval`.
- Model-backed evals are not yet executed in CI.
- Local environment check on 2026-06-30 found `OPENAI_API_KEY` and `OPENAI_MODEL` unset, so live model evals were not run.
- A first 2-case manual model-backed eval was run on 2026-07-01 with `gpt-4o-mini`; both cases passed schema validation, but strict label expectations failed because model labels were not normalized to the project's canonical label vocabulary.

## Why This Matters

Offline evals protect deterministic maintainer heuristics. Model-backed evals are still needed because the OpenAI output path is the main value proposition when API credits are available.

The goal is not to let a model make final decisions. The goal is to measure whether generated review packets are useful, grounded, and safe enough for a human maintainer to review.

## First Milestone

Add a small manually triggered eval set with 2-3 cases:

1. Security-sensitive PR with no tests.
2. External feedback issue that should stay low risk.
3. Release readiness issue that needs release notes but not security escalation.

## Expected Checks

Each model-backed output should be checked for:

- valid schema accepted by `assertAssessment`
- no forbidden labels for outreach/feedback issues
- evidence-backed risk rationale
- no automatic merge, close, publish, scan, or label claims
- no raw secret or untrusted content leakage
- editable, non-accusatory maintainer-facing language

## Execution Guardrails

- Run manually only at first.
- Require `OPENAI_API_KEY`.
- Use only fixtures or repositories owned/maintained/authorized by the operator.
- Do not run on pull requests from untrusted forks with secrets exposed.
- Record results in docs before enabling any CI gate.

## Proposed Command Shape

The first implementation can be a separate script so it does not affect the existing deterministic `npm run eval` gate:

```bash
npm run eval:model
```

If `OPENAI_API_KEY` is missing, the script should fail clearly without falling back silently to offline heuristics.

## Current Next Step

Implement label normalization and then re-run the 2-case manual model-backed eval before expanding the case set or enabling any CI gate.
