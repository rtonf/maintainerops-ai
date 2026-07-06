# Maintenance Log: 2026-07-07

Today's maintenance focused on closing the `v0.1.13` Marketplace loop and processing fresh Dependabot updates.

## Completed

- Confirmed npm latest is `maintainerops-ai@0.1.13`.
- Confirmed GitHub Release latest is `v0.1.13`.
- Confirmed the public GitHub Marketplace listing displays `v0.1.13` as `Latest`.
- Closed Issue #80 after the Marketplace page reflected `v0.1.13`.
- Merged Dependabot PR #83, updating the repository's GitHub Action usage from `rtonf/maintainerops-ai@v0.1.9` to `v0.1.13`.
- Merged Dependabot PR #82, updating the npm development lockfile group.
- Ran `npm ci` to verify the lockfile-resolved dependency set.
- Re-ran `npm run verify` after `npm ci`.
- Regenerated `dist-action/index.js` with the lockfile-resolved `@vercel/ncc@0.44.1`.
- Added an API-free security diff review for the Dependabot maintenance batch.
- Prepared the `v0.1.14` consistency release to fix npm package repository metadata and the stale Marketplace README Action example.
- Added an API-free security diff review for the `v0.1.14` consistency release.
- Opened Issue #85 to track the `v0.1.14` publication and post-release evidence update.
- Merged PR #86 and published GitHub Release `v0.1.14`.
- Verified npm Trusted Publishing succeeded for `maintainerops-ai@0.1.14`.
- Verified `npm exec --yes --package maintainerops-ai@latest -- maintainerops demo --format markdown` prints the no-key review packet from the public registry package.
- Confirmed the public GitHub Marketplace listing displays `v0.1.14` as `Latest`.
- Opened Issue #87 to evaluate external SBOM/OSV dependency scanning feedback separately from the `v0.1.14` metadata release.
- Refreshed Issue #6 with the current `v0.1.14` npm, GitHub Release, Marketplace, and no-key demo test path.

## Verification

- `npm ci`
- `npm run verify`
- GitHub Marketplace public listing: `https://github.com/marketplace/actions/maintainerops-ai`
- PR #82 checks passed before merge.
- PR #83 checks passed before merge.
- Security diff review: `docs/codex-security/dependabot-maintenance-diff-review-2026-07-07.md`
- Security diff review: `docs/codex-security/v0.1.14-consistency-diff-review-2026-07-07.md`
- GitHub Release `v0.1.14`: `https://github.com/rtonf/maintainerops-ai/releases/tag/v0.1.14`
- npm Trusted Publishing run: `https://github.com/rtonf/maintainerops-ai/actions/runs/28830553903`
- GitHub Marketplace public listing: `https://github.com/marketplace/actions/maintainerops-ai`

`npm run verify` passed with:

- TypeScript check
- ESLint
- Prettier check
- 49 source tests
- 1 Playwright UI smoke test
- 7 offline eval cases
- package dry run
- publint
- `npm audit --audit-level=moderate` with 0 vulnerabilities

## Notes

- The `publint` repository URL suggestion is addressed in the prepared `v0.1.14` consistency release.
- The remaining open public issues are Issue #6 for external maintainer feedback and Issue #87 for SBOM/OSV scanner evaluation.

## Next

- Keep Issue #6 current and continue seeking external maintainer feedback.
- Keep the v0.1.14 evidence docs aligned after the Marketplace cache refresh.
- Evaluate Issue #87 without adding a new dependency scanner until the maintenance value and supply-chain risk are clear.
- Run a Codex Security diff scan before the next code-bearing release.
