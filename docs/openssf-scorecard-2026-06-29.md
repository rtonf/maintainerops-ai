# OpenSSF Scorecard Report: 2026-06-29

## Run

- Workflow: `OpenSSF Scorecard`
- Trigger: `workflow_dispatch`
- Run: `https://github.com/rtonf/maintainerops-ai/actions/runs/28353155952`
- Commit: `a28b54d1cfd68801ed8de347b4696311b0d6bea6`
- Scorecard version: `v5.3.0`
- Overall score: `5.5`

## Follow-Up Run

- Workflow: `OpenSSF Scorecard`
- Trigger: `workflow_dispatch`
- Run: `https://github.com/rtonf/maintainerops-ai/actions/runs/28353954993`
- Commit: `2c66ea5704d7c5ad126c334a0033c700a5de55a9`
- Overall score: `6.1`
- Reason for improvement: expanded security policy, CodeQL/SAST history improved, and branch protection was enabled separately through the GitHub API.

## Strong Signals

- Dependency update tool detected: Dependabot.
- CI tests detected on merged pull requests.
- Dangerous workflow patterns not detected.
- No binary artifacts detected.
- No existing vulnerabilities detected.
- CodeQL/SAST detected.
- Workflow token permissions are mostly constrained, with the Scorecard write permissions scoped to the job.

## Findings To Track

- Branch protection is enabled for `main`, but the Scorecard workflow token reported an internal read error for classic branch protection rules.
- GitHub Actions are not pinned to full commit SHAs.
- The security policy was expanded after the first run; continue monitoring whether Scorecard recognizes the direct private advisory link.
- OpenSSF Best Practices badge work has not started.
- Fuzzing is not configured.
- Scorecard does not detect the npm publication path because package publishing is still manually triggered rather than GitHub Actions based.
- The repository is new, so the maintained/contributors signals are still weak.

## Follow-Up Priority

1. Track branch protection manually because the Scorecard workflow token reported an internal read error for classic branch protection rules.
2. Decide whether to pin GitHub Actions to commit SHAs or keep semver tags with Dependabot updates for this early project stage.
3. Re-run Scorecard after future security policy or workflow-auth changes.
4. Evaluate npm Trusted Publishing/provenance before the next npm release.
5. Revisit fuzzing only if parser/model-boundary logic grows enough to justify it.

## Notes

The first manual Scorecard run failed because `id-token: write` was configured at workflow scope. PR #39 moved write permissions to job scope, and the next manual run passed.
