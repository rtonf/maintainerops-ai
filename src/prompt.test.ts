import assert from "node:assert/strict";
import { test } from "node:test";

import { buildAssessmentPrompt } from "./prompt.js";
import type { MaintainerWorkItem } from "./types.js";

test("redacts structured secrets before truncation can remove their key context", () => {
  const secret = "SUPERPRIVATEVALUE1234567890";
  const item: MaintainerWorkItem = {
    kind: "issue",
    repository: "owner/repo",
    title: "Large report",
    body: `${"A".repeat(90_000)}password=${secret}${"B".repeat(30_000 - secret.length)}`
  };

  const prompt = buildAssessmentPrompt(item);

  assert.equal(prompt.includes(secret), false);
  assert.equal(prompt.includes("password=[REDACTED]"), true);
});
