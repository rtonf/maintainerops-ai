# Codex Security Diff Scan: Marketplace Preparation

Date: 2026-06-11

Target: Marketplace metadata and README GitHub Action usage guidance.

## Scope

Reviewed diff-scoped files:

- `action.yml`
- `README.md`
- `docs/github-marketplace.md`
- `docs/usage-log.md`

Supporting files checked:

- `src/action.ts`
- `.github/workflows/maintainerops.yml`
- `docs/github-workflows/maintainerops.yml`

## Threat Model

The relevant security boundary is GitHub Actions execution in a maintainer-owned repository. Marketplace users may copy the README workflow and run the reusable Action on pull requests or issues. Contributor-controlled issue/PR content must remain untrusted data, repository credentials must remain read-only, and live repository analysis must require explicit maintainer authorization.

Key assets:

- `GITHUB_TOKEN` permissions in the consuming workflow.
- Optional `OPENAI_API_KEY` when maintainers choose live model-backed analysis.
- Maintainer trust in generated review packets.
- Public Marketplace guidance that users may copy directly.

## Findings

No reportable security findings were introduced by this diff.

## Validation

- `action.yml` adds Marketplace `branding` only and keeps the existing explicit `authorized` input.
- The README workflow uses read-only permissions: `contents: read`, `pull-requests: read`, and `issues: read`.
- The README workflow keeps `actions/checkout` configured with `persist-credentials: false`.
- The Marketplace description states that the Action is human-in-the-loop and does not merge, close, label, comment, release, or publish automatically.
- `src/action.ts` still forwards `--authorized` only when `INPUT_AUTHORIZED=true` or `MAINTAINEROPS_AUTHORIZED=true`.
- No new secret-bearing environment variables were added by the Marketplace guidance.

## Verification

```bash
git diff --check
npm run verify
```

Result:

- `git diff --check` passed.
- `npm run verify` passed, including typecheck, lint, Prettier check, unit tests, Playwright UI smoke test, evals, package dry run, publint, and `npm audit --audit-level=moderate`.

## Residual Risk

The README example sets `authorized: true` because the Action runs inside the repository where the maintainer installs it. Users should only install it on repositories they own, maintain, or are explicitly authorized to administer. External public feedback is still needed to prove real-world usefulness beyond local validation.
