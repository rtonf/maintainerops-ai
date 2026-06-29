# Branch Protection Evidence: 2026-06-29

## Repository

- Repository: `rtonf/maintainerops-ai`
- Branch: `main`
- Verification command: `gh api repos/rtonf/maintainerops-ai/branches/main/protection`

## Active Protection

The `main` branch is protected with:

- required status checks enabled
- strict branch update checks enabled
- required contexts:
  - `Analyze JavaScript and TypeScript`
  - `analyze`
- force pushes disabled
- branch deletion disabled
- admin enforcement disabled
- pull request review requirement not enabled, to avoid blocking the single-maintainer early project workflow

## Rationale

This keeps the project compatible with the current solo maintainer workflow while preventing unverified changes from becoming the normal path. It also creates public supply-chain evidence alongside Dependabot, CodeQL, and OpenSSF Scorecard.

## Notes

OpenSSF Scorecard was re-run after branch protection was enabled. The run succeeded and the overall score increased to `6.1`, but the Branch-Protection check reported an internal read error for classic branch protection rules with the workflow token. The GitHub API check above is the canonical verification for the current branch protection state.
