# Action Bundling Plan

## Decision

MaintainerOps AI should ship a prebuilt GitHub Action runtime instead of installing dependencies and compiling TypeScript in every consuming workflow.

## Rationale

The previous composite Action ran these steps inside each user's CI job:

```yaml
npm ci
npm run build:cli
```

That made the Action slower and added avoidable failure points for Marketplace users. The Action now runs the prebuilt `dist-action/index.js` bundle generated from `src/action.ts`.

## Implementation

- Bundle tool: `@vercel/ncc`
- Build command: `npm run build:action`
- Output: `dist-action/index.js`
- Action entrypoint: `node dist-action/index.js`
- Runtime marker: `dist-action/package.json` with `type: module`
- Build hygiene: `scripts/clean-action-dist.mjs` removes stale bundle output before each build, and `scripts/write-action-package-json.mjs` prunes generated declarations that are not needed by the Action runtime.

## Verification

Run before publishing a GitHub Action release:

```bash
npm run verify
npm run build:action
git diff --exit-code -- dist-action
```

Regenerate and commit `dist-action` whenever Action runtime source changes, then publish the same verified source through npm, GitHub Releases, and GitHub Marketplace.
