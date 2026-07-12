# Case-sensitive Bearer redaction leaks valid bearer credentials before the model call

## Executive Summary

MaintainerOps AI 0.1.14, at revision `40ab2aaf0875d0b9074642ba4f51223f1bd4200a`, attempts to remove secrets from GitHub work items and local fixtures before sending them to the model provider. The Bearer-token rule in `src/redaction.ts:21` matches only the exact spelling `Bearer`. HTTP authentication scheme names are case-insensitive, so equivalent spellings such as `bearer` and `bEaReR` are realistic. An otherwise opaque bearer credential using the accepted character set therefore passes through unchanged.

When model-backed analysis is enabled, the surviving value is placed in the user content passed to `client.responses.create` in `src/openaiAssessment.ts:40-50`. The direct impact is disclosure of a valid bearer credential to the model provider. If the credential is accepted by its service, that disclosure can enable unauthorized use subject to the credential's scope and the provider's access and retention controls. This report demonstrates the disclosure primitive; it does not demonstrate account access or compromise.

I reviewed the vulnerable revision directly and reproduced the bypass locally with Node.js 24.14.1 using a synthetic 32-character token. I did not use a real credential, make an OpenAI request, or test a live production system. A fixed release or fixing revision was not established in the reviewed source history.

## Background

The application builds a `MaintainerWorkItem` from remote issue or pull-request data. In `src/github.ts:26-54`, the issue and pull-request title and body are copied into the work item, and pull-request file patches are mapped into its `files` field. These values are content supplied by issue authors, pull-request authors, or other contributors who can write to the relevant repository surface. The same data model can be loaded from a JSON fixture:

```ts
// src/fixture.ts:40-44
export async function loadFixture(path: string): Promise<MaintainerWorkItem> {
  const raw = await readFile(path, "utf8");
  const parsed: unknown = JSON.parse(raw);
  validateWorkItem(parsed);
  return parsed;
}
```

`validateWorkItem` checks the shape and types of the object, but it does not treat the contents of string fields as executable data or as secrets. A credential-bearing body, title, diff, or fixture field remains a valid work item.

Before model analysis, `src/prompt.ts:4-25` serializes the complete work item, calls `redactSecrets`, truncates the result if necessary, and returns the resulting string as the assessment prompt. The intended invariant is that a credential present in an input string is absent from the string that crosses the model boundary.

## Vulnerability Details

The vulnerable Bearer rule is:

```ts
// src/redaction.ts:21-25
[/Bearer\s+[A-Za-z0-9._~+/-]{20,}/g, "Bearer [REDACTED]"]
];

export function redactSecrets(input: string): string {
  return secretPatterns.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), input);
}
```

The regular expression has the global flag, but not the case-insensitive `i` flag. The global flag finds multiple exact-case matches; it does not normalize the scheme spelling. The earlier generic patterns are case-insensitive, but they recognize key/value forms such as `token=...`, `access_token: ...`, or `secret: ...`. They do not recognize an `Authorization: bearer ...` header because `authorization` is not one of those key names and the value is not introduced by `=` or `:` in the pattern's expected form.

For the same 32-character opaque token, the relevant transformation is deterministic:

| Input | Result from `redactSecrets` |
| --- | --- |
| `Authorization: Bearer <token>` | `Authorization: Bearer [REDACTED]` |
| `Authorization: bearer <token>` | token remains unchanged |
| `Authorization: bEaReR <token>` | token remains unchanged |

We can now carry the missed redaction through the prompt builder. The nesting in `src/prompt.ts:5-23` is important because redaction is the only transformation intended to remove the secret before the provider boundary. The following is a condensed excerpt of that source:

```ts
const payload = truncateForModel(
  redactSecrets(
    JSON.stringify(
      {
        task: "Assess this open-source maintainer work item.",
        instructions: [/* conservative review instructions */],
        item
      },
      null,
      2
    )
  )
);
```

For a short issue body or fixture, `truncateForModel` returns the input unchanged. More importantly, truncation is not a secret-removal control: a retained value can remain in either the preserved head or tail of a long prompt. Once the case-sensitive rule misses the bearer scheme, `buildAssessmentPrompt` returns the credential-bearing JSON string.

The final transition is direct:

```ts
// src/openaiAssessment.ts:39-50
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const response = await client.responses.create({
  model,
  input: [
    { role: "system", content: OPENAI_ASSESSMENT_SYSTEM_PROMPT },
    { role: "user", content: buildAssessmentPrompt(item) }
  ],
  // response schema omitted
});
```

Thus the complete path is:

```text
issue/PR body, patch, or fixture string
  -> MaintainerWorkItem
  -> JSON.stringify
  -> case-sensitive redactSecrets
  -> buildAssessmentPrompt
  -> user content in responses.create
  -> model provider
```

The model-backed path is required. The normal analysis selector uses the offline analyzer when offline mode is requested or when `OPENAI_API_KEY` is absent; otherwise it calls `analyzeWithOpenAI`. This requirement limits likelihood, but it does not repair the missing redaction when the model path is selected. Any later redaction of a generated assessment or serialized report occurs after the provider has already received the prompt and cannot undo this disclosure.

## Exploitability Analysis

The strongest route is a credential-bearing work item that reaches a model-backed assessment. An attacker who can author or influence an issue or pull request can place a header-like string in its title, body, or patch. A local operator can reach the same state by loading a fixture containing the string. No special scheduling, allocator state, race, or memory corruption is involved; the bypass is a single predictable branch decision in a pure string transformation.

The input needs to satisfy the existing Bearer rule's token grammar: at least 20 characters from `A-Z`, `a-z`, digits, `.`, `_`, `~`, `+`, `/`, or `-`. A valid opaque bearer credential with that shape is sufficient. The synthetic value used for validation was 32 characters long and intentionally did not resemble an OpenAI key, GitHub token, JWT, or named key/value secret. That matters because the independent patterns at `src/redaction.ts:2-20` may catch credentials with those other formats even when the Bearer rule misses them.

Exact-case `Bearer` is a useful dead end: it is removed as intended. A spelling such as lowercase `bearer` or mixed-case `bEaReR` is the reliable alternative because the authentication scheme is case-insensitive while the regular expression is not. Adding `token=`, `access_token=`, or `secret=` around the same value would exercise a different redaction rule and is not needed for this bypass.

The source does not read a secret from the host or turn an attacker-controlled string into a credential. The disclosure requires a real credential to already be present in an input field or fixture, and model-backed analysis must be enabled. Those are important limits on the attacker story. Once both preconditions hold, however, the credential is included in the provider request without any additional check in `openaiAssessment.ts`. The provider's receipt of the input is the demonstrated security impact; whether a model echoes it or whether a downstream service accepts it is not required for the disclosure to occur.

## Proof of Concept

The report bundle includes a safe local PoC under `poc/`. It imports the pinned TypeScript implementation, tests exact, lowercase, and mixed-case scheme spellings, and then tests `buildAssessmentPrompt` with the lowercase form. The PoC uses only the synthetic token `N7qV3pL9sT2xW6cR8mK4dF1hJ5uB0yZa`. It does not import the OpenAI client, make network requests, modify files, or require an API key.

From the report directory, use a relative path to a checkout containing the vulnerable revision:

```powershell
cd poc
$env:TARGET_REPO = "..\..\target\maintainerops-ai-security-scan"
$loader = "file:///" + ((Resolve-Path .\ts-loader.mjs).Path.Replace("\", "/"))
node --experimental-strip-types --experimental-loader $loader .\validate.mjs
```

Adjust only `TARGET_REPO` if the checkout is in a different relative location. The loader is needed because the source uses `.js` import specifiers while the PoC evaluates the TypeScript files directly.

Representative vulnerable-revision output is:

```text
{
  "exactCase": "Authorization: Bearer [REDACTED]",
  "lowerCase": "Authorization: bearer N7qV3pL9sT2xW6cR8mK4dF1hJ5uB0yZa",
  "mixedCase": "Authorization: bEaReR N7qV3pL9sT2xW6cR8mK4dF1hJ5uB0yZa",
  "promptContainsSyntheticToken": true
}
```

The last field is the boundary check: the token survives `buildAssessmentPrompt`, which is the value later supplied as `content` for the user message. After the proposed fix below, the expected result is that both `lowerCase` and `mixedCase` contain `Bearer [REDACTED]` and `promptContainsSyntheticToken` is `false`. That fixed behavior is an expectation from the proposed patch, not a live-provider observation.

## Remediation

The invariant to restore is simple: every spelling of the supported Bearer authentication scheme must be redacted before the work item is serialized into model input. The minimal patch is to make the existing rule case-insensitive while preserving its current token grammar:

```ts
// src/redaction.ts
[/\bBearer\s+[A-Za-z0-9._~+/-]{20,}/gi, "Bearer [REDACTED]"]
```

The `i` flag covers lowercase and mixed-case schemes. The word boundary prevents the rule from treating an unrelated longer word ending in `Bearer` as an authentication scheme. If the application accepts bearer credentials containing characters outside the current class, the matcher should be expanded or replaced with a parser for the actual accepted header grammar; otherwise a second character-class gap could create the same failure mode.

The fix should be accompanied by regression coverage at both relevant boundaries:

1. Test `redactSecrets` with `Bearer`, `bearer`, and mixed-case spellings, asserting that the token is absent in every result.
2. Test `buildAssessmentPrompt` with a credential in an issue body and in a pull-request patch, asserting that the returned prompt contains no credential.
3. Mock `responses.create` at the model boundary and assert that the user content contains the redacted marker rather than the original token. This test should remain local and should not require an API key.
4. Retain coverage for exact-case matching and for opaque tokens that do not match the other named credential formats.

Defense in depth would also benefit from treating the provider boundary as a last checkpoint: construct the prompt once, apply the centralized redactor immediately before assigning it to user content, and avoid logging the pre-redaction or post-redaction prompt with sensitive values. Output serialization redaction can remain useful for downstream artifacts, but it should not be considered a substitute for input redaction.

## Summary

We traced a credential-bearing issue, pull request, or fixture string through `MaintainerWorkItem`, JSON serialization, the case-sensitive Bearer rule, prompt construction, and the user content of the model request. The exact-case spelling is protected, but equivalent lowercase and mixed-case schemes bypass the only relevant rule and remain in the provider-bound prompt. The local PoC reproduced that transition deterministically with a synthetic token and no network activity.

The practical impact is sensitive bearer-credential disclosure whenever a valid credential is present in an input and model-backed analysis is enabled. The direct fix is small: make the Bearer matcher case-insensitive, then lock the invariant in tests at both the redaction and provider-input boundaries. Further review should focus on the accepted credential grammar and on ensuring that every future credential pattern is normalized or parsed according to the protocol it represents before any external request is made.
