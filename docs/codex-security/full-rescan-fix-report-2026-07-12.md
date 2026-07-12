# Full Rescan Fix Report: 2026-07-12

The repository-wide scan of commit `40ab2aaf0875d0b9074642ba4f51223f1bd4200a` reported three findings. This change applies the narrow remediations below; it does not retroactively change the baseline report.

## Fixes

| Finding | Fix | Verification |
| --- | --- | --- |
| MOAI-007, High | Removed arbitrary `workflow_dispatch` publication input and made the release workflow checkout `refs/tags/${{ github.event.release.tag_name }}` only. | Workflow source review; release-tag verifier remains required; `npm run verify` passed. |
| MOAI-001, Medium | Made Bearer credential redaction case-insensitive and added lowercase/mixed-case regression coverage. | `src/redaction.test.ts`; `npm run verify` passed. |
| MOAI-003, Medium | Neutralized both legacy `##[` and modern `::` runner command markers across stdout output, with regression assertions. | `src/format.test.ts`; `npm run verify` passed. |

## Verification evidence

- `npm run verify` passed.
- Typecheck, ESLint, Prettier, 68 source tests, Playwright UI smoke, 7 offline eval cases, package dry-run, publint, and npm audit all passed.
- The Action bundle was rebuilt so `dist-action/index.js` contains the source fixes.

## Remaining operational work

1. Merge this change after GitHub Actions checks pass.
2. Protect release tags and the npm publication environment in repository settings.
3. Run a post-fix Codex Security diff scan against the merged commit.
4. Publish a new npm/Marketplace release only after the post-fix scan is clean for these paths.

The baseline scan and detailed evidence remain at [full-rescan-2026-07-12.md](full-rescan-2026-07-12.md).
