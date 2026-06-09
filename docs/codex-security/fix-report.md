# Fix Report: MaintainerOps AI Codex Security Findings

## Fixed findings

- MOAI-003: Pull request workflow executed PR-controlled built code with `OPENAI_API_KEY`.
- MOAI-001: Structured secrets bypassed redaction before OpenAI model submission.
- MOAI-004: Model-controlled Markdown could emit GitHub Actions workflow commands.
- MOAI-002: JSON report output disclosed raw analyzed content to stdout and CI logs.

## Changes made

- `.github/workflows/maintainerops.yml`: PR analysis now runs `--offline --authorized` and no longer receives `OPENAI_API_KEY`; issue analysis explicitly passes `--authorized` and remains allowed to use OpenAI because it runs trusted default-branch workflow code.
- `src/redaction.ts`: added AWS access key patterns and structured JSON/colon key-value redaction, including escaped JSON-string forms produced by `JSON.stringify`.
- `src/format.ts`: JSON output now emits a redacted work item and sanitized assessment; Markdown output neutralizes line-start `::` commands and redacts secrets in model-controlled strings before stdout.
- `src/redaction.test.ts`: added structured key-value/cloud credential regression coverage.
- `src/format.test.ts`: added JSON raw-item redaction and GitHub Actions workflow-command neutralization tests.

## Validation

Commands passed:

- `npm run test:src`
- `npm run eval`
- `npm run demo`
- `npm audit --audit-level=moderate`

Focused reproduction after the fix:

- Synthetic JSON/colon API keys, AWS-style access key IDs, `token=plain-secret-value`, and bearer-token values did not appear in JSON or Markdown formatter output.
- Synthetic model output beginning with `::warning` and `::add-mask` was emitted as escaped `\::warning` and `\::add-mask`; no Markdown output line started with `::`.
- Static workflow check shows the pull-request analyze step has no `OPENAI_API_KEY` env and runs with `--offline --authorized`.

## Browser verification

- In-app Browser opened `http://127.0.0.1:5173/`.
- Page title: `MaintainerOps AI`.
- Main UI rendered with security/review content.
- Browser console errors: none.

## Remaining uncertainty

- Chrome extension backend was unavailable in this environment, so Chrome-specific visual verification was not completed. The in-app Browser verification covered the local UI.
- A full post-fix Codex Security repository rescan was not rerun; this report validates the four original findings with focused tests and source-to-sink checks.
