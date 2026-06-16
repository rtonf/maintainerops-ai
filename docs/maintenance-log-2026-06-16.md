# Maintenance Log: 2026-06-16

## Context

The Codex for Open Source application has been submitted. Today's maintenance goal is to complete the first-week public evidence loop and make the external feedback path easier to share.

## Checks

- GitHub Marketplace: `MaintainerOps AI` displays `v0.1.6` as `Latest`.
- GitHub Release: `v0.1.6` is published.
- npm registry: `maintainerops-ai@0.1.5` is published as the `latest` dist-tag.
- Issue #6 remains open for external maintainer feedback.
- Promotion material is now linked from README.
- GitHub Actions: manual `workflow_dispatch` run succeeded at `https://github.com/rtonf/maintainerops-ai/actions/runs/27619164451`.

## Actions

- Repaired Japanese promotion documents that had encoding corruption.
- Added Japanese X post drafts and a Japanese note article draft for external outreach.
- Kept the English promotion kit as the source of reusable positioning, copy blocks, target communities, and outreach checklist.
- Updated README links so the promotion kit and Japanese outreach material are visible from the public project page.
- Completed the 2026-06-16 weekly usage-log entry.
- Added a concise final feedback request comment to Issue #6: `https://github.com/rtonf/maintainerops-ai/issues/6#issuecomment-4718966092`.
- Verified a fresh manual GitHub Actions workflow run for the 2026-06-16 maintenance update.
- Published npm `maintainerops-ai@0.1.5` after `npm run verify` passed.
- Verified the public npm package with `npm view maintainerops-ai version dist-tags time --json` and `npm exec --yes --package maintainerops-ai@latest -- maintainerops --help`.

## Weekly Maintenance Summary

From 2026-06-10 through 2026-06-16, MaintainerOps AI produced and published evidence across:

- issue triage examples
- npm package verification through `maintainerops-ai@0.1.5`
- real repository review packets
- full Codex Security rescan and fix evidence
- GitHub Action hardening
- Marketplace publication through `v0.1.6`
- deterministic eval coverage
- external feedback request loop
- promotion and outreach material

## Current Gaps

- External maintainer feedback on Issue #6 is still the largest remaining adoption signal gap.
- More real repository review packet examples would strengthen the evidence base.

## Next Improvements

- Ask 5-10 OSS maintainers to try the CLI or Action and comment on Issue #6.
- Add one more real review packet from an owned public repository.
- Convert the most useful external feedback into eval cases and roadmap issues.
