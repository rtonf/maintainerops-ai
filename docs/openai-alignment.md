# OpenAI Program Alignment

MaintainerOps AI is designed for maintainers of public open-source software who need safer, faster review workflows.

## Program-fit summary

The project focuses on eligible OSS maintainer workflows:

- Pull request review packets
- Issue triage
- Maintainer automation
- Release readiness
- Security and code-quality review for authorized repositories

The tool is not a general-purpose scanner. It is a maintainer cockpit for repositories the user owns, maintains, or has permission to administer.

## Safety controls

- Human-in-the-loop by default.
- Dry-run by default.
- No automatic merge, issue close, release publish, or security disclosure.
- Live GitHub analysis requires `--authorized` or `MAINTAINEROPS_AUTHORIZED=true`.
- Pull request CI uses offline/no-secret analysis by default.
- Common and structured secrets are redacted before model calls and before report serialization.
- GitHub Actions workflow-command syntax is neutralized before untrusted Markdown reaches stdout.
- Every model recommendation is structured, auditable, and tied to evidence.
- The UI presents AI findings as recommendations, not final decisions.
- The GitHub Action requests read permissions only.

## OpenAI API use

MaintainerOps AI uses the OpenAI API for structured review and triage output:

- `gpt-5.4-mini` for routine issue and PR triage.
- `gpt-5.5` for security-sensitive pull requests and release risk assessment.
- JSON Schema structured output for predictable downstream behavior.
- Offline heuristics for local demos, CI smoke tests, and cost control.

## Codex Security use

Codex Security should only be used for repositories the maintainer owns, maintains, or is explicitly authorized to review.

Recommended flow:

1. Confirm repository authorization.
2. Run Codex Security against the authorized repository.
3. Import the final security report into MaintainerOps AI.
4. Convert reportable findings into maintainer review packets.
5. Keep human approval as the final gate.

## Selection evidence to gather

Before applying, collect measurable usage evidence:

- Number of triaged issues per week.
- Number of PR review packets generated.
- Maintainer time saved per release.
- False-positive and false-negative examples from evals.
- Security-sensitive PRs where the tool caught test or review gaps.
- Public repository links proving active maintenance.

Selection is always OpenAI's decision. This project is structured to make the maintainer workflow, authorization model, and safety controls easy to verify.
