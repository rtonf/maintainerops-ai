# Security Review: MaintainerOps AI

## Scope

- Target: `C:\Users\mario\Documents\project　1a`
- Repository: `rtonf/maintainerops-ai`
- Scan mode: Codex Security repository-wide full rescan.
- Scan date: 2026-06-11.
- Commit at scan start: `dc336f2`.
- In-scope code: CLI, GitHub Action wrapper/workflow, GitHub API ingestion, OpenAI prompt/response path, redaction, formatter/report output, offline analyzer, eval harness, React/Vite dashboard, demo tooling, package metadata, lockfile, and security/application docs.
- Threat model: generated during Phase 1 and saved to `artifacts/01_context/threat_model.md`; this is scan-generated context, not an external input.
- Artifacts reviewed: `rank_input.csv`, `deep_review_input.csv`, `work_ledger.jsonl`, `raw_candidates.jsonl`, `repository_coverage_ledger.md`, per-candidate ledgers, validation reports, attack-path reports, and `npm run verify` output.
- Exclusions and limitations: generated `dist-web` and `test-results` artifacts were closed as not applicable after canonical source review; no live OpenAI request or real credential disclosure was performed.

### Scan Summary

| Field | Value |
| --- | --- |
| Reportable findings | 4 fixed during scan; 0 unfixed |
| Severity mix | medium: 2 fixed; low: 2 fixed |
| Confidence mix | high: 2; medium-high: 2 |
| Coverage | 31 rank/deep-review rows generated; 16 repository coverage ledger rows closed |
| Candidate ledger status | MOAI-005 through MOAI-008 each have discovery, validation, and attack-path receipts |
| Validation mode | Static source/config tracing, focused runtime probes, local tests, `npm run verify`, and `npm audit --audit-level=moderate` |
| Markdown report | `C:\Users\mario\AppData\Local\Temp\codex-security-scans\project-1a\dc336f2_20260611T000000Z\report.md` |
| HTML report | `C:\Users\mario\AppData\Local\Temp\codex-security-scans\project-1a\dc336f2_20260611T000000Z\report.html` |
| Public report copy | `docs/codex-security/full-rescan-2026-06-11.md` |

## Threat Model

# MaintainerOps AI Repository Threat Model

Date: 2026-06-11  
Repository: rtonf/maintainerops-ai  
Scope: entire repository at commit dc336f2

## Product surfaces

MaintainerOps AI is a TypeScript/Node.js OSS maintainer assistant with these runtime surfaces:

- CLI entrypoint that analyzes local fixtures or authorized GitHub issues/pull requests.
- GitHub API client that fetches issue, pull request, diff, file, comment, and metadata context using `GITHUB_TOKEN`.
- OpenAI API client that sends redacted maintainer work-item context and expects structured assessment output.
- GitHub Action wrapper and workflow that run the analyzer in CI.
- Offline heuristic analyzer used for deterministic CI, evals, and public examples.
- React/Vite dashboard prototype for displaying maintainer review workflow state.
- Eval harness, fixtures, examples, and documentation used by maintainers and applicants.

## Assets and privileges

- `OPENAI_API_KEY`, `GITHUB_TOKEN`, and any user-provided tokens or secrets in issues, PRs, diffs, fixtures, comments, logs, or environment variables.
- Repository read permissions granted to GitHub Actions and local CLI runs.
- Maintainer attention and trust in AI-generated labels, risk levels, comments, release notes, and security notes.
- Public npm package integrity and GitHub Action behavior.
- Public security/evidence reports used in application review.

## Trust boundaries

- User-provided CLI arguments cross into local file reads and GitHub API selection.
- Local fixture JSON crosses into analyzer logic, redaction, model prompts, and report formatting.
- GitHub issue/PR titles, bodies, comments, diffs, file paths, and check metadata are attacker-controlled when analyzing public contributions.
- OpenAI model output is untrusted text and must not be treated as executable workflow commands or authoritative maintainer decisions.
- GitHub Actions events, especially `pull_request`, run against untrusted contribution context and must not receive high-value secrets.
- README/docs/examples are public guidance and must not instruct unsafe secret handling.

## Required invariants

- Live GitHub analysis requires explicit `--authorized` user intent.
- The tool must not analyze repositories the user does not own, maintain, or have authorization to administer.
- Secrets and structured credentials must be redacted before model submission and before serialized report output.
- PR-triggered CI must not expose `OPENAI_API_KEY` or other high-value secrets to PR-controlled code.
- Model-controlled or attacker-controlled Markdown must not be able to emit GitHub Actions workflow commands through stdout.
- CLI and Action modes must remain human-in-the-loop: no automatic merge, close, release, vulnerability disclosure, or permission-changing side effects.
- JSON and Markdown output should preserve auditability without leaking raw untrusted secrets.
- Dependency and release tooling should remain reproducible and avoid hidden privileged package behavior.

## Repository-specific vulnerability classes of concern

- Secret exfiltration from fixtures, GitHub content, environment, logs, model prompts, JSON reports, or GitHub Actions.
- Prompt injection or instruction smuggling from untrusted issue/PR content into maintainer-facing recommendations.
- Workflow command injection through model/PR-controlled stdout in GitHub Actions.
- Unauthorized live GitHub API access or confusing authorization gates.
- Unsafe file/path handling for fixture inputs and report generation.
- XSS or unsafe rendering in the dashboard if untrusted packet text is later introduced.
- Dependency supply-chain issues in npm package/runtime scripts.
- Documentation encouraging unsafe use outside owned or authorized repositories.

## Findings

| # | Title | Severity | Confidence | Status |
| --- | --- | --- | --- | --- |
| 1 | [PR-controlled build could read persisted checkout token](#1-pr-controlled-build-could-read-persisted-checkout-token) | medium | medium-high | fixed |
| 2 | [Unquoted colon-form secrets were not redacted](#2-unquoted-colon-form-secrets-were-not-redacted) | medium | high | fixed |
| 3 | [JSON output exposed non-secret raw analyzed content](#3-json-output-exposed-non-secret-raw-analyzed-content) | low | high | fixed |
| 4 | [Reusable Action auto-authorized live analysis in GitHub Actions](#4-reusable-action-auto-authorized-live-analysis-in-github-actions) | low | medium-high | fixed |

### Confidence Scale

| Label | Meaning |
| --- | --- |
| high | Direct source, configuration, or runtime evidence supports the finding, with no material unresolved reachability or exploitability blocker. |
| medium | Source evidence supports a plausible issue, but runtime behavior, deployment configuration, role reachability, type constraints, or exploit reliability still need proof. |
| low | Weak or incomplete evidence; include only when the user explicitly wants follow-up candidates in the final report. |

### [1] PR-controlled build could read persisted checkout token

| Field | Value |
| --- | --- |
| Severity | medium |
| Confidence | medium-high |
| Confidence rationale | The workflow source and actions/checkout documentation directly support the token-persistence behavior; impact is limited by read-only workflow permissions. |
| Category | CI credential exposure |
| CWE | CWE-522: Insufficiently Protected Credentials |
| Affected lines | `.github/workflows/maintainerops.yml:19-21`, `.github/workflows/maintainerops.yml:25-26`, `docs/github-workflows/maintainerops.yml:18-20` |

#### Summary

The pre-fix `pull_request` workflow checked out PR-controlled code and then ran `npm ci` and `npm run build`. `actions/checkout@v4` persists the auth token by default so later scripts can run authenticated git commands. That meant PR-controlled install or build logic could read or use the persisted read-only token before the analyzer ran.

#### Validation

Validation used static workflow review plus the official actions/checkout documentation, which states that the auth token is persisted by default and `persist-credentials: false` opts out. The workflow now sets `persist-credentials: false` in both the active workflow and mirrored sample workflow. `npm run verify` passed after the fix.

#### Dataflow

`pull_request` event -> `actions/checkout@v4` -> persisted local git credentials -> PR-controlled `npm ci` / `npm run build` -> possible token read/use. The fix inserts `persist-credentials: false` at checkout before npm commands run.

#### Reachability

A pull request author can influence package/build code in a PR workflow. The token permissions are read-only (`contents`, `issues`, `pull-requests`), so the realistic outcome is repository metadata/API read exposure rather than repository write access.

#### Severity

Medium. The bug crosses the CI credential boundary, but severity is reduced by read-only permissions and absence of high-value secrets in PR jobs. Evidence that the same pattern was used with write scopes or private sensitive repositories would raise severity; a fully isolated no-token checkout would lower it.

#### Remediation

Set `persist-credentials: false` on checkout and keep PR-triggered jobs offline/no-secret. Future workflows that need authenticated git operations should use the shortest-lived, least-privileged credential after untrusted build steps are complete.

### [2] Unquoted colon-form secrets were not redacted

| Field | Value |
| --- | --- |
| Severity | medium |
| Confidence | high |
| Confidence rationale | A focused runtime probe showed unquoted colon-form secrets survived before the fix, and the new redaction tests now cover those forms. |
| Category | Secret redaction bypass |
| CWE | CWE-200: Exposure of Sensitive Information to an Unauthorized Actor |
| Affected lines | `src/redaction.ts:13-20`, `src/redaction.test.ts:28-39` |

#### Summary

The previous redaction logic covered quoted JSON/colon values but not unquoted YAML-style values such as `api_key: secret` or `aws_secret_access_key: secret`. Those forms can appear in issues, PRs, diffs, comments, or fixtures and then flow into model prompts or report output.

#### Validation

A runtime probe confirmed the unquoted colon values survived before the fix. The fix adds an unquoted colon key-value redaction pattern covering API keys, tokens, secrets, passwords, AWS key fields, access tokens, and refresh tokens. `src/redaction.test.ts` now verifies those cases, and `npm run verify` passed.

#### Dataflow

Untrusted issue/PR/fixture content -> `buildAssessmentPrompt` or `formatAssessment` -> `redactSecrets` -> OpenAI prompt or JSON/Markdown output. The missing unquoted-colon branch was the broken control.

#### Reachability

Any maintainer who analyzes content containing YAML-style credentials could trigger the path. The attacker may be the party who placed the value in the analyzed content, but accidental credential inclusion by maintainers or private repo content is the important risk.

#### Severity

Medium. The issue can disclose credentials to model prompts or generated artifacts if sensitive content is analyzed, but it requires a credential-like value to be present in input. More evidence of private repo defaults or automatic model-backed analysis would raise severity; strict no-secret input policies would lower it.

#### Remediation

Keep the unquoted colon redaction pattern and expand regression tests when adding new credential formats. Prefer minimizing prompt/report payloads in addition to redaction.

### [3] JSON output exposed non-secret raw analyzed content

| Field | Value |
| --- | --- |
| Severity | low |
| Confidence | high |
| Confidence rationale | Canary values in body, comments, patches, and metadata survived before the fix; the formatter now omits those fields and tests assert minimization. |
| Category | Sensitive data exposure in logs/artifacts |
| CWE | CWE-200: Exposure of Sensitive Information to an Unauthorized Actor |
| Affected lines | `src/format.ts:9-10`, `src/format.ts:65-86`, `src/format.test.ts:41-55` |

#### Summary

JSON mode previously emitted the work-item object after secret redaction. That still allowed non-secret but private or sensitive raw content from bodies, diffs, comments, patches, and metadata to appear in logs or artifacts.

#### Validation

A canary test confirmed raw body/comment/patch/metadata strings survived before the fix. The formatter now emits only audit metadata and changed-file summaries in JSON mode. `src/format.test.ts` asserts that body, diff, comments, metadata, and patch fields are omitted while useful file metadata remains. `npm run verify` passed.

#### Dataflow

Raw analyzed work item -> `formatAssessment(..., "json")` -> JSON stdout/artifact. The fix changes `redactWorkItem` from redacted full serialization to explicit metadata minimization.

#### Reachability

The path is reachable when a maintainer or CI job uses `--format json`. It is most relevant for private repositories, sensitive issues, or logs/artifacts shared more broadly than intended.

#### Severity

Low. Secrets are still redacted and JSON output is operator-controlled, but minimizing raw analyzed content is a safer default. Evidence that JSON output was automatically uploaded to public artifacts would raise severity.

#### Remediation

Keep JSON output minimized by default. If raw debug output is needed later, make it an explicit unsafe/debug mode with clear warnings.

### [4] Reusable Action auto-authorized live analysis in GitHub Actions

| Field | Value |
| --- | --- |
| Severity | low |
| Confidence | medium-high |
| Confidence rationale | Source review showed the action wrapper previously added `--authorized` for any GitHub Actions run; the current code requires explicit input or environment authorization. |
| Category | Authorization / policy boundary weakness |
| CWE | CWE-284: Improper Access Control |
| Affected lines | `src/action.ts:10-15`, `action.yml:20-22` |

#### Summary

The reusable Action wrapper previously treated `GITHUB_ACTIONS=true` as enough to add `--authorized`, while `action.yml` exposed `repo` and `number` inputs. That weakened the CLI's explicit authorization UX for downstream action consumers.

#### Validation

Current `action.yml` has an `authorized` input defaulting to `false`, and `src/action.ts` adds `--authorized` only when `INPUT_AUTHORIZED=true` or `MAINTAINEROPS_AUTHORIZED=true`. `npm run verify` passed after the change.

#### Dataflow

Downstream workflow input `repo`/`number` -> `src/action.ts` argv construction -> `--authorized` -> `fetchIssueWorkItem`/`fetchPullRequestWorkItem` with `GITHUB_TOKEN`. The fix restores explicit authorization as the root control.

#### Reachability

This is mainly a reusable-action consumer risk. The repository's own active workflow calls the CLI directly against `$GITHUB_REPOSITORY`, uses read-only permissions, and runs PR/issue jobs offline.

#### Severity

Low. It is a policy-boundary and UX issue rather than a direct exploit in the current repo workflow. A downstream workflow using a broad PAT and arbitrary repo inputs would raise severity.

#### Remediation

Keep explicit `authorized: true` required for reusable Action live analysis and document that it must only be set for owned, maintained, or authorized repositories.

## Reviewed Surfaces

| Surface | Risk Area | Outcome | Notes |
| --- | --- | --- | --- |
| CLI authorization | Live GitHub authorization | No issue found | `src/cli.ts:92-95` rejects live repo analysis without explicit authorization. |
| GitHub API client | SSRF / token misuse | No issue found | Fixed GitHub API origin and token only in Authorization header. |
| OpenAI prompt path | Secret exfiltration | Reported fixed | MOAI-006 fixed unquoted colon-form redaction; prompt is truncated and redacted. |
| Model output formatter | Workflow command injection | No issue found | Line-start `::` is escaped for model-controlled fields. |
| JSON output formatter | Sensitive content exposure | Reported fixed | MOAI-007 minimized JSON work-item output. |
| GitHub Actions PR workflow | CI credential exposure | Reported fixed | MOAI-005 added `persist-credentials:false`. |
| GitHub Actions issue workflow | Secret exposure / mutation | No issue found | Active workflow uses read-only `GITHUB_TOKEN`, no `OPENAI_API_KEY`, and offline CLI mode. |
| Reusable Action wrapper | Authorization UX | Reported fixed | MOAI-008 added explicit `authorized` input and removed automatic Actions authorization. |
| Fixture loader | File/path injection | Not applicable | Fixture path is explicit local operator input. |
| Offline analyzer | Unsafe execution | No issue found | String heuristics only; no eval, shell, or network. |
| Eval harness | Unsafe script/path | No issue found | Fixed local golden file and offline analyzer only. |
| Frontend dashboard | XSS | No issue found | Static/mock React JSX; no `dangerouslySetInnerHTML`, `innerHTML`, or eval sink. |
| Demo GIF generator | File write/path injection | No issue found | Fixed repo-local input/output paths; no user path or shell. |
| Dependencies/package | Known vulnerable dependencies | No issue found | `npm audit --audit-level=moderate` found 0 vulnerabilities. |
| Generated build/test artifacts | Runtime source review | Not applicable | Canonical source reviewed instead. |
| Public docs | Unsafe guidance | No issue found | Docs emphasize authorized repos, human review, and no automatic merge/close/release. |

## Open Questions And Follow Up

- Re-run this scan after publishing the next npm version so the package artifact contains the redaction, JSON minimization, action authorization, and checkout credential fixes.
- Add a regression policy check that fails if a `pull_request` workflow uses `actions/checkout` without `persist-credentials:false` before running PR-controlled npm scripts.
- If the dashboard later renders live GitHub/model data, run a focused XSS/Markdown rendering scan before shipping.
