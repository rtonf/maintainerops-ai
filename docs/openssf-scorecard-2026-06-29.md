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

## SHA-Pinned Workflow Run

- Workflow: `OpenSSF Scorecard`
- Trigger: `workflow_dispatch`
- Run: `https://github.com/rtonf/maintainerops-ai/actions/runs/28371626145`
- Commit: `3a302d1e699c94128eb4b608ba50388da85514d6`
- Overall score: `6.8`
- Security-Policy: `10`
- Pinned-Dependencies: `10`
- CI-Tests: `10`
- Vulnerabilities: `10`
- Dangerous-Workflow: `10`
- Notes: branch protection is enabled and documented separately, but Scorecard still reports an internal read error for classic branch protection rules with its workflow token.

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
- GitHub Actions are pinned to full commit SHAs.
- The security policy is recognized as complete by Scorecard.
- OpenSSF Best Practices badge work has not started.
- Fuzzing is not configured.
- Scorecard does not detect the npm publication path because package publishing is still manually triggered rather than GitHub Actions based.
- The repository is new, so the maintained/contributors signals are still weak.

## Follow-Up Priority

1. Track branch protection manually because the Scorecard workflow token reported an internal read error for classic branch protection rules.
2. Evaluate npm Trusted Publishing/provenance before the next npm release.
3. Revisit fuzzing only if parser/model-boundary logic grows enough to justify it.
4. Re-run Scorecard after future workflow-auth changes.

## Notes

The first manual Scorecard run failed because `id-token: write` was configured at workflow scope. PR #39 moved write permissions to job scope, and the next manual run passed.

The first SHA-pinned Scorecard run failed because the workflow used the annotated tag object SHA for `ossf/scorecard-action@v2.4.3`. A second run failed because Scorecard publish verification does not accept a pinned `github/codeql-action/upload-sarif` subaction. The current workflow uses the dereferenced Scorecard commit SHA and stores SARIF through pinned `actions/upload-artifact`.
