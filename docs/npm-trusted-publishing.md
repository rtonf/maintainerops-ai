# npm Trusted Publishing Plan

This document tracks the plan to move MaintainerOps AI from manual OTP-based npm publishing to npm Trusted Publishing with provenance.

## Why This Matters

Manual npm publishing has already created operational risk in this project:

- OTP placeholders were accidentally passed to npm commands during earlier release attempts.
- Version `0.1.8` was published with a packaging defect and had to be deprecated.
- Manual publication makes release evidence harder to reproduce.

Trusted Publishing uses OIDC from a configured CI/CD workflow instead of a long-lived npm token. This should reduce release mistakes and strengthen supply-chain evidence.

## Official Requirements

Based on npm documentation:

- npm Trusted Publishing supports GitHub Actions on GitHub-hosted runners.
- npm CLI must be `11.5.1` or later.
- Node.js must be `22.14.0` or later.
- The npm package settings must register a trusted publisher for:
  - owner: `rtonf`
  - repository: `maintainerops-ai`
  - workflow filename: the final publish workflow filename, for example `npm-publish.yml`
  - allowed action: `npm publish`
- The GitHub Actions workflow needs `id-token: write` and `contents: read`.
- npm automatically generates provenance for Trusted Publishing unless explicitly disabled.

Sources:

- <https://docs.npmjs.com/trusted-publishers/>
- <https://docs.npmjs.com/generating-provenance-statements/>

## Proposed Workflow Shape

The package owner reported that the npm package Trusted Publisher setting has been saved for `rtonf/maintainerops-ai` with workflow filename `npm-publish.yml`. The repository can now add the active workflow without storing an `NPM_TOKEN`.

When ready, the workflow should:

1. Trigger only from a GitHub Release publication or a manually approved workflow dispatch.
2. Use GitHub-hosted `ubuntu-latest`.
3. Use Node `24` or the current project-supported release satisfying npm's minimum.
4. Run `npm ci`.
5. Run `npm run verify`.
6. Run `npm publish`.

The workflow should not use an npm token. The trust relationship should come from npm Trusted Publishing.

## Maintainer Setup Checklist

These steps require the npm package owner account:

1. Open <https://www.npmjs.com/package/maintainerops-ai/access>.
2. Find the Trusted Publisher section.
3. Choose GitHub Actions.
4. Set organization/user to `rtonf`.
5. Set repository to `maintainerops-ai`.
6. Set workflow filename to the chosen publish workflow filename.
7. Allow `npm publish`.
8. Save the trusted publisher.
9. Only after this is saved, add the active GitHub publish workflow.

## Guardrails

- Keep manual `npm publish` available only as a fallback until the first Trusted Publishing release succeeds.
- Never store `NPM_TOKEN` in GitHub Secrets for this package unless Trusted Publishing is unavailable.
- Do not trigger publishing from pull requests.
- Keep release notes and `docs/npm-install-evidence.md` updates as separate reviewed changes.
- After the first trusted publish, verify with:

```bash
npm view maintainerops-ai version dist-tags time --json
npm exec --yes --package maintainerops-ai@latest -- maintainerops --help
```

## Current Status

- Status: repository workflow prepared for review.
- npm package-owner setup: reported complete by the maintainer on 2026-07-01.
- Active workflow candidate: `.github/workflows/npm-publish.yml`.
- First release-triggered run: failed before checkout because the `actions/setup-node` pin pointed at a non-existent v7 SHA.
- Current fix: workflow updated to the verified `actions/setup-node` v6 tag SHA.
- Second manual run: reached `npm run verify` but failed because the GitHub runner did not have Playwright Chromium installed.
- Current fix: workflow installs Playwright Chromium before the verification gate.
- Third manual run: reached provenance signing but npm rejected the package because `package.json` was missing `repository.url`.
- Current fix: prepare `v0.1.11` with `repository.url` set to `https://github.com/rtonf/maintainerops-ai`.
- Next step: publish `v0.1.11`, confirm the trusted npm publish job succeeds, then refresh npm install evidence.
