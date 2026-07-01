# Strategy Roadmap: 2026-07-01

## Position

MaintainerOps AI should stay focused on one clear promise:

> Read-only review packets for overloaded OSS maintainers.

The project should not present itself as a general GitHub bot or autonomous maintainer. Its strongest position is a human-in-the-loop tool that converts noisy pull requests, issues, dependency changes, security notes, and release tasks into review packets that a maintainer can audit, edit, or ignore.

## Current Strengths

- npm `maintainerops-ai@0.1.11` is published through npm Trusted Publishing with provenance.
- GitHub Release `v0.1.11` is public.
- The repository includes SECURITY, EVALS, Codex Security reports, usage logs, review packets, release notes, and npm install evidence.
- The Action and CLI are read-only by design and avoid auto-merge, auto-close, auto-label, and auto-release behavior.
- Deterministic offline evals and manual model-backed evals are both present.
- The project has a public external feedback issue and GitHub Discussion.

## Current Gaps

- External maintainer feedback is still the largest adoption gap.
- GitHub Marketplace still needs to be refreshed from `v0.1.9` to the latest Action release.
- Some outreach material needed version refresh after the `v0.1.11` Trusted Publishing release.
- The project has very low stars and forks despite stronger clone traffic.
- GitHub's community profile is strong but can improve with a Code of Conduct and clearer license detection.

## Near-Term Priorities

1. Refresh GitHub Marketplace to the latest release.
2. Keep all external feedback material on npm `0.1.11` and Action `v0.1.11`.
3. Ask 10 maintainers for concrete feedback and capture responses on Issue #6.
4. Convert any real feedback into issues, eval cases, and review-packet examples.
5. Expand model-backed evals to 8-10 maintainer-labeled cases while keeping API use manual and budget-gated.
6. Add one new review packet from an authorized public repository.
7. Add Code of Conduct and verify GitHub community profile improvements.

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
