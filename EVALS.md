# Evals

MaintainerOps AI treats evals as part of the product, not as an afterthought.

Current evals run deterministic offline cases:

```bash
npm run eval
```

The current golden set checks that:

- Security-sensitive pull requests receive `security-review`.
- Pull requests without test files receive `tests-needed`.
- Ordinary documentation issues remain low risk.
- Dependency update pull requests that touch release/security-sensitive infrastructure receive maintainer review, release-note, and test-gap labels.
- Runtime framework dependency updates receive security review, release-note, and test-gap labels.
- Prompt-injection and secret-handling issues are routed to security review.
- Release-readiness issues receive release-note handling without inflating risk.
- External feedback issues that mention security evidence remain low risk unless they describe an actionable vulnerability.

## Current golden cases

| Case                                           | Source evidence                   | Expected outcome                                       | Error watched                          |
| ---------------------------------------------- | --------------------------------- | ------------------------------------------------------ | -------------------------------------- |
| Security-sensitive pull request without tests  | Synthetic auth-boundary fixture   | `security-review`, `tests-needed`                      | False negative on auth risk            |
| Ordinary documentation issue                   | Synthetic docs issue              | `needs-triage`, max risk `low`                         | False positive risk inflation          |
| Gradle wrapper dependency update without tests | `rtonf/daily-hub-diary-app` PR #1 | `maintainer-review`, `security-review`, `tests-needed` | Missing supply-chain review            |
| Capacitor runtime dependency update            | `rtonf/daily-hub-diary-app` PR #2 | `maintainer-review`, `security-review`, `tests-needed` | Missing runtime dependency risk        |
| Prompt-injection-safe issue triage             | `rtonf/maintainerops-ai` issue #3 | `needs-triage`, `security-review`                      | Missing untrusted-input handling       |
| Release readiness issue                        | `rtonf/maintainerops-ai` issue #2 | `needs-triage`, `release-notes`, max risk `low`        | Treating release work as vuln          |
| External feedback issue                        | `rtonf/maintainerops-ai` issue #6 | `needs-triage`, max risk `low`                         | Security-topic outreach false positive |

## Current eval result

The latest local run is expected to pass 7 deterministic offline cases:

```bash
npm run eval
```

Planned model-backed evals:

- Compare model output against maintainer-labeled historical issues.
- Track false positives for security-sensitive PRs.
- Track false negatives where missing tests, release notes, or authorization risks were missed.
- Require every high-risk finding to include evidence.
- Require every suggested GitHub comment to be editable and non-accusatory.
