# MaintainerOps AI Operator Runbook

This runbook records the checks needed before publishing evidence for the Codex for Open Source application.

## Release Checklist

1. Run local verification:

   ```bash
   npm run verify
   ```

2. Confirm the bundled Action runtime is up to date:

   ```bash
   npm run build:action
   git diff --exit-code -- dist-action
   ```

3. Confirm npm authentication before publishing:

   ```bash
   npm whoami
   ```

4. Publish the package from the repository root:

   ```bash
   npm publish --access public
   ```

5. Verify npm latest and CLI execution:

   ```bash
   npm view maintainerops-ai version dist-tags time --json
   npm install -g maintainerops-ai@latest
   maintainerops --help
   ```

6. Verify the GitHub Release:

   ```bash
   gh release view v0.1.9 --repo rtonf/maintainerops-ai --json url,tagName,name,publishedAt,isDraft,isPrerelease,targetCommitish
   ```

7. Verify the GitHub Marketplace listing:

   ```text
   https://github.com/marketplace/actions/maintainerops-ai
   ```

   The page should show:
   - Name: `MaintainerOps AI`
   - Version: the release tag, for example `v0.1.5`
   - Status: `Latest`
   - Publisher: `rtonf`

8. Update public evidence:
   - `README.md`
   - `docs/npm-install-evidence.md`
   - `docs/usage-log.md`
   - the release tracking issue
   - Issue #6 for external feedback

## Common Failure Recovery

### npm `E401 Unauthorized`

Run:

```bash
npm login
npm whoami
```

Only retry `npm publish --access public` after `npm whoami` returns the expected npm account.

### Prettier Fails Only On Line Endings

The repository sets:

```json
"endOfLine": "auto"
```

If format checks still fail after a Windows checkout, run:

```bash
npx prettier --write .
npm run format:check
```

Commit only real content/configuration changes, not unrelated generated artifacts.

### GitHub Marketplace Published But README Looks Stale

Marketplace renders the repository README from the release/action source. After updating npm or Marketplace status:

1. Update README evidence.
2. Push to `main`.
3. Confirm the Marketplace page again.

## External Feedback Loop

Issue #6 is the public feedback target:

```text
https://github.com/rtonf/maintainerops-ai/issues/6
```

Ask testers to include:

- install or workflow result
- repository or fixture used
- whether the packet helps PR/issue triage
- what was noisy, unclear, or missing
- whether they would use it in a read-only OSS maintainer workflow
