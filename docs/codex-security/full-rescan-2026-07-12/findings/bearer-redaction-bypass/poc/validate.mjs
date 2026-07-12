import assert from "node:assert/strict";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const targetRepo = process.env.TARGET_REPO;
assert.ok(targetRepo, "TARGET_REPO is required");

const { buildAssessmentPrompt } = await import(pathToFileURL(resolve(targetRepo, "src/prompt.ts")).href);
const { redactSecrets } = await import(pathToFileURL(resolve(targetRepo, "src/redaction.ts")).href);

const syntheticToken = "N7qV3pL9sT2xW6cR8mK4dF1hJ5uB0yZa";
const exactCase = redactSecrets(`Authorization: Bearer ${syntheticToken}`);
const lowerCase = redactSecrets(`Authorization: bearer ${syntheticToken}`);
const mixedCase = redactSecrets(`Authorization: bEaReR ${syntheticToken}`);

assert.equal(exactCase, "Authorization: Bearer [REDACTED]");
assert.equal(lowerCase, `Authorization: bearer ${syntheticToken}`);
assert.equal(mixedCase, `Authorization: bEaReR ${syntheticToken}`);

const prompt = buildAssessmentPrompt({
  kind: "issue",
  repository: "owner/repo",
  title: "Authentication failure report",
  body: `Observed request header: authorization: bearer ${syntheticToken}`
});

assert.equal(prompt.includes(syntheticToken), true);

process.stdout.write(
  `${JSON.stringify(
    {
      exactCase,
      lowerCase,
      mixedCase,
      promptContainsSyntheticToken: prompt.includes(syntheticToken)
    },
    null,
    2
  )}\n`
);
