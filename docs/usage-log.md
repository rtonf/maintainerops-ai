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
| 2026-06-09 | Published npm package.                                                                            | `maintainerops-ai@0.1.0` on npm                                                                                     |
| 2026-06-10 | Triaged, commented on, and closed the public workflow example issues.                             | Issues #1, #2, #3, and #4 are closed with MaintainerOps AI triage comments                                          |
| 2026-06-10 | Verified public npm install and CLI execution from the registry.                                  | `docs/npm-install-evidence.md`, `npm exec --yes --package maintainerops-ai@latest -- maintainerops --help`          |
| 2026-06-10 | Generated review packets against real public repositories.                                        | `docs/review-packets/`                                                                                              |
| 2026-06-10 | Ran post-fix verification and dependency checks.                                                  | `npm run verify`, secret pattern check, `npm audit --audit-level=moderate`                                          |
| 2026-06-10 | Attempted to activate the GitHub Actions workflow.                                                | `gh auth refresh -h github.com -s workflow` timed out waiting for interactive OAuth approval                        |
| 2026-06-10 | Activated and manually verified the GitHub Actions workflow.                                      | `MaintainerOps AI` workflow run succeeded: `https://github.com/rtonf/maintainerops-ai/actions/runs/27284781369`     |
| 2026-06-10 | Expanded deterministic eval coverage from real maintainer packets.                                | `examples/evals/golden.json`, `EVALS.md`                                                                            |
| 2026-06-10 | Prepared application answers and an external feedback request.                                    | `docs/application-answers.md`, `docs/external-feedback-request.md`                                                  |
| 2026-06-10 | Verified the active workflow on a real pull request event.                                        | PR #5, `https://github.com/rtonf/maintainerops-ai/actions/runs/27285123074`                                         |
| 2026-06-10 | Opened an external feedback issue and verified the issue-triggered workflow.                      | Issue #6, `https://github.com/rtonf/maintainerops-ai/actions/runs/27285190047`                                      |

## Current metrics

- Public triage fixtures: 1
- Offline eval cases: 2
- Unit tests: 7
- UI smoke tests: 1
- Codex Security reportable findings fixed: 4
- Public GitHub issues triaged and closed with MaintainerOps AI comments: 4
- Real public repository review packets: 3
- GitHub releases: 2
- npm package status: `maintainerops-ai@0.1.1` published at `https://www.npmjs.com/package/maintainerops-ai`

## Seven-day evidence plan

These entries are intentionally tracked as planned or completed so the public record does not claim future work before it happens.

| Date       | Status    | Planned evidence                                                                 |
| ---------- | --------- | -------------------------------------------------------------------------------- |
| 2026-06-10 | Completed | Close issues #1-#4, npm install proof, real repo review packets, post-fix checks |
| 2026-06-11 | Planned   | Run one authorized PR or issue packet and record maintainer decision             |
| 2026-06-12 | Planned   | Add one eval case from real maintainer feedback                                  |
| 2026-06-13 | Planned   | Re-run security/dependency checks and document any drift                         |
| 2026-06-14 | Planned   | Use the packet output for a release-readiness or dependency-update review        |
| 2026-06-15 | Planned   | Record false-positive and false-negative notes from packet review                |
| 2026-06-16 | Planned   | Summarize weekly usage, time saved, and follow-up improvements                   |

## Next evidence to collect

- One week of issue triage examples from real authorized repositories.
- Maintainer time saved per review packet.
- False-positive and false-negative notes from eval review.
- First external user feedback or install/download evidence.
- First issue-triggered and pull-request-triggered workflow runs after new public work items are opened.
