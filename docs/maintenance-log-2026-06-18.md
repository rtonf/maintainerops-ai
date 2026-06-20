# Maintenance Log: 2026-06-18

## Context

Today's maintenance review focused on aligning the public GitHub repository, npm evidence, Marketplace status, and local source state after the 2026-06-17 Issue #6 false-positive fix.

## Checks

- Working tree was clean before the update.
- Local tags were synchronized with `git fetch --tags origin`; remote tags now include `v0.1.4`, `v0.1.5`, and `v0.1.6`.
- GitHub Release latest is `v0.1.6`.
- npm latest is `maintainerops-ai@0.1.5`.
- GitHub Actions recent manual runs are passing.
- Issue #6 remains open as the public external-feedback collection point.
- Issue #6 still has only owner-authored comments; external maintainer feedback remains the biggest adoption evidence gap.

## Actions

- Prepared source version `0.1.7` as the next release candidate.
- Tightened offline analyzer behavior for external feedback requests that mention security or release evidence.
- Added forbidden-label eval support so noisy labels can fail deterministic evals.
- Updated the external feedback request and README evidence snapshot to distinguish published npm/Marketplace versions from the source release candidate.
- Added `docs/releases/v0.1.7.md` as the next publication checklist.
- Re-ran the verification gate after the changes.

## Current Gaps

- Publish npm `maintainerops-ai@0.1.7` after OTP confirmation.
- Create GitHub Release `v0.1.7` and publish it to GitHub Marketplace.
- Add a fresh Issue #6 comment after the Marketplace listing shows `v0.1.7`.
- Collect at least one external maintainer comment on Issue #6.

## Next Improvements

- Add a model-backed eval that compares structured OpenAI output against the deterministic golden set.
- Add one more real repository packet from an authorized public repository.
- Keep measuring false positives and false negatives from real maintainer packets.
