# Security Review: rtonf/maintainerops-ai at a050554737e2

## Scope

Repository-wide full scan of all 42 deterministic runtime/source-like worklist rows at the published v0.1.7 source revision.

- Scan mode: repository
- Target kind: git_revision
- Target ID: a050554737e2
- Revision: a050554737e2
- Inventory strategy: repository
- Included paths: .
- Excluded paths: node_modules/\*\*, .git/\*\*
- Runtime or test status: npm run verify passed; 26 unit tests, 1 UI smoke, 7 evals, package validation, and zero npm audit vulnerabilities after fixes
- Artifacts reviewed: TypeScript CLI and GitHub Action source, active GitHub workflow and action metadata, generated Action and Web bundles, tests, build scripts, package metadata, and UI source
- Scan context: The reusable repository threat model was copied unchanged into this scan. Two reportable findings were validated against the original revision and fixed in the working tree.

Limitations and exclusions:
- No live model-backed adversarial run because OPENAI_API_KEY was not configured.
- Exact maximum aggregate patch bytes returned by GitHub was not independently established.
- Final report describes the scanned revision; remediation evidence is recorded separately in artifacts/fix_report.md.
- Excluded node_modules/\*\*: Third-party installed dependencies; dependency state covered by npm audit.
- Excluded .git/\*\*: Version-control metadata, not runtime source.

### Scan Summary

| Field | Value |
| --- | --- |
| Reportable findings | 2 |
| Severity mix | medium: 1, low: 1 |
| Confidence mix | high: 1, medium: 1 |
| Coverage | complete |
| Validation mode | full-file subagent review plus targeted deterministic PoCs and static source/control/sink validation |

Canonical artifacts: `scan-manifest.json`, `findings.json`, and `coverage.json`. This report is a deterministic projection of those files.

## Threat Model

MaintainerOps AI processes untrusted pull-request, issue, patch, fixture, and model content across GitHub token, local filesystem, CI log, and OpenAI API trust boundaries while requiring human review for all recommendations.

### Assets

- GitHub workflow token and repository metadata
- Maintainer-visible issue and pull-request content
- Secrets embedded in reviewed content
- Integrity and availability of review packets
- Published npm and GitHub Action runtime

### Trust Boundaries

- Contributor content to maintainer-controlled CLI/Action
- GitHub API and token to local process
- Work-item content to OpenAI API
- Model output to maintainer-facing stdout/CI logs
- Source tree to published generated bundle

### Attacker Capabilities

- Create or edit public issues and pull requests
- Control PR titles, bodies, patches, filenames, and comments
- Supply a local fixture when already operating the CLI
- Influence model input but not directly execute repository mutations

### Security Objectives

- Never expose secrets through model prompts or logs
- Keep untrusted content from obtaining meaningful token privileges
- Bound untrusted work-item resource consumption
- Validate model output and preserve human control
- Keep published bundles traceable to reviewed source

### Assumptions

- Live repository analysis is explicitly authorized
- The project does not auto-merge, auto-close, or publish releases
- The public workflow token is read-only
- OpenAI API use requires an operator-provided key

## Findings

| Finding | Severity | Confidence |
| --- | --- | --- |
| [Truncation before redaction can disclose a complete structured secret](#finding-1) | medium | high |
| [Unbounded duplicate patch aggregation can exhaust process memory](#finding-2) | low | medium |

### Confidence Scale

| Label | Meaning |
| --- | --- |
| high | Direct evidence supports the finding with no material unresolved blocker. |
| medium | Evidence supports a plausible issue, but material runtime or reachability proof remains. |
| low | Evidence is incomplete and the item is retained only for explicit follow-up. |

<a id="finding-1"></a>

### [1] Truncation before redaction can disclose a complete structured secret

| Field | Value |
| --- | --- |
| Severity | medium |
| Confidence | high |
| Confidence rationale | A deterministic PoC against the exact truncate/redact functions retained the complete secret and removed its key context. |
| Category | Sensitive data exposure |
| CWE | CWE-200: Exposure of Sensitive Information to an Unauthorized Actor |
| Affected lines | src/prompt.ts:5-23, src/redaction.ts:28-35, src/openaiAssessment.ts:8-19 |

#### Summary

The model prompt truncates serialized work-item data before applying context-dependent secret redaction. A truncation boundary can remove a key such as password= while retaining the complete value, causing the value to be sent to the OpenAI API.

#### Root Cause

The security invariant requires redaction to inspect complete key/value context before any lossy transformation. The caller applies the operations in the opposite order.

**Truncate before redact** — `src/prompt.ts:5-23`

Context is discarded before key/value redaction runs.

```typescript
const payload = redactSecrets(truncateForModel(JSON.stringify({ task, instructions, item }, null, 2)));
```

**Context-breaking tail slice** — `src/redaction.ts:33-35`

The tail can start between a credential key and its value.

```typescript
const tail = input.slice(input.length - Math.floor(maxChars * 0.25));
```

#### Validation

A deterministic PoC against the exact truncate/redact functions retained the complete secret and removed its key context. Validation details were not recorded separately.

Validation method: deterministic boundary PoC

**Truncate before redact** — `src/prompt.ts:5-23`

Context is discarded before key/value redaction runs.

```typescript
const payload = redactSecrets(truncateForModel(JSON.stringify({ task, instructions, item }, null, 2)));
```

**Context-breaking tail slice** — `src/redaction.ts:33-35`

The tail can start between a credential key and its value.

```typescript
const tail = input.slice(input.length - Math.floor(maxChars * 0.25));
```

#### Dataflow

The canonical finding records the affected path at src/prompt.ts:5-23, src/redaction.ts:28-35, src/openaiAssessment.ts:8-19, but no expanded source-to-sink narrative was recorded.

**Truncate before redact** — `src/prompt.ts:5-23`

Context is discarded before key/value redaction runs.

```typescript
const payload = redactSecrets(truncateForModel(JSON.stringify({ task, instructions, item }, null, 2)));
```

**Context-breaking tail slice** — `src/redaction.ts:33-35`

The tail can start between a credential key and its value.

```typescript
const tail = input.slice(input.length - Math.floor(maxChars * 0.25));
```

#### Reachability

Reachability was not recorded beyond the canonical finding summary and affected locations.

#### Severity

**Medium** — A reproduced complete secret value crosses into an external model payload. Precise placement and authorized analysis reduce likelihood, while an active credential would have high impact.

Raise if ordinary private-repository inputs frequently hit the boundary or an active credential is observed; lower if model-bound inputs are independently secret-scanned after truncation.

#### Remediation

Apply redactSecrets to the complete serialized payload before truncateForModel, then preserve a boundary regression test.

Tests:
- src/prompt.test.ts boundary credential test
- post-fix PoC containsFullSecret=false

Preventive controls:
- Keep lossy transforms after secret scanning
- Retain model-boundary canary tests

<a id="finding-2"></a>

### [2] Unbounded duplicate patch aggregation can exhaust process memory

| Field | Value |
| --- | --- |
| Severity | low |
| Confidence | medium |
| Confidence rationale | The package-interface crash is deterministic; exact GitHub-hosted maximum aggregate patch reachability was not independently established. |
| Category | Uncontrolled resource consumption |
| CWE | CWE-400: Uncontrolled Resource Consumption |
| Affected lines | src/github.ts:53-55, src/offlineAnalyzer.ts:55-64 |

#### Summary

Pull-request patches are stored in both item.diff and files\[\].patch, then joined and lowercased without an aggregate byte limit. A large work item can exhaust the CLI or Action process heap before a review packet is produced.

#### Root Cause

The analyzer lacks an aggregate text budget and consumes two representations of the same patch set.

**Duplicate aggregate** — `src/github.ts:53-55`

Each patch is retained in the files array and duplicated into diff.

```typescript
files: files.map(toChangedFile), diff: files.map((file) => `diff -- ${file.filename}\n${file.patch}`).join("\n\n")
```

**Unbounded join and lowercase** — `src/offlineAnalyzer.ts:55-64`

The analyzer allocates combined and lowercase copies without a byte cap.

```typescript
[item.title, item.body, item.diff, ...item.files.map(file => `${file.path}\n${file.patch}`)].join("\n").toLowerCase()
```

#### Validation

The package-interface crash is deterministic; exact GitHub-hosted maximum aggregate patch reachability was not independently established. Validation details were not recorded separately.

Validation method: real exported-function crash PoC

**Duplicate aggregate** — `src/github.ts:53-55`

Each patch is retained in the files array and duplicated into diff.

```typescript
files: files.map(toChangedFile), diff: files.map((file) => `diff -- ${file.filename}\n${file.patch}`).join("\n\n")
```

**Unbounded join and lowercase** — `src/offlineAnalyzer.ts:55-64`

The analyzer allocates combined and lowercase copies without a byte cap.

```typescript
[item.title, item.body, item.diff, ...item.files.map(file => `${file.path}\n${file.patch}`)].join("\n").toLowerCase()
```

#### Dataflow

The canonical finding records the affected path at src/github.ts:53-55, src/offlineAnalyzer.ts:55-64, but no expanded source-to-sink narrative was recorded.

**Duplicate aggregate** — `src/github.ts:53-55`

Each patch is retained in the files array and duplicated into diff.

```typescript
files: files.map(toChangedFile), diff: files.map((file) => `diff -- ${file.filename}\n${file.patch}`).join("\n\n")
```

**Unbounded join and lowercase** — `src/offlineAnalyzer.ts:55-64`

The analyzer allocates combined and lowercase copies without a byte cap.

```typescript
[item.title, item.body, item.diff, ...item.files.map(file => `${file.path}\n${file.patch}`)].join("\n").toLowerCase()
```

#### Reachability

Reachability was not recorded beyond the canonical finding summary and affected locations.

#### Severity

**Low** — The real package function crashed under a bounded heap, but impact is limited to one analysis job and exact GitHub aggregate patch limits reduce confidence in remote reliability.

Raise if a normal GitHub PR reliably triggers the crash at default Action memory; lower if upstream data is always capped below the local bound.

#### Remediation

Do not generate a duplicate aggregate diff when per-file patches exist, and cap searchable text before joining and lowercasing.

Tests:
- src/offlineAnalyzer.test.ts large duplicated patch test
- post-fix 64 MiB PoC exits 0

Preventive controls:
- Centralize work-item byte budgets
- Avoid retaining equivalent aggregate and per-file text

## Reviewed Surfaces

| Surface | Risk Area | Outcome | Notes |
| --- | --- | --- | --- |
| CLI and Action entrypoints | Credential and command boundary | Rejected | No command sink; token candidate lacked protected impact. Workflow hardening applied. Evidence: artifacts/02_discovery/shards/01-entry-action.md |
| GitHub API acquisition | SSRF, auth, pagination, error disclosure | No issue found | Fixed origin, bounded pagination, response bodies excluded from errors. Evidence: artifacts/02_discovery/shards/02-acquisition.md |
| Model prompt and output boundary | Secret exposure and prompt manipulation | Reported | Secret redaction-order finding reported; semantic prompt steering rejected due human-only sink. Evidence: artifacts/02_discovery/shards/03-ai-output.md, artifacts/05_findings/03-ai-output-001/validation_report.md |
| Offline analyzer and eval | Routing integrity and resource exhaustion | Reported | Resource exhaustion reported; routing correctness issue fixed but ignored by final security policy. Evidence: artifacts/02_discovery/shards/04-offline-eval.md, artifacts/05_findings/04-offline-eval-002/validation_report.md |
| Output and CI log formatting | Data exposure and workflow-command injection | No issue found | Raw fields minimized and workflow command syntax neutralized. Evidence: artifacts/02_discovery/shards/05-boundary-tests.md |
| Build, package, and generated Action | Supply chain and filesystem effects | No issue found | Fixed paths, no lifecycle hooks, byte-identical bundle rebuild, npm audit clean. Evidence: artifacts/02_discovery/shards/06-build-config.md, artifacts/02_discovery/shards/08-generated.md |
| Static Web dashboard | DOM XSS and unsafe URL handling | Not applicable | Static mock data only, no unsafe HTML or network sink. Evidence: artifacts/02_discovery/shards/07-web.md |
| Auxiliary configuration and demo tooling | File and process effects | No issue found | Fixed local paths and bounded static inputs. Evidence: artifacts/02_discovery/shards/09-auxiliary.md |
