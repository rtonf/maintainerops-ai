# Strategy Roadmap: 2026-07-01

## Position

MaintainerOps AI should stay focused on one clear promise:

> Read-only review packets for overloaded OSS maintainers.

The project should not present itself as a general GitHub bot or autonomous maintainer. Its strongest position is a human-in-the-loop tool that converts noisy pull requests, issues, dependency changes, security notes, and release tasks into review packets that a maintainer can audit, edit, or ignore.

## Current Strengths

- npm `maintainerops-ai@0.1.14` is published through npm Trusted Publishing with provenance.
- GitHub Release `v0.1.14` is public.
- GitHub Marketplace displays `v0.1.14` as the latest Action release.
- The no-key `maintainerops demo` path gives external testers a packet without `OPENAI_API_KEY`, `GITHUB_TOKEN`, local fixtures, or repository access.
- The repository includes SECURITY, EVALS, Codex Security reports, usage logs, review packets, release notes, and npm install evidence.
- The Action and CLI are read-only by design and avoid auto-merge, auto-close, auto-label, and auto-release behavior.
- Deterministic offline evals and manual model-backed evals are both present.
- The project has a public external feedback issue and GitHub Discussion.

## Current Gaps

- External maintainer feedback is still the largest adoption gap.
- Some older outreach material still needs cleanup or archiving so the no-key demo is the only current first-run CTA.
- The project has very low stars and forks despite stronger clone traffic.
- Code scanning includes stale or residual OpenSSF Scorecard alerts that need triage.

## Near-Term Priorities

1. Collect 5-10 concrete maintainer feedback reports on Issue #6 or Discussion #17.
2. Convert real feedback into issues, eval cases, review-packet examples, or onboarding changes.
3. Require the new `npm run verify` CI check in branch protection after its first successful GitHub run.
4. Triage open Code Scanning / Scorecard alerts and separate stale alerts from true residual work.
5. Evaluate SBOM/OSV scanning in Issue #87 without adding noisy PR blockers by default.
6. Add one new review packet from an authorized public repository.
7. Keep model-backed evals manual, budget-gated, and fail-closed for unknown pricing.

## Product Direction

Focus on:

- PR risk and test-gap review packets.
- Issue triage packets.
- Dependency/security finding summaries supplied by maintainers.
- Release readiness packets.
- Human-reviewed comment drafts.

Avoid:

- automatic merges
- automatic issue closing
- automatic labels without maintainer confirmation
- scanning unauthorized repositories
- required model-backed evals in CI
- broad "AI agent for GitHub" positioning

## Success Metrics

- External feedback comments on Issue #6.
- Weekly npm downloads and registry execution evidence.
- GitHub Marketplace version freshness.
- Real review packets generated from authorized repositories.
- False-positive and false-negative eval cases added from real maintainer feedback.
- Maintainer-reported time saved or decision clarity.
