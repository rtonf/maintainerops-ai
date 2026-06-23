# Fix Report

## Scope

Fixes were applied after validating the repository-wide scan at commit `a050554737e2`.

## Changes

### 03-ai-output-001: secret redaction order

- Changed `buildAssessmentPrompt` to redact the complete serialized payload before truncation.
- Added `src/prompt.test.ts` with the exact key/value boundary condition.
- Original result: `containsFullSecret=true`, no redaction marker.
- Post-fix result: `containsFullSecret=false`, `containsRedactionMarker=true`.

### 04-offline-eval-002: patch aggregation exhaustion

- Removed the duplicate aggregate `diff` from GitHub PR work items when per-file patches are available.
- Added a 1,000,000-character search budget before joining/lowercasing.
- Prioritized title/body/comments before bounded patch text.
- Original 64 MiB PoC: exit `134`, V8 heap-limit fatal error.
- Post-fix 64 MiB PoC: exit `0`.

### 04-offline-eval-001: security routing correctness

- Replaced broad feedback substrings with explicit feedback-request intent patterns.
- Added missing/absent permission/auth control patterns to actionable security detection.
- Original differential result: feedback wording changed `high/security-review` to `low/needs-triage`.
- Post-fix result: both variants remain `high/security-review/needs_security_review`.

### 01-entry-action-C001: workflow defense in depth

- Replaced PR checkout, dependency installation, and build execution with a commit-pinned released Action.
- Changed the PR event to `pull_request_target`, so the trusted base workflow executes without checking out PR code.
- Retained explicit read-only repository permissions.

## Verification

- `npm run verify`: passed.
- Unit tests: 26 passed.
- UI smoke tests: 1 passed.
- Deterministic evals: 7 passed.
- Package dry run and publint: passed.
- npm audit: 0 vulnerabilities.
- Original PoCs rerun after the fix: secret and resource-exhaustion paths no longer reproduce; routing remains security-sensitive.

## Remaining Risk

- Model recommendations remain advisory and may be influenced by contributor text; strict schema and mandatory human review remain the controlling mitigations.
- GitHub may apply its own patch-size truncation, but the local analyzer now enforces an independent aggregate budget.
