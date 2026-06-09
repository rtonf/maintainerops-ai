import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { redactSecrets } from "./redaction.js";

describe("redactSecrets", () => {
  it("redacts common API tokens", () => {
    const openAiToken = `sk-${"abcdefghijklmnopqrstuvwxyz123456"}`;
    const githubToken = `ghp_${"abcdefghijklmnopqrstuvwxyz123456"}`;
    const input = `OPENAI_API_KEY=${openAiToken} github token ${githubToken}`;
    const output = redactSecrets(input);
    assert.equal(output.includes("abcdefghijklmnopqrstuvwxyz123456"), false);
    assert.match(output, /REDACTED/);
  });

  it("redacts structured key-value and cloud credential forms", () => {
    const input = JSON.stringify({
      api_key: "json-colon-secret-1234567890",
      aws_access_key_id: `${"AKIA"}${"ABCDEFGHIJKLMNOP"}`,
      aws_secret_access_key: "aws-secret-value-1234567890"
    });
    const output = redactSecrets(input);
    assert.equal(output.includes("json-colon-secret-1234567890"), false);
    assert.equal(output.includes(`${"AKIA"}${"ABCDEFGHIJKLMNOP"}`), false);
    assert.equal(output.includes("aws-secret-value-1234567890"), false);
    assert.match(output, /REDACTED/);
  });
});
