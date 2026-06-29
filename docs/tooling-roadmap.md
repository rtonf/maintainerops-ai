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

These are intentionally low-risk additions. Dependabot opens reviewable PRs, CodeQL reports code-scanning findings without changing runtime behavior, `.npmrc` keeps npm/Dependabot pointed at the public npm registry without storing credentials, and Scorecard runs on a weekly/manual cadence instead of blocking every pull request.

## Workflow Pinning

GitHub Actions in repository workflows are pinned to full commit SHAs with a short version comment for readability. This reduces supply-chain risk from mutable tags and directly addresses the OpenSSF Scorecard pinned-dependencies check. When Dependabot or manual review proposes an Action update, update both the SHA and the adjacent version comment. For annotated tags, pin the dereferenced commit SHA, not the tag-object SHA.

## Highest-Value Next Additions

| Priority | Tooling                             | Why it helps                                                                 | Recommended timing                                        |
| -------- | ----------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------- |
| 1        | npm Trusted Publishing / provenance | Reduces OTP mistakes and strengthens package provenance.                     | Before the next npm release if account settings allow it. |
| 2        | model-backed eval                   | Tests real OpenAI output quality, not only deterministic offline heuristics. | After external feedback creates realistic cases.          |
| 3        | Semgrep scheduled scan              | Adds another static-analysis perspective.                                    | Manual/scheduled only at first to avoid noisy PR gates.   |
| 4        | GitHub App auth                     | Better for organizations and private repositories.                           | After the public CLI/Action workflow proves demand.       |

## Do Not Add Yet

- Auto-merge, auto-close, auto-label, or auto-release behavior.
- Required third-party scanners that block every PR before their noise level is measured.
- Global developer tools that are not exercised by `npm run verify` or a documented workflow.
- Secrets-dependent workflows on `pull_request_target`.

## Current Decision

The immediate improvement is operational and supply-chain focused: install a local Codex skill for this project, add Dependabot grouping, add CodeQL, add scheduled/manual OpenSSF Scorecard, pin workflow Actions to commit SHAs, and document the remaining tooling roadmap. The next implementation candidate should be npm Trusted Publishing/provenance before the next npm release if account settings allow it.
