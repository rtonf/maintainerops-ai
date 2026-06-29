# OpenSSF Scorecard Report: 2026-06-29

## Run

- Workflow: `OpenSSF Scorecard`
- Trigger: `workflow_dispatch`
- Run: `https://github.com/rtonf/maintainerops-ai/actions/runs/28353155952`
- Commit: `a28b54d1cfd68801ed8de347b4696311b0d6bea6`
- Scorecard version: `v5.3.0`
- Overall score: `5.5`

## Strong Signals

- Dependency update tool detected: Dependabot.
- CI tests detected on merged pull requests.
- Dangerous workflow patterns not detected.
- No binary artifacts detected.
- No existing vulnerabilities detected.
- CodeQL/SAST detected.
- Workflow token permissions are mostly constrained, with the Scorecard write permissions scoped to the job.

## Findings To Track

- Branch protection is not enabled for `main`.
- GitHub Actions are not pinned to full commit SHAs.
- The security policy exists, but Scorecard wants clearer linked disclosure/timeline content.
- OpenSSF Best Practices badge work has not started.
- Fuzzing is not configured.
- Scorecard does not detect the npm publication path because package publishing is still manually triggered rather than GitHub Actions based.
- The repository is new, so the maintained/contributors signals are still weak.

## Follow-Up Priority

1. Enable branch protection for `main` after confirming the desired required checks.
2. Decide whether to pin GitHub Actions to commit SHAs or keep semver tags with Dependabot updates for this early project stage.
3. Expand `SECURITY.md` with clearer vulnerability disclosure, response timeline, and contact guidance.
4. Evaluate npm Trusted Publishing/provenance before the next npm release.
5. Revisit fuzzing only if parser/model-boundary logic grows enough to justify it.

## Notes

The first manual Scorecard run failed because `id-token: write` was configured at workflow scope. PR #39 moved write permissions to job scope, and the next manual run passed.
