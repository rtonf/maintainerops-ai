# Roadmap

## Shipped

- npm CLI and prebuilt GitHub Marketplace Action
- Fixture, GitHub issue, and pull request analysis
- OpenAI structured output with deterministic offline fallback
- Markdown and JSON review packets
- Seven-case deterministic eval suite and ten-case manual model-backed suite
- No-key demo command
- Required CI, CodeQL, Dependabot, OpenSSF Scorecard, CODEOWNERS, and branch protection
- npm Trusted Publishing with provenance
- Community health files and public security review evidence

## Now

- Collect 5-10 external maintainer reports on Issue #6.
- Deliver review packets through the GitHub Actions Step Summary and a redacted Action output.
- Keep offline and model-backed evals fail-closed for empty case sets, malformed inputs, and unaffordable live calls.
- Triage stale OpenSSF Scorecard code-scanning alerts and keep SARIF results current.
- Use real maintainer feedback to add false-positive and false-negative regression cases.

## Next

- Ingest bounded issue comments, pull request reviews, and check summaries without adding write permissions.
- Adopt safer human-review action names in a versioned JSON contract.
- Add project-specific policy files such as `.maintainerops.yml`.
- Add deterministic OpenAI and GitHub integration tests plus coverage reporting.
- Evaluate GitHub App authentication after external demand is demonstrated.

## Later

- Connect the dashboard prototype to real packet data after multi-repository demand is validated.
- Add review comment posting only with explicit maintainer confirmation.
- Generate release notes from milestones and merged pull requests.
- Add multi-repository queues, organization policy templates, and evaluation dashboards.
- Add Codex Security handoff reports for authorized repositories.
