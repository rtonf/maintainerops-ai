# Maintenance Log: 2026-06-24

## Context

Today's maintenance prepared `v0.1.8` to publish the security and reliability fixes validated by the 2026-06-23 full repository rescan.

## Completed

- Updated package and lockfile versions from `0.1.7` to `0.1.8`.
- Added `v0.1.8` release candidate notes and linked them from README.
- Kept published npm, GitHub Release, and Marketplace claims on `v0.1.7` pending verified publication.
- Ran the complete local verification gate successfully.

## Verification

- TypeScript check and ESLint: passed
- Prettier: passed
- Unit tests: 26 passed
- Playwright UI smoke tests: 1 passed
- Deterministic evals: 7 passed
- Package dry run and publint: passed
- npm audit: 0 vulnerabilities

## Remaining Publication Steps

1. Merge the `v0.1.9` package repair.
2. Publish npm `maintainerops-ai@0.1.9` with maintainer OTP.
3. Verify the public CLI and update npm installation evidence.
4. Create GitHub Release `v0.1.9` and publish it to GitHub Marketplace.
5. Update the active workflow to the published `v0.1.9` commit SHA.

## npm 0.1.8 Publication Incident

Post-publication installation testing found that npm `0.1.8` contained Action assets and documentation but omitted `dist/cli.js`. The local verification build had generated `dist/`, but cleanup removed that ignored directory before the later manual `npm publish` command.

Response:

- Kept the GitHub Release as a draft and then removed it without publishing.
- Did not publish `v0.1.8` to GitHub Marketplace.
- Prepared `0.1.9` with a `prepack` script that rebuilds CLI and Action runtime files during `npm pack` and `npm publish`.
- Requested OTP-authorized deprecation or dist-tag repair for npm `0.1.8`.
- Verified the `0.1.9` repair with a 38-file tarball, clean temporary installation, and successful installed `maintainerops.cmd --help` execution.
