# OpenSSF Scorecard Evidence: 2026-07-02

## Run

- Workflow: OpenSSF Scorecard
- Trigger: `workflow_dispatch`
- Run: https://github.com/rtonf/maintainerops-ai/actions/runs/28580654645
- Result: success
- Scorecard version: `v5.3.0`
- Aggregate score: `7.1`

## Notable Passing Signals

- `Security-Policy`: `10`
- `Dangerous-Workflow`: `10`
- `Binary-Artifacts`: `10`
- `Dependency-Update-Tool`: `10`
- `Pinned-Dependencies`: `10`
- `Packaging`: `10`
- `Vulnerabilities`: `10`
- `SAST`: `10`
- `CI-Tests`: `10`
- `Token-Permissions`: `9`
- `License`: `9`

## Remaining Weaknesses

- `Code-Review`: `0`; Scorecard did not identify approved changesets even though branch protection and CI checks are active.
- `Maintained`: `0`; the repository is still new enough to trigger the under-90-days warning.
- `CII-Best-Practices`: `0`; no OpenSSF Best Practices badge is configured yet.
- `Fuzzing`: `0`; no fuzzing integration is present.
- `Contributors`: `0`; this remains owner-maintained while external feedback is being collected.
- `Branch-Protection`: `-1`; Scorecard reported a token visibility limitation for classic branch protection rules.
- `Signed-Releases`: `-1`; GitHub releases are not yet signed release artifacts.

## Follow-Up

- Keep branch protection and CI evidence visible in docs even when Scorecard cannot read all protection details.
- Consider OpenSSF Best Practices Badge registration after the next release cycle.
- Keep external maintainer feedback as the highest-impact improvement for adoption evidence.
- Recheck GitHub license detection after the canonical Apache-2.0 license text lands on `main`.
