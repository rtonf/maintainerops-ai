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

These are intentionally low-risk additions. Dependabot opens reviewable PRs, CodeQL reports code-scanning findings without changing runtime behavior, and `.npmrc` keeps npm/Dependabot pointed at the public npm registry without storing credentials.

## Highest-Value Next Additions

| Priority | Tooling                             | Why it helps                                                                 | Recommended timing                                        |
| -------- | ----------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------- |
| 1        | OpenSSF Scorecard                   | Gives public supply-chain health evidence that OSS reviewers understand.     | After CodeQL is stable.                                   |
| 2        | npm Trusted Publishing / provenance | Reduces OTP mistakes and strengthens package provenance.                     | Before the next npm release if account settings allow it. |
| 3        | model-backed eval                   | Tests real OpenAI output quality, not only deterministic offline heuristics. | After external feedback creates realistic cases.          |
| 4        | Semgrep scheduled scan              | Adds another static-analysis perspective.                                    | Manual/scheduled only at first to avoid noisy PR gates.   |
| 5        | GitHub App auth                     | Better for organizations and private repositories.                           | After the public CLI/Action workflow proves demand.       |

## Do Not Add Yet

- Auto-merge, auto-close, auto-label, or auto-release behavior.
- Required third-party scanners that block every PR before their noise level is measured.
- Global developer tools that are not exercised by `npm run verify` or a documented workflow.
- Secrets-dependent workflows on `pull_request_target`.

## Current Decision

The immediate improvement is operational and supply-chain focused: install a local Codex skill for this project, add Dependabot grouping, add CodeQL, and document the remaining tooling roadmap. The next implementation candidate should be OpenSSF Scorecard after the CodeQL workflow proves stable.
