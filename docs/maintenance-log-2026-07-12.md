# Maintenance Log: 2026-07-12

## Completed

- Resumed the repository-wide Codex Security scan using an ASCII-path clone of the same Git revision to satisfy the scan worktree boundary.
- Completed coverage for all 59/59 review rows.
- Published the generated report, canonical JSON, SARIF export, three detailed write-ups, and structural hardening portfolio under `docs/codex-security/full-rescan-2026-07-12/`.
- Fixed the three reportable baseline findings in a review branch:
  - release-only, tag-scoped npm publication;
  - case-insensitive Bearer redaction;
  - neutralization of legacy and modern GitHub Actions command markers.
- Rebuilt the Action bundle and passed `npm run verify`.

## Current public state verified

- PR #98 remains open as a draft with merge state `CLEAN`.
- CodeQL, `npm run verify`, Node 20 compatibility, and Action analysis checks all passed.
- npm `latest` and the latest GitHub Release are both `v0.1.14`.
- Issue #6 remains open; its current comments are owner-authored and external maintainer feedback has not arrived yet.
- The post-fix Codex Security diff scan is still pending because the workspace service did not retain the valid ASCII-path setup. No post-fix scan claim is made.

## Evidence

- [Full rescan report](codex-security/full-rescan-2026-07-12.md)
- [Fix report](codex-security/full-rescan-fix-report-2026-07-12.md)
- [GitHub Actions security workflow](../.github/workflows/npm-publish.yml)

## Next maintenance gate

Merge the fix branch, confirm protected release tags and npm environment settings, then run a post-fix diff scan before the next release. External maintainer feedback on Issue #6 remains the main adoption gap.
