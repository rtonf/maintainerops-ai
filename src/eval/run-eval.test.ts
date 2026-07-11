import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { evaluateOfflineCases } from "./run-eval.js";

describe("evaluateOfflineCases", () => {
  it("fails closed on an empty case set", () => {
    assert.deepEqual(evaluateOfflineCases([]), ["Offline eval case set must contain at least one case."]);
  });

  it("checks recommended actions and evidence minimums", () => {
    const failures = evaluateOfflineCases([
      {
        name: "ordinary issue",
        item: { kind: "issue", repository: "owner/repo", title: "Documentation typo" },
        expectedLabels: ["needs-triage"],
        expectedRecommendedAction: "needs_security_review",
        minEvidence: 2
      }
    ]);

    assert.equal(failures.length, 2);
  });
});
