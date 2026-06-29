# Maintenance Log: 2026-06-30

## Context

Today's maintenance focuses on continuing post-application hardening after Scorecard, branch protection, workflow pinning, and security policy improvements landed on 2026-06-29.

## Completed

- Created a one-time Codex heartbeat to resume this thread at 2026-06-30 02:08 JST if the session is interrupted.
- Confirmed local `main` is aligned with `origin/main`.
- Confirmed there are no open pull requests.
- Confirmed Issue #6 remains the only open issue and is still the public external feedback target.
- Researched npm Trusted Publishing and provenance from official npm documentation.
- Added `docs/npm-trusted-publishing.md` with requirements, setup checklist, workflow guardrails, and current status.
- Opened Issue #48 to track npm Trusted Publishing/provenance setup publicly.
- Refreshed Issue #6 with current external tester instructions and supply-chain hardening status.
- Checked model-backed eval readiness; `OPENAI_API_KEY` and `OPENAI_MODEL` are not set in the local environment.
- Added `docs/model-backed-eval-plan.md` and updated `EVALS.md` with a manual-first model-backed eval plan.

## Verification

- Documentation changes will be checked with `npm run format:check` and `git diff --check`.
- Issue #48: `https://github.com/rtonf/maintainerops-ai/issues/48`.
- Issue #6 refresh: `https://github.com/rtonf/maintainerops-ai/issues/6#issuecomment-4834421198`.
- Model-backed evals were not executed because no OpenAI API key is present in the local environment.

## Next

- Configure npm package trusted publisher in npmjs.com package settings.
- Add the active npm publishing workflow only after npm package settings are configured.
- Continue external feedback collection through Issue #6.
- Open a public tracking issue for model-backed eval implementation.
- Plan the next Codex Security repo-wide scan before the next source release candidate.
