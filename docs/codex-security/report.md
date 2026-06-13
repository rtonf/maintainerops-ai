# Security Review: MaintainerOps AI

## Scope

- Target: <repo-root>
- Scan mode: Codex Security repository-wide scan.
- Scan id: worktree_20260608T231306Z.
- In-scope code: CLI, GitHub Action wrapper/workflow, OpenAI prompt/response path, GitHub API ingestion, formatter/report output, local React/Vite dashboard, tests, build metadata, and generated rows closed through source review.
- Threat model: generated during Phase 1 and saved under rtifacts/01_context/threat_model.md; this is scan-generated context, not an external input.
- Validation: discovery, validation, attack-path analysis, candidate-ledger audit, report format validation, and HTML rendering were run from local scan artifacts.
- Exclusions: generated dist-web files were closed as not applicable after reviewing canonical source; no live OpenAI request, live GitHub Actions runner execution, or real credential disclosure was performed.

### Scan Summary

| Field | Value |
|---|---|
| Reportable findings | 4 |
| Severity mix | high: 1, medium: 2, low: 1 |
| Confidence mix | high: 2, medium-high: 2 |
| Coverage | 25 / 25 worklist rows closed; 12 high-impact family rows closed |
| Candidate ledger status | MOAI-001 through MOAI-004 each have discovery, validation, and attack-path receipts; suppressed CAND rows also have closure receipts |
| Validation mode | Static source/config tracing plus bounded local runtime reproductions with synthetic canaries and artifact-local OpenAI stubs |
| Markdown report | C:\tmp\codex-security-scans\project　1a\worktree_20260608T231306Z\report.md |
| HTML report | C:\tmp\codex-security-scans\project　1a\worktree_20260608T231306Z\report.html |
| Reviewed surfaces | C:\tmp\codex-security-scans\project　1a\worktree_20260608T231306Z\artifacts\03_coverage\reviewed_surfaces.md |

## Threat Model

### Threat Model: MaintainerOps AI

## Overview

MaintainerOps AI is a Node.js/TypeScript tool for public open-source maintainers. It has three practical surfaces:

- A CLI (`src/cli.ts`) that analyzes local fixtures or authorized GitHub issues and pull requests.
- A GitHub Action wrapper (`src/action.ts`, `action.yml`, `.github/workflows/maintainerops.yml`) that runs in repository CI with read-only GitHub permissions.
- A local React/Vite dashboard prototype (`web/main.tsx`, `web/styles.css`) that presents AI-assisted maintainer review state and decision controls.

The repository's most security-relevant code paths are those that ingest untrusted issue, pull request, diff, fixture, and GitHub API content, redact sensitive values, send prompts to the OpenAI API, and render or serialize model recommendations. The tool is intentionally human-in-the-loop and documents that it must not merge pull requests, close issues, publish releases, disclose security issues, or scan repositories without authorization.

## Threat Model, Trust Boundaries, and Assumptions

Primary assets and privileges:

- `OPENAI_API_KEY`, `GITHUB_TOKEN`, and GitHub Actions `GITHUB_TOKEN` values available via environment variables.
- Maintainer-visible issue and pull request contents, including diffs, comments, labels, and CI/security summaries.
- Model outputs that may influence maintainer decisions, labels, release notes, or comments.
- Auditability and integrity of generated review packets.
- The authorization boundary around live GitHub repository analysis.

Trust boundaries:

- Local user/developer boundary: CLI arguments, fixture paths, and environment variables are controlled by the operator. The tool assumes the operator can read local files they explicitly pass as fixtures.
- GitHub boundary: issue bodies, PR descriptions, labels, file paths, patches, and comments are attacker-controlled or contributor-controlled content returned from the GitHub API. They must be treated as data, not instructions.
- Model boundary: OpenAI model output is untrusted advice. It must remain structured, validated, and human-reviewed before any GitHub side effect.
- CI boundary: GitHub Actions runs with repository-provided environment and tokens. The workflow is configured for read-only repository scopes; any future write permissions would materially increase severity.
- Browser/UI boundary: the React dashboard currently renders static/mock data from source code. If future versions render live GitHub/model content, XSS and unsafe HTML insertion become primary concerns.

Attacker-controlled inputs:

- Issue and pull request titles, bodies, labels, comments, file names, and patch text fetched from GitHub.
- Local fixture JSON files when a user analyzes untrusted files.
- Model responses returned by the OpenAI API.
- Query strings or UI text if future web routes or live data import are added.

Operator-controlled inputs:

- CLI flags, repository names, issue/PR numbers, `--authorized`, model selection, and API tokens.
- Environment variables such as `OPENAI_API_KEY`, `OPENAI_MODEL`, `GITHUB_TOKEN`, and `MAINTAINEROPS_AUTHORIZED`.

Developer-controlled inputs:

- Prompt templates, JSON Schema, offline heuristics, docs, workflows, and the static UI source.

Security assumptions:

- Live GitHub analysis is only allowed for repositories the operator owns, maintains, or has permission to review. `src/cli.ts` enforces explicit `--authorized` or `MAINTAINEROPS_AUTHORIZED=true` for live GitHub access.
- The GitHub Action runs inside the target repository and uses read-only permissions by default.
- No current code path posts comments, changes labels, closes issues, merges pull requests, publishes releases, or persists model decisions to external services.
- The dashboard is a local prototype and does not currently expose a backend service or authentication surface.

## Attack Surface, Mitigations, and Attacker Stories

Attack surfaces:

- `src/github.ts`: builds GitHub API paths from operator-provided `repo` and numeric issue/PR IDs, attaches `GITHUB_TOKEN` when available, and throws error responses that may include GitHub response bodies.
- `src/prompt.ts` and `src/redaction.ts`: serialize maintainer work items, redact common secret patterns, truncate large payloads, and send content to the OpenAI API.
- `src/openaiAssessment.ts`: calls the OpenAI Responses API and parses structured JSON output.
- `src/schema.ts`: validates only coarse response shape after model output is parsed.
- `src/fixture.ts`: reads local JSON fixtures chosen by the operator.
- `src/cli.ts` and `src/action.ts`: parse authorization and input flags and route live GitHub or fixture analysis.
- `web/main.tsx`: renders dashboard state and simulates maintainer controls. Future live data rendering would expand this surface.
- GitHub workflow and action metadata: permissions, environment variables, and build commands affect CI exposure.

Existing mitigations:

- Live GitHub analysis requires explicit authorization in `src/cli.ts`.
- GitHub Action permissions are read-only in `.github/workflows/maintainerops.yml`.
- The tool is dry-run/human-in-the-loop by design and has no external write operation today.
- `redactSecrets` masks common token, JWT, private-key, `.env`, and bearer-token patterns before model calls.
- `truncateForModel` limits prompt size.
- Structured output schema constrains the intended model response shape.
- Tests cover argument parsing and redaction behavior.
- Documentation warns against unauthorized scanning and automatic external actions.

Realistic attacker stories:

- A malicious contributor embeds prompt-injection text in a PR description or diff attempting to override the system prompt or hide a finding. Impact is mitigated by human review and structured parsing, but high-quality evidence separation remains important.
- A PR or issue includes secrets or high-entropy tokens. Redaction may catch common forms, but incomplete redaction could leak sensitive content to a model provider if maintainers analyze untrusted private data.
- A future GitHub write feature could post model-generated content without sufficient confirmation, causing spam, disclosure, or inaccurate maintainer action.
- A future live dashboard could render untrusted GitHub/model markdown or HTML unsafely and introduce XSS.
- A maintainer could set `MAINTAINEROPS_AUTHORIZED=true` globally and accidentally analyze a repo they are not allowed to review. Documentation and explicit gating reduce but do not eliminate operator error.

Out-of-scope or lower realism attacker stories:

- Remote code execution through the current dashboard is low realism because it is a static local Vite/React app with no backend and no dynamic HTML insertion.
- Server-side request forgery is low realism in current code because GitHub API calls use a fixed `https://api.github.com` origin and OpenAI calls use the SDK.
- Authentication bypass against the app is out of scope in the current prototype because there is no deployed authenticated service.

## Severity Calibration (Critical, High, Medium, Low)

Critical:

- A future feature that automatically merges pull requests, closes issues, posts security disclosures, or publishes releases based on model output without explicit maintainer approval.
- Exfiltration of `GITHUB_TOKEN`, `OPENAI_API_KEY`, or repository secrets to attacker-controlled services.
- Unsafe execution of attacker-controlled issue/PR content as shell commands or JavaScript in CI.

High:

- Incomplete secret redaction causing private credentials or security reports to be sent to the model provider from private or sensitive repositories.
- Prompt-injection or model-output handling that reliably suppresses high-risk findings and causes maintainers to take unsafe actions.
- Adding GitHub write scopes to the Action without confirmation and audit controls.
- Rendering untrusted markdown/HTML from GitHub or model responses in a deployed dashboard with script execution.

Medium:

- Authorization bypass in CLI argument parsing allowing live GitHub analysis without `--authorized`.
- Excessively verbose GitHub API errors exposing sensitive response content in logs.
- Weak schema validation allowing malformed model output to be consumed by downstream automation.
- Denial of service through very large fixtures or PR diffs beyond the current truncation expectations.

Low:

- Misclassification by offline heuristics that causes noisy labels but no external side effect.
- UI-only display bugs in the static dashboard prototype.
- Documentation ambiguity that could confuse maintainers but does not by itself cause a security boundary bypass.


## Findings

| # | Title | Severity | Confidence | Candidate |
|---|---|---|---|---|
| 1 | [Pull request workflow executes PR-controlled built code with OPENAI_API_KEY](#1-pull-request-workflow-executes-pr-controlled-built-code-with-openai-api-key) | high | high | MOAI-003 |
| 2 | [Structured secrets bypass redaction before OpenAI model submission](#2-structured-secrets-bypass-redaction-before-openai-model-submission) | medium | medium-high | MOAI-001 |
| 3 | [Model-controlled Markdown can emit GitHub Actions workflow commands](#3-model-controlled-markdown-can-emit-github-actions-workflow-commands) | medium | medium-high | MOAI-004 |
| 4 | [JSON report output discloses raw analyzed content to stdout and CI logs](#4-json-report-output-discloses-raw-analyzed-content-to-stdout-and-ci-logs) | low | high | MOAI-002 |

### Confidence Scale

| Label | Meaning |
|---|---|
| high | direct source, configuration, or runtime evidence supports the finding, with no material unresolved reachability or exploitability blocker. |
| medium | source evidence supports a plausible issue, but runtime behavior, deployment configuration, role reachability, type constraints, or exploit reliability still need proof. |
| low | weak or incomplete evidence; include only when the user explicitly wants follow-up candidates in the final report. |

### [1] Pull request workflow executes PR-controlled built code with OPENAI_API_KEY

| Field | Value |
|---|---|
| Severity | high |
| Confidence | high |
| Confidence rationale | Workflow configuration directly shows pull_request checkout, build, and later execution of built PR-controlled dist/cli.js with OPENAI_API_KEY; real-world reachability is constrained mainly by GitHub fork-secret withholding and repository settings. |
| Category | CI secret exposure through untrusted pull-request-controlled code execution |
| CWE | CWE-798 Use of Hard-coded Credentials / CWE-200 Exposure of Sensitive Information, applied here as CI secret exposure |
| Affected lines | .github/workflows/maintainerops.yml:4-5, .github/workflows/maintainerops.yml:18, .github/workflows/maintainerops.yml:22-29, package.json:10-12, 	sconfig.json:12-17 |

#### Summary

The workflow runs on pull requests, checks out the PR workspace, builds repository code, then executes 
ode dist/cli.js with OPENAI_API_KEY in the same step environment. A malicious same-repository PR author, compromised collaborator, or other PR actor in a context where secrets are exposed can modify the built CLI and read the key before benign authorization logic runs.

#### Validation

Validation used code/config tracing. .github/workflows/maintainerops.yml:4-5 defines the pull_request trigger, line 18 checks out repository contents, lines 22-23 run 
pm ci and 
pm run build, and lines 24-29 execute 
ode dist/cli.js with OPENAI_API_KEY. package.json:10-12 and 	sconfig.json:12-17 show TypeScript source compiles into dist. No live GitHub Actions run was needed to prove the source-to-sink configuration.

#### Dataflow

Pull request contents -> ctions/checkout@v4 workspace -> 
pm run build -> PR-controlled dist/cli.js -> 
ode dist/cli.js in Analyze pull request step -> process environment containing OPENAI_API_KEY.

#### Reachability

The relevant attacker is not every fork contributor, because GitHub normally withholds repository secrets from external fork PRs. The path remains reachable for same-repository PRs, compromised collaborator accounts, permissive organization settings, or any PR workflow context where repository secrets are available. This crosses from PR-controlled code into maintainer-owned CI secrets; read-only GitHub permissions limit secondary GitHub impact but do not protect the OpenAI key.

#### Severity

Severity is high. The impact is direct exposure of a primary API credential, and the likelihood is high in secret-exposed PR contexts because the workflow itself supplies the trigger, build, and secret-bearing execution path. Critical is not supported because the repository evidence does not show arbitrary unauthenticated fork access to secrets, persistence, repository write compromise, or mass exploitation. Evidence that repository settings strictly prevent all untrusted same-repository PRs from receiving secrets would lower likelihood; evidence that this workflow is reused across many repositories with secrets exposed would raise operational urgency.

#### Remediation

Run secret-bearing analysis only from trusted code. Check out a trusted base ref or pinned action for the OpenAI call, split untrusted PR metadata collection from the secret-bearing model request, require maintainer approval before injecting OPENAI_API_KEY, and run PR-controlled code only in no-secret/offline mode. Add a workflow regression test or policy check that fails if pull_request jobs both build PR code and expose repository secrets.

### [2] Structured secrets bypass redaction before OpenAI model submission

| Field | Value |
|---|---|
| Severity | medium |
| Confidence | medium-high |
| Confidence rationale | Static tracing and an artifact-local OpenAI stub prove structured secrets reach esponses.create; reportability depends on OpenAI-enabled use with sensitive or private analyzed content. |
| Category | Sensitive information exposure through incomplete secret redaction before third-party model submission |
| CWE | CWE-200 Exposure of Sensitive Information; CWE-522 Insufficiently Protected Credentials |
| Affected lines | src/redaction.ts:1-8, src/redaction.ts:11-13, src/prompt.ts:4-25, src/openaiAssessment.ts:6-19, src/analyze.ts:28-33, src/github.ts:24-55 |

#### Summary

edactSecrets catches several common token forms but misses JSON/colon key-value secrets and AWS-style credential values. uildAssessmentPrompt stringifies the full work item, applies this incomplete sanitizer, and nalyzeWithOpenAI sends the prompt to the OpenAI Responses API when OPENAI_API_KEY is set.

#### Validation

Validation compiled the original TypeScript into an artifact directory and used a local stub of the OpenAI SDK to capture the request passed to esponses.create without making a network call. The harness showed ws_access_key_id: AKIA... and JSON colon form pi_key values survived redaction, survived prompt construction, and appeared in the captured OpenAI request object. Equals-form pi_key=... was redacted, confirming the sanitizer was exercised.

#### Dataflow

GitHub issue/PR body, patch, or operator-selected fixture -> MaintainerWorkItem from src/github.ts or src/fixture.ts -> uildAssessmentPrompt in src/prompt.ts -> 	runcateForModel -> edactSecrets in src/redaction.ts -> client.responses.create user content in src/openaiAssessment.ts.

#### Reachability

Remote contributors can control issue and pull request content that maintainers or workflows analyze. The sink requires OpenAI-enabled mode and a secret-bearing input that is not already public or attacker-owned. Authorization gates protect live repository analysis scope, but they do not protect secrets after an authorized workflow decides to analyze content.

#### Severity

Severity is medium by the policy matrix: impact is high because private credentials or security-sensitive reports may cross to a third-party model provider, while likelihood is medium because OpenAI-enabled mode and meaningful secret-bearing input are required. The issue is not critical because the scan did not prove direct attacker-controlled exfiltration, account takeover, or code execution. Evidence that the tool is routinely used on private security reports would raise priority; evidence that all analyzed inputs are public and non-sensitive would lower impact.

#### Remediation

Extend redaction to structured JSON/YAML/colon forms, quoted object properties, AWS access key IDs, AWS secret access keys, and common cloud credential names. Add tests that assert uildAssessmentPrompt removes those forms before model submission. Consider a default-deny sensitive field allowlist for model prompts and a second redaction pass immediately before any external provider call.

### [3] Model-controlled Markdown can emit GitHub Actions workflow commands

| Field | Value |
|---|---|
| Severity | medium |
| Confidence | medium-high |
| Confidence rationale | Source and local formatter/CLI reproductions prove model-controlled strings can reach stdout at line start; exploit reliability through model influence and live runner behavior remains partly deployment-dependent. |
| Category | Improper output neutralization for GitHub Actions workflow-command channel |
| CWE | CWE-117 Improper Output Neutralization for Logs |
| Affected lines | src/openaiAssessment.ts:8-36, src/schema.ts:19-63, src/schema.ts:83-108, src/format.ts:21-43, src/format.ts:23, src/format.ts:43, src/cli.ts:22-28, src/action.ts:10-25, ction.yml:20-22 |

#### Summary

Model output is parsed into structured assessment fields, but string fields such as summary and commentDraft are not neutralized before Markdown output. The Markdown formatter places those fields on standalone lines and the CLI writes them directly to stdout, which GitHub Actions also treats as its workflow-command channel.

#### Validation

Validation traced esponse.output_text through ssertAssessment, ormatAssessment, and process.stdout.write. Local artifacts showed real formatter output containing line-start ::warning and ::add-mask commands from model-shaped assessment fields, and the validation cited GitHub Actions workflow-command documentation for stdout command parsing. No live GitHub-hosted runner or OpenAI API call was performed.

#### Dataflow

Contributor-controlled issue/PR content -> GitHub work item -> prompt -> model response JSON -> MaintainerAssessment.summary / commentDraft -> ormatAssessment Markdown lines -> CLI stdout -> GitHub Actions workflow-command parser.

#### Reachability

A remote issue or PR contributor can influence model output through content that the product intentionally feeds into the model. The final command string is model-mediated rather than deterministic attacker input, so reliability is not as strong as direct injection. The path is still realistic for GitHub Action use because Markdown is the default output and neither schema validation nor formatter output escapes line-start ::.

#### Severity

Severity is medium. The impact is CI log/control-channel integrity: misleading annotations, masking attacker-chosen strings, grouping, or parser interference that can impair maintainer auditability. The repository evidence does not prove code execution, token theft, repository mutation, release compromise, or account takeover, so high is not supported. A live runner proof showing command effects that hide security-relevant logs would increase confidence; forcing file/job-summary output instead of stdout would lower likelihood.

#### Remediation

Neutralize untrusted Markdown before writing to GitHub Actions stdout. Escape or prefix every untrusted line that starts with ::, wrap report output with a unique ::stop-commands::{token} / ::{token}:: pair, force safe JSON or file output for action runs, or write Markdown to $GITHUB_STEP_SUMMARY or an artifact instead of raw stdout. Add formatter tests for summary, commentDraft, list fields, labels, and evidence notes containing workflow-command syntax.

### [4] JSON report output discloses raw analyzed content to stdout and CI logs

| Field | Value |
|---|---|
| Severity | low |
| Confidence | high |
| Confidence rationale | CLI and Action reproductions prove JSON output serializes raw work-item canaries to stdout; default Markdown and unknown log ACLs constrain severity. |
| Category | Information disclosure through unsafe report serialization |
| CWE | CWE-200 Exposure of Sensitive Information |
| Affected lines | src/format.ts:8-9, src/cli.ts:22-28, src/action.ts:8-20, ction.yml:17-18, src/github.ts:24-55 |

#### Summary

When --format json or INPUT_FORMAT=json is selected, ormatAssessment serializes { item, assessment } directly. That includes the full raw MaintainerWorkItem, such as issue bodies, PR bodies, file patches, assembled diffs, and fixture fields, and unCli writes it to stdout.

#### Validation

Validation used synthetic canaries in a fixture and ran both CLI JSON output and Action-style JSON invocation. The JSON stdout captures contained all canaries from body, patch, diff, and comments. The Markdown capture for the same fixture did not include those canaries, narrowing the issue to explicit JSON mode. Static tracing confirmed src/action.ts forwards INPUT_FORMAT and src/format.ts:8-9 serializes the raw item.

#### Dataflow

GitHub issue/PR body or fixture content -> MaintainerWorkItem -> ormatAssessment(..., "json") -> JSON.stringify({ item, assessment }, null, 2) -> process.stdout.write -> local terminal, CI logs, redirected files, or action logs.

#### Reachability

Remote contributors can control live issue/PR content, but the vulnerable JSON path is non-default. The bundled workflow hardcodes Markdown and Action metadata defaults to Markdown. The impact depends on a caller choosing JSON output and on logs being visible to users who could not otherwise see the analyzed content.

#### Severity

Severity is low by the policy matrix: impact is medium because raw analyzed content can contain sensitive maintainer-visible text, and likelihood is medium because JSON is documented and reachable but non-default. The finding is not medium or high without evidence that JSON mode is commonly used with broadly readable logs or that high-value non-public secrets are routinely present. Evidence of private-repo CI logs visible to lower-privileged users would raise severity; removing JSON raw-item serialization would close it.

#### Remediation

Do not serialize raw work items in report JSON by default. Emit an allowlisted assessment-only object, redact item before JSON output, or add an explicit --include-raw-item flag with warnings. Add CLI and Action tests asserting JSON output does not include body, patch, diff, comments, or known secret/canary values unless explicitly requested.

## Reviewed Surfaces

| Surface | Risk Area | Outcome | Notes |
|---|---|---|---|
| GitHub PR/issue/diff content to OpenAI prompt and reports | Sensitive credential disclosure / redaction bypass | Reported | Produced MOAI-001 and MOAI-002. |
| Live GitHub repository analysis authorization | Authorization / policy boundary | Rejected | CLI authorization gate exists; workflow omission is availability, not bypass. |
| GitHub API client | SSRF / arbitrary request | Rejected | Fixed GitHub API origin and numeric issue/PR parsing. |
| Model response to CLI/GitHub Action stdout | Model-output trust / workflow-command injection | Reported | Produced MOAI-004. |
| Local fixture path | Arbitrary local file read | Rejected | Operator-selected local path only. |
| React dashboard rendering | XSS / unsafe HTML insertion | Rejected | Static React mock data; no unsafe HTML insertion or backend. |
| CI / GitHub Action execution with secrets | Token exposure / workflow trust boundary | Reported | Produced MOAI-003. |
| Generated web bundle | Generated artifact review | Not applicable | Source files reviewed as canonical surfaces. |
| Mutable third-party Action tags | CI supply-chain hardening | Rejected | Hardening concern, not project-specific vulnerability. |
| Workflow authorization wiring | Availability / automation blind spot | Rejected | Direct workflow may fail without authorization but does not bypass a security boundary. |
| Eval/security triage quality | Test quality / false negative risk | Rejected | Quality debt without runtime source/sink. |
| Prompt injection advisory integrity | Prompt injection / untrusted advice | Rejected | Human-in-the-loop advisory influence alone has no external side effect; concrete stdout impact is MOAI-004. |

## Open Questions And Follow Up

- Fix MOAI-003 first by redesigning .github/workflows/maintainerops.yml so pull-request code is never executed in a step containing OPENAI_API_KEY.
- Fix MOAI-001 by expanding redaction tests in src/redaction.test.ts for JSON/colon secrets, AWS credentials, and nested object forms, then assert the prompt sink no longer receives them.
- Fix MOAI-004 by adding a formatter-level neutralization helper for GitHub Actions stdout and testing all model-controlled Markdown fields.
- Decide whether JSON output should ever include raw item data; if yes, make it an explicit unsafe/debug mode rather than the normal Action JSON output.
