# Publication Audit

Date: 2026-06-11

Scope:

- Local project tree at `C:\Users\mario\Documents\project　1a`
- Public GitHub repository `rtonf/maintainerops-ai`
- GitHub releases and release assets
- npm package dry-run contents

## Summary

No live secrets or private keys were found in the publishable source tree. The largest cleanup opportunity is public evidence hygiene: remove design-only/reference artifacts and old draft material that does not strengthen the Codex for Open Source application.

The most important functional issue was the GitHub Action runtime. The public repository does not publish `dist/action.js`, while `action.yml` previously used `node20` with `main: dist/action.js`. To avoid publishing generated `dist/` and dependency files to GitHub, the Action was converted to a composite action that installs dependencies, builds the trusted action source from the published tag, and then runs `dist/action.js`.

## Selected GitHub Removal Candidates

These files are not necessary for public GitHub review and can be removed in a cleanup PR:

- `design/security-review-workbench-reference.png`
  - Reason: large design reference image, duplicated in purpose by the optimized public screenshot/GIF under `docs/images/`.
  - Public value: low after README demo assets were added.
- `design-qa.md`
  - Reason: internal design QA note, not linked from README, not required for npm, Marketplace, security, eval, or application evidence.
  - Public value: low.
- `docs/application-draft.md`
  - Reason: superseded by `docs/application-answers.md`.
  - Public value: low; keeping only the final application answers is clearer for reviewers.

## Keep Public

These files should remain public because they strengthen reviewer trust or are required for the product:

- `README.md`, `SECURITY.md`, `CONTRIBUTING.md`, `ROADMAP.md`, `LICENSE`
- `EVALS.md` and `examples/evals/golden.json`
- `docs/application-answers.md`
- `docs/usage-log.md`
- `docs/review-packets/`
- `docs/codex-security/*.md`
- `docs/codex-security/*.html`
- `docs/images/security-review-workbench.gif`
- `docs/images/security-review-workbench.png`
- `action.yml`
- `.github/workflows/maintainerops.yml`
- source, tests, package metadata, and lockfile

The HTML Codex Security reports are redundant with Markdown reports, but they are intentionally kept because they are easy for reviewers to open and inspect in a browser.

## Keep Local Only

These paths are intentionally ignored and should not be published to GitHub:

- `node_modules/`
- `dist/`
- `dist-web/`
- `artifacts/`
- `test-results/`
- `coverage/`
- `playwright-report/`
- `.env`
- `.env.*`

The local `.env.example` is also ignored by the current `.gitignore`. It contains only placeholders, but it is not required because README already documents the environment variables.

## npm Package Notes

`npm pack --dry-run --json` shows the package is small, but it currently includes generated test files and source maps under `dist/`:

- `dist/*.test.js`
- `dist/*.test.d.ts`
- `dist/*.js.map`

These are not a security issue, but they are not required for runtime. Recommended follow-up for `v0.1.3`: narrow the npm `files` allowlist so only runtime JavaScript, declarations, README, license, security policy, eval fixtures, and `action.yml` are shipped.

## GitHub Release Notes

GitHub releases currently have no attached binary assets. That is acceptable. The public evidence is in the repository tree, npm package, release notes, and docs.

## Secret Scan Result

Pattern checks for OpenAI keys, npm tokens, GitHub tokens, and private key headers found no live credentials. Matches were limited to documented placeholders, security reports, tests, and source code that handles redaction.

## Current Recommendation

Before publishing to GitHub Marketplace:

1. Keep generated `dist/`, `dist-web/`, `node_modules/`, and `artifacts/` out of GitHub.
2. Use the composite `action.yml` runtime so the Action can build from the trusted tag without committing generated output.
3. Publish a follow-up release tag after this cleanup so Marketplace users can reference the fixed Action metadata.
4. For the next npm patch, remove test build outputs and source maps from the npm package.
