# Maintenance Log: 2026-06-29

## Context

Today's maintenance focused on correcting public evidence after the GitHub Marketplace listing finished reflecting `v0.1.9`.

## Completed

- Confirmed npm latest is `maintainerops-ai@0.1.9`.
- Confirmed GitHub Release `v0.1.9` is published.
- Confirmed the public GitHub Marketplace listing displays `v0.1.9` as `Latest`.
- Updated README, Marketplace notes, external feedback instructions, and usage metrics so they no longer describe the older `v0.1.6` Marketplace state as current.
- Recorded the 2026-06-27 maintenance tooling work:
  - PR #30 added Dependabot, CodeQL, and the tooling roadmap.
  - PR #31 merged Dependabot's `actions/checkout@v7` update.
  - PR #32 pinned the public npm registry in `.npmrc` for Dependabot npm updates.
- Updated public GitHub Action examples to use `actions/checkout@v7`.
- Reviewed and merged Dependabot's production OpenAI SDK update from `openai@6.42.0` to `openai@6.45.0` in PR #34 after `npm run verify` passed.
- Replaced stale Dependabot PR #35 with PR #36 so the development dependency batch could be applied from current `main` without reverting the `openai@6.45.0` lockfile state.
- Updated development tooling:
  - `@playwright/test` to `^1.61.1`
  - `@types/node` to `^26.0.1`
  - `@vitejs/plugin-react` to `^6.0.3`
  - `eslint` to `^10.6.0`
  - `prettier` to `^3.9.1`
  - `typescript` to `^6.0.3`
  - `typescript-eslint` to `^8.62.0`
  - `vite` to `^8.1.0`
- Regenerated the bundled GitHub Action runtime with the updated toolchain.
- Re-ran the complete verification gate after installing the updated Playwright Chromium browser.
- Closed stale Dependabot PR #35 with a superseded note after PR #36 was merged.
- Added a scheduled/manual OpenSSF Scorecard workflow so supply-chain health can be published without blocking every pull request.
- Ran the initial Scorecard workflow manually and found that published Scorecard results reject global `id-token: write`; prepared a follow-up fix that scopes write permissions to the Scorecard job.
- Re-ran OpenSSF Scorecard successfully after the permission fix and published a concise report.
- Expanded `SECURITY.md` with supported versions, private disclosure steps, response targets, scope, and disclosure expectations.

## Verification

- Latest CodeQL push run succeeded: `https://github.com/rtonf/maintainerops-ai/actions/runs/28282051442`.
- Latest MaintainerOps AI PR checks succeeded on PR #32.
- PR #34 checks and local `npm run verify` succeeded before merge.
- PR #36 checks, local `npm run verify`, and post-merge CodeQL push run succeeded: `https://github.com/rtonf/maintainerops-ai/actions/runs/28352059753`.
- Initial Scorecard workflow run reached the Scorecard action and produced a score payload, but publishing failed because `id-token: write` was configured globally.
- Corrected Scorecard workflow succeeded: `https://github.com/rtonf/maintainerops-ai/actions/runs/28353155952`.
- Scorecard report: `docs/openssf-scorecard-2026-06-29.md`.
- `SECURITY.md` now documents private reporting and response targets instead of only a short generic reporting note.
- Open pull requests: none after closing stale PR #35.
- Open issues: Issue #6 remains open for external maintainer feedback.

## Next

- Add a fresh Issue #6 comment now that npm, GitHub Release, and Marketplace all show `v0.1.9`.
- Collect at least one external maintainer comment on Issue #6 or Discussion #17.
- Continue reviewing Dependabot updates promptly now that both GitHub Actions and npm ecosystem updates have merged cleanly.
- Use the Scorecard result to prioritize branch protection, clearer security policy details, and npm Trusted Publishing/provenance.
- Re-run Scorecard after the security policy update and branch protection change land.
- Plan the next Codex Security repo-wide scan before a `v0.1.10` release candidate.
