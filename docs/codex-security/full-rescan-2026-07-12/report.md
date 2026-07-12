# Security Review: maintainerops-ai-security-scan

## Scope

Repository-wide security review of the Git revision after PR #96 and before the next release.

- Scan mode: repository
- Target kind: git_revision
- Target ID: target_sha256_55e142a16b8ba3c841e3997b600ef9ec9ae51403f6c0963c2c4abdc5fa05baed
- Revision: 40ab2aaf0875d0b9074642ba4f51223f1bd4200a
- Inventory strategy: repository
- Included paths: .
- Excluded paths: none
- Runtime or test status: Static source review with bounded local validation; no live publication or hosted exploit run.
- Artifacts reviewed: threat model, security guidance, discovery worklist, coverage ledger, validation artifacts, attack-path reports
- Scan context: Attacker-controlled issue and pull-request text, model-boundary data, Action stdout, and OIDC publication workflow were treated as trust boundaries.

Limitations and exclusions:
- No live GitHub Actions or npm publication was performed during validation.
- No real credential was used.

### Scan Summary

| Field | Value |
| --- | --- |
| Reportable findings | 3 |
| Severity mix | high: 1, medium: 2 |
| Confidence mix | high: 3 |
| Coverage | complete |
| Validation mode | source-backed review, deterministic local harnesses, and official runner-source confirmation |

Canonical artifacts: `scan-manifest.json`, `findings.json`, and `coverage.json`. This report is a deterministic projection of those files.

## Threat Model

Public repository contributors can influence issue and pull-request text that is ingested, sent to a model provider, rendered into Action logs, or used by release automation.

### Assets

- model-provider confidentiality
- GitHub Actions workflow state
- npm package integrity
- release credentials

### Trust Boundaries

- GitHub content to local analyzer
- local analyzer to model provider
- Action stdout to hosted runner parser
- release input to OIDC publication

### Attacker Capabilities

- submit or edit content in an analyzed repository
- supply a manual release workflow input when authorized
- craft strings that reach logs and prompts

### Security Objectives

- redact secrets before model calls
- neutralize workflow commands before stdout
- publish only the intended tagged source

### Assumptions

- GitHub and npm identities are otherwise correctly configured
- validation did not execute live workflows

## Findings

| Finding | Severity | Confidence | Detailed write-up |
| --- | --- | --- | --- |
| [Manual npm publication accepts a mutable branch ref for Trusted Publishing](#finding-1) | high | high | [Open report](findings/mutable-npm-publish-ref/mutable-npm-publish-ref.md) |
| [Case-sensitive Bearer redaction leaks valid bearer credentials before the model call](#finding-2) | medium | high | [Open report](findings/bearer-redaction-bypass/bearer-redaction-bypass.md) |
| [Legacy GitHub Actions workflow command marker reaches Action stdout](#finding-3) | medium | high | [Open report](findings/legacy-runner-command-marker/legacy-runner-command-marker.md) |

### Confidence Scale

| Label | Meaning |
| --- | --- |
| high | Direct evidence supports the finding with no material unresolved blocker. |
| medium | Evidence supports a plausible issue, but material runtime or reachability proof remains. |
| low | Evidence is incomplete and the item is retained only for explicit follow-up. |

<a id="finding-1"></a>

### [1] Manual npm publication accepts a mutable branch ref for Trusted Publishing

| Field | Value |
| --- | --- |
| Severity | high |
| Confidence | high |
| Confidence rationale | The source selection and OIDC publication path are directly visible, and a bounded disposable Git ref probe reproduced the branch/tag ambiguity without live publication. |
| Category | Supply-chain release source confusion |
| CWE | CWE-345 |
| Affected lines | .github/workflows/npm-publish.yml:24-28, .github/workflows/npm-publish.yml:38-51, scripts/verify-release-tag.mjs:4-14 |

#### Summary

See the [detailed technical write-up](findings/mutable-npm-publish-ref/mutable-npm-publish-ref.md).

#### Validation

See the [detailed technical write-up](findings/mutable-npm-publish-ref/mutable-npm-publish-ref.md).

#### Dataflow

See the [detailed technical write-up](findings/mutable-npm-publish-ref/mutable-npm-publish-ref.md).

#### Reachability

See the [detailed technical write-up](findings/mutable-npm-publish-ref/mutable-npm-publish-ref.md).

#### Severity

See the [detailed technical write-up](findings/mutable-npm-publish-ref/mutable-npm-publish-ref.md).

#### Remediation

See the [detailed technical write-up](findings/mutable-npm-publish-ref/mutable-npm-publish-ref.md).

<a id="finding-2"></a>

### [2] Case-sensitive Bearer redaction leaks valid bearer credentials before the model call

| Field | Value |
| --- | --- |
| Severity | medium |
| Confidence | high |
| Confidence rationale | Direct source tracing and a pinned-source local harness reproduced the bypass with a synthetic token; no live request or real secret was used. |
| Category | Sensitive data exposure |
| CWE | CWE-178, CWE-200 |
| Affected lines | src/redaction.ts:21, src/prompt.ts:6, src/openaiAssessment.ts:40-50 |

#### Summary

See the [detailed technical write-up](findings/bearer-redaction-bypass/bearer-redaction-bypass.md).

#### Validation

See the [detailed technical write-up](findings/bearer-redaction-bypass/bearer-redaction-bypass.md).

#### Dataflow

See the [detailed technical write-up](findings/bearer-redaction-bypass/bearer-redaction-bypass.md).

#### Reachability

See the [detailed technical write-up](findings/bearer-redaction-bypass/bearer-redaction-bypass.md).

#### Severity

See the [detailed technical write-up](findings/bearer-redaction-bypass/bearer-redaction-bypass.md).

#### Remediation

See the [detailed technical write-up](findings/bearer-redaction-bypass/bearer-redaction-bypass.md).

<a id="finding-3"></a>

### [3] Legacy GitHub Actions workflow command marker reaches Action stdout

| Field | Value |
| --- | --- |
| Severity | medium |
| Confidence | high |
| Confidence rationale | The sanitizer reproduction succeeded locally and the official runner parser source confirms the legacy prefix is recognized. |
| Category | Workflow output injection |
| CWE | CWE-116, CWE-74 |
| Affected lines | src/format.ts:107, src/action.ts:9, action.yml:39 |

#### Summary

See the [detailed technical write-up](findings/legacy-runner-command-marker/legacy-runner-command-marker.md).

#### Validation

See the [detailed technical write-up](findings/legacy-runner-command-marker/legacy-runner-command-marker.md).

#### Dataflow

See the [detailed technical write-up](findings/legacy-runner-command-marker/legacy-runner-command-marker.md).

#### Reachability

See the [detailed technical write-up](findings/legacy-runner-command-marker/legacy-runner-command-marker.md).

#### Severity

See the [detailed technical write-up](findings/legacy-runner-command-marker/legacy-runner-command-marker.md).

#### Remediation

See the [detailed technical write-up](findings/legacy-runner-command-marker/legacy-runner-command-marker.md).

## Structural Hardening

The scan also produced derived, unsealed design guidance based on the complete finding collection. These proposals describe options and tradeoffs; they do not indicate that any finding has been remediated.

[Open the structural hardening portfolio](hardening/hardening.md)

## Reviewed Surfaces

| Surface | Risk Area | Outcome | Notes |
| --- | --- | --- | --- |
| Repository instructions and security policy | governance | No issue found | Threat model and SECURITY guidance resolved. Evidence: artifacts/03_coverage/repository_coverage_ledger.md |
| GitHub Actions workflows | workflow supply chain | Reported | MOAI-003 and MOAI-007; MOAI-004 retained as hardening follow-up. Evidence: artifacts/03_coverage/repository_coverage_ledger.md |
| Action runtime and stdout boundary | workflow output | Reported | MOAI-003. Evidence: artifacts/03_coverage/repository_coverage_ledger.md |
| Secret redaction and prompt construction | sensitive data | Reported | MOAI-001. Evidence: artifacts/03_coverage/repository_coverage_ledger.md |
| OpenAI model request path | external API | No issue found | Model input sink traced; no additional reportable finding. Evidence: artifacts/03_coverage/repository_coverage_ledger.md |
| GitHub API ingestion | remote input | No issue found | Issue, pull-request, files, pagination, and response handling reviewed. Evidence: artifacts/03_coverage/repository_coverage_ledger.md |
| Offline analyzer and labels | decision quality | Rejected | MOAI-002, MOAI-005, and MOAI-006 are advisory quality defects without a direct privileged sink. Evidence: artifacts/03_coverage/repository_coverage_ledger.md |
| Release verification scripts | release integrity | Reported | Contributes to MOAI-007. Evidence: artifacts/03_coverage/repository_coverage_ledger.md |
| Package manifest and npm publication | package supply chain | Reported | Trusted Publishing path covered by MOAI-007. Evidence: artifacts/03_coverage/repository_coverage_ledger.md |
| Dependency and lock files | dependency integrity | No issue found | No additional reportable finding. Evidence: artifacts/03_coverage/repository_coverage_ledger.md |
| Tests and evaluation fixtures | verification | Rejected | Analyzer quality gaps are documented as follow-up work. Evidence: artifacts/03_coverage/repository_coverage_ledger.md |
| Web UI and model selector | user interface | No issue found | No additional reportable finding. Evidence: artifacts/03_coverage/repository_coverage_ledger.md |
| Documentation and examples | configuration | No issue found | No additional reportable finding. Evidence: artifacts/03_coverage/repository_coverage_ledger.md |
| Build and bundle scripts | build integrity | No issue found | Action bundle and package build paths reviewed. Evidence: artifacts/03_coverage/repository_coverage_ledger.md |
| Configuration and environment handling | secret handling | No issue found | No additional reportable finding. Evidence: artifacts/03_coverage/repository_coverage_ledger.md |
| Filesystem and fixture loading | local input | No issue found | No additional reportable finding. Evidence: artifacts/03_coverage/repository_coverage_ledger.md |
| Error handling and logging | logging boundary | Reported | Output boundary is covered by MOAI-003. Evidence: artifacts/03_coverage/repository_coverage_ledger.md |
| Git history and release metadata | provenance | No issue found | Revision identity recorded in the scan manifest. Evidence: artifacts/03_coverage/repository_coverage_ledger.md |
| Supply-chain action pins | dependency supply chain | Rejected | MOAI-004 is a hardening note; current action execution and full-length pin reduce exploitability. Evidence: artifacts/03_coverage/repository_coverage_ledger.md |
| Repository-wide integration boundaries | integration | No issue found | No open or deferred coverage row remains. Evidence: artifacts/03_coverage/repository_coverage_ledger.md |

## Open Questions And Follow Up

- Should manual npm publication be removed in favor of release-only publication with protected tags and environment approval?
  - Follow-up prompt: Review .github/workflows/npm-publish.yml and repository tag/environment rules before the next release.
- Should MOAI-002, MOAI-005, and MOAI-006 become explicit analyzer-quality eval cases?
  - Follow-up prompt: Add offline fixtures for feedback phrase suppression, incomplete diffs, and empty tests, then compare expected labels.
- Should residual OpenSSF Scorecard alerts tracked in issue #97 be resolved or documented as accepted residuals?
  - Follow-up prompt: Rerun Scorecard after the security fixes and update issue #97 with alert-by-alert evidence.
