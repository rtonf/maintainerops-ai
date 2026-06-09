# Usage Log

This log records early maintainer workflow evidence for the Codex for Open Source application.

| Date       | Activity                                                                                          | Evidence                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 2026-06-09 | Built initial MaintainerOps AI CLI, GitHub Action wrapper, eval harness, and dashboard prototype. | `npm run demo`, `npm run eval`, README, demo fixture                                                                |
| 2026-06-09 | Ran a repository-wide Codex Security scan and produced public scan artifacts.                     | `docs/codex-security/report.md`                                                                                     |
| 2026-06-09 | Fixed reportable security findings from the scan.                                                 | `docs/codex-security/fix-report.md`, `src/redaction.ts`, `src/format.ts`, `docs/github-workflows/maintainerops.yml` |
| 2026-06-09 | Added maintainer verification tooling.                                                            | `npm run verify`, ESLint, Prettier, Playwright UI smoke test                                                        |
| 2026-06-09 | Published public GitHub repository and prepared application evidence.                             | `https://github.com/rtonf/maintainerops-ai`                                                                         |
| 2026-06-09 | Created public triage example issues.                                                             | Issues #1, #2, and #3                                                                                               |
| 2026-06-09 | Published initial GitHub Release.                                                                 | `v0.1.0`                                                                                                            |

## Current metrics

- Public triage fixtures: 1
- Offline eval cases: 2
- Unit tests: 7
- UI smoke tests: 1
- Codex Security reportable findings fixed: 4
- Public GitHub issues created for workflow examples: 3
- GitHub releases: 1
- npm package status: name available, publish pending npm authentication

## Next evidence to collect

- One week of issue triage examples from real authorized repositories.
- Maintainer time saved per review packet.
- False-positive and false-negative notes from eval review.
- First external user feedback or install/download evidence.
