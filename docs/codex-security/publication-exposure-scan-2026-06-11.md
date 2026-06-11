# Codex Security Publication Exposure Scan

Date: 2026-06-11

Target:

- Local project tree
- Public GitHub repository `rtonf/maintainerops-ai`
- GitHub release metadata
- npm package dry-run contents

## Scope Reviewed

- Git tracked files on `main`
- GitHub public tree through the GitHub API
- GitHub releases and release assets
- npm package dry-run file list
- Ignored local build/output directories
- README, Action metadata, Marketplace guidance, and security/application evidence docs

## Result

No live API keys, npm tokens, GitHub tokens, or private keys were found in publishable files.

No new reportable security finding was identified in the public documentation or Action metadata after the cleanup. One functional publication issue was found and fixed:

- `action.yml` previously used `node20` with `main: dist/action.js`, but `dist/` is intentionally not committed to GitHub.
- The Action was converted to a composite action that runs `npm ci`, builds the trusted tagged action source, and runs `node dist/action.js`.
- This keeps generated `dist/`, `dist-web/`, and `node_modules/` out of GitHub while making the Marketplace Action runnable.

## Public Removal

The following files were selected as safe to remove because they do not materially strengthen the public application evidence:

- `design/security-review-workbench-reference.png`
- `design-qa.md`
- `docs/application-draft.md`

They were removed in the follow-up `v0.1.3` cleanup.

## Keep Public

Keep the following categories public:

- Final README, SECURITY, CONTRIBUTING, ROADMAP, LICENSE
- EVALS and deterministic fixtures
- Final application answers
- Usage log and improvement history
- Review packets
- Codex Security reports
- Demo GIF and optimized screenshot
- GitHub workflow and Action metadata
- Source, tests, package metadata, and lockfile

## Keep Local Only

The following ignored local paths should remain unpublished:

- `node_modules/`
- `dist/`
- `dist-web/`
- `artifacts/`
- `test-results/`
- `coverage/`
- `playwright-report/`
- `.env`
- `.env.*`

## Verification

Commands run:

```bash
git diff --check
npm run verify
npm pack --dry-run --json
rg -n --hidden --glob '!node_modules/**' --glob '!dist/**' --glob '!dist-web/**' --glob '!security-scans/**' --glob '!artifacts/**' --glob '!package-lock.json' --glob '!.git/**' 'sk-[A-Za-z0-9_-]{20,}|npm_[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY' .
```

Observed:

- `git diff --check` passed.
- `npm run verify` passed.
- `npm pack --dry-run --json` confirmed the package remains small and publishable.
- Secret-pattern search returned no live credential matches.

## Follow-Up

- Publish a new GitHub release tag after the composite Action change.
- Publish the `v0.1.3` GitHub release and npm package after verification.
