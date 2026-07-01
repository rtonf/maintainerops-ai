# Tooling Roadmap

This document tracks useful skills, APIs, and support tooling for MaintainerOps AI. It intentionally separates tools to adopt now from tools that are useful but should wait until the project has more external feedback.

## Added for Codex Operations

- Local Codex skill: `maintainerops-maintenance`
- Location: `C:\Users\mario\.codex\skills\maintainerops-maintenance`
- Purpose: standardize release checks, Marketplace checks, Issue #6 feedback handling, usage-log updates, Codex Security cadence, and npm publication guardrails.

## Added to the Repository

- Dependabot version updates: `.github/dependabot.yml`
- CodeQL code scanning workflow: `.github/workflows/codeql.yml`
- Public npm registry pin: `.npmrc`
- OpenSSF Scorecard scheduled/manual workflow: `.github/workflows/scorecard.yml`
- npm Trusted Publishing evidence: `docs/npm-trusted-publishing.md`

These are intentionally low-risk additions. Dependabot opens reviewable PRs, CodeQL reports code-scanning findings without changing runtime behavior, `.npmrc` keeps npm/Dependabot pointed at the public npm registry without storing credentials, and Scorecard runs on a weekly/manual cadence instead of blocking every pull request.

## Workflow Pinning

GitHub Actions in repository workflows are pinned to full commit SHAs with a short version comment for readability. This reduces supply-chain risk from mutable tags and directly addresses the OpenSSF Scorecard pinned-dependencies check. When Dependabot or manual review proposes an Action update, update both the SHA and the adjacent version comment. For annotated tags, pin the dereferenced commit SHA, not the tag-object SHA. For Scorecard publish verification, avoid pinned subactions that the verifier treats as separate repositories.

## Highest-Value Next Additions

| Priority | Tooling                       | Why it helps                                                                  | Recommended timing                                       |
| -------- | ----------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------- |
| 1        | External maintainer feedback  | Converts the strongest remaining adoption gap into concrete product evidence. | Immediate; use Issue #6 and GitHub Discussion #17.       |
| 2        | Expanded model-backed evals   | Tests real OpenAI output quality, not only deterministic offline heuristics.  | In progress via Issue #60; keep manual and budget-gated. |
| 3        | Semgrep scheduled scan        | Adds another static-analysis perspective.                                     | Manual/scheduled only at first to avoid noisy PR gates.  |
| 4        | GitHub App auth               | Better for organizations and private repositories.                            | After the public CLI/Action workflow proves demand.      |
| 5        | Marketplace release freshness | Keeps the Action install path aligned with npm and GitHub Releases.           | Refresh after each Action release.                       |

## Do Not Add Yet

- Auto-merge, auto-close, auto-label, or auto-release behavior.
- Required third-party scanners that block every PR before their noise level is measured.
- Global developer tools that are not exercised by `npm run verify` or a documented workflow.
- Secrets-dependent workflows on `pull_request_target`.

## Current Decision

The immediate improvement is adoption focused: keep npm, GitHub Releases, and Marketplace aligned; collect real external maintainer feedback; and convert that feedback into eval cases, review packets, and narrowly scoped roadmap issues. npm Trusted Publishing is now active and should remain the default release path.
