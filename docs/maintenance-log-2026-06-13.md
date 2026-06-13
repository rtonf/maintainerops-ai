# Maintenance Log: 2026-06-13

## Context

The Codex for Open Source application has been submitted. The maintenance goal for today is to keep public evidence current while continuing to collect external feedback.

## Checks

- Local verification: `npm run verify`
- npm registry: `maintainerops-ai@0.1.4` is the `latest` dist-tag.
- GitHub Release: `v0.1.4` is public.
- GitHub Marketplace: `MaintainerOps AI` is public and still displays `v0.1.4`; `v0.1.5` still needs Marketplace publish from the GitHub Release UI.
- GitHub Actions: manual `workflow_dispatch` runs succeeded at `https://github.com/rtonf/maintainerops-ai/actions/runs/27427501684` and `https://github.com/rtonf/maintainerops-ai/actions/runs/27462826049`.
- Repository state: `main` is synchronized with `origin/main` before maintenance edits.

## Findings

- The Marketplace page was public, but it still rendered the `v0.1.4` tag README from before npm `0.1.4` publication evidence was committed.
- To avoid rewriting the existing public `v0.1.4` tag, the safer maintenance action is to publish a new GitHub Action release that points at the current README.

## Actions

- Added a 2026-06-13 maintenance log.
- Updated README and Marketplace usage examples to point at the next GitHub Action release tag.
- Prepared `v0.1.5` as a Marketplace README refresh release.
- Posted a fresh feedback request to Issue #6.
- Implemented a bundled GitHub Action runtime with `@vercel/ncc` so Marketplace users no longer run `npm ci` and `npm run build:cli` in their CI jobs.
- Added `src/defaults.ts` and moved the OpenAI model default into one code-owned location.
- Updated README model guidance to avoid presenting a changing model id as a hard-coded setup requirement.
- Added direct `offlineAnalyzer` unit tests for security-sensitive PRs, ordinary documentation issues, and large PRs without tests.
- Verified the bundled Action in fixture mode with `node dist-action/index.js`.
- Re-ran `npm run verify` successfully after the bundle, model default, and unit-test changes.
- Pushed the bundled Action runtime to `main` and verified a fresh `workflow_dispatch` run succeeded on GitHub Actions.

## Remaining Work

- Collect at least one external tester comment on Issue #6.
- Publish `v0.1.5` to Marketplace from the GitHub Release UI if the Marketplace page still displays `v0.1.4`.
- Re-check the Marketplace page after `v0.1.5` is published to Marketplace.
- Prepare a follow-up GitHub Action release after the bundled runtime lands on `main`.
- Continue 2026-06-14 through 2026-06-16 maintenance log entries.
