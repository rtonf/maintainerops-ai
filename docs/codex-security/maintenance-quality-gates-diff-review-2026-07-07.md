# Maintenance Quality Gates Diff Review: 2026-07-07

This API-free security diff review covers the maintenance hardening batch that adds a required-candidate CI workflow, CODEOWNERS, model-backed eval budget fail-closed behavior, public review packet cleanup, and feedback evidence updates.

## Scope

- `.github/workflows/ci.yml`
- `.github/CODEOWNERS`
- `src/eval/run-model-eval.ts`
- `src/eval/run-model-eval.test.ts`
- `docs/review-packets/*.md` public packet encoding cleanup
- feedback, eval, tooling, and maintenance documentation

## Security Boundary Review

- The new CI workflow runs `npm run verify` with read-only `contents` permissions.
- GitHub Actions dependencies are pinned to full commit SHAs with version comments, matching the existing repository convention.
- CODEOWNERS documents review ownership for repository-wide files, GitHub workflows, release metadata, security docs, evals, and source code.
- Model-backed evals now fail closed when pricing is missing for the selected model, preventing an unknown live model from bypassing the budget guard as `$0`.
- Review packet cleanup changes public Markdown evidence only; it does not alter runtime behavior.
- No OpenAI API call path, GitHub write path, auto-merge, auto-close, auto-label, release publishing, or unauthorized repository scanning behavior was added.

## Result

No reportable security findings.

## Verification

- `npm run verify`
- `git diff --check`
- review packet encoding check for NUL bytes and Unicode replacement characters
- GitHub settings check for Dependabot security updates

Follow-up after merge: require the new `npm run verify` check in branch protection after the first successful PR run exists on GitHub.
