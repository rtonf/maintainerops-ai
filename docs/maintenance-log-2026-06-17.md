# Maintenance Log: 2026-06-17

## Context

The project is now in post-application maintenance. Today's goal is to keep the evidence stream active, add another real review packet, and capture a concrete false-positive observation for future eval work.

## Checks

- GitHub Marketplace: `MaintainerOps AI` displays `v0.1.6` as `Latest`.
- GitHub Release: `v0.1.6` is published.
- npm registry: `maintainerops-ai@0.1.5` is published as the `latest` dist-tag.
- Issue #6 remains open as the external maintainer feedback collection point.
- Working tree was clean before today's edits.
- Local verification: `npm run verify` passed after the analyzer, unit test, eval, packet, and docs updates.

## Actions

- Generated a real review packet for `rtonf/maintainerops-ai` issue #6.
- Added the packet to `docs/review-packets/maintainerops-ai-issue-6.md`.
- Updated `docs/review-packets/README.md` so the new packet is discoverable.
- Ran a fresh manual GitHub Actions workflow on `main`: `https://github.com/rtonf/maintainerops-ai/actions/runs/27697651320`.
- Fixed the offline analyzer false positive found in the issue #6 packet.
- Added a unit test and deterministic eval case for feedback/outreach issues that mention security evidence.
- Re-ran `npm run verify`; 23 unit tests, 1 UI smoke test, 7 eval cases, package dry run, publint, and npm audit all passed.

## Observation

The issue #6 packet surfaced and then verified a false-positive fix:

- Issue #6 is a feedback request, not a vulnerability report.
- The offline analyzer elevated risk because the issue context mentions security, release, authorization, and Marketplace evidence.
- The analyzer now keeps this class of feedback/outreach issue at low risk unless it describes an actionable vulnerability.
- The regression is covered by `external feedback issue mentions security evidence`.

## Current Gaps

- External maintainer feedback from someone other than the repository owner is still the largest adoption signal gap.
- More real repository packets from owned public repositories would strengthen practical evidence.
- The offline analyzer still needs more real-world false-positive and false-negative examples.

## Next Improvements

- Ask 5-10 maintainers to try npm or the Marketplace Action and comment on Issue #6.
- Add one more packet from a separate owned public repository.
- Continue improving issue intent detection as more feedback arrives.
