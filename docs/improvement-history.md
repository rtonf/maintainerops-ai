# Improvement History

## 2026-06-09

- Created MaintainerOps AI as a human-in-the-loop OSS maintainer assistant.
- Added OpenAI Responses API structured output for review packets.
- Added offline heuristic fallback for cost control and deterministic CI.
- Added explicit live GitHub authorization gating.
- Added a Security Review Workbench UI prototype.
- Ran Codex Security repository scan and published the report.
- Fixed four reportable security findings:
  - PR workflows no longer pass `OPENAI_API_KEY` to PR-controlled code.
  - Structured and cloud credential forms are redacted before model submission.
  - JSON reports redact raw work item content.
  - Model-controlled Markdown is neutralized before GitHub Actions stdout.
- Added `npm run verify` with type checking, lint, formatting, unit tests, UI smoke tests, evals, and audit.
- Created public triage example issues for dependency advisory ingestion, release readiness, and prompt-injection-safe comment drafting.
- Published GitHub Release `v0.1.0`.
- Prepared npm package metadata; npm publish remains pending account authentication.
