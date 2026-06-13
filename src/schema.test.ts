import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assertAssessment } from "./schema.js";
import type { MaintainerAssessment } from "./types.js";

const validAssessment: MaintainerAssessment = {
  summary: "Review packet summary.",
  riskLevel: "medium",
  confidence: 0.75,
  labels: ["maintainer-review"],
  recommendedAction: "needs_human_review",
  reviewChecklist: ["Check tests."],
  securityNotes: ["No obvious security signal."],
  releaseNotes: ["Confirm user impact."],
  commentDraft: "Thanks for the contribution.",
  evidence: [{ source: "metadata", reference: "fixture", note: "Validated shape." }]
};

describe("assertAssessment", () => {
  it("accepts a valid assessment", () => {
    assert.deepEqual(assertAssessment(validAssessment), validAssessment);
  });

  it("rejects invalid risk levels", () => {
    assert.throws(() => assertAssessment({ ...validAssessment, riskLevel: "urgent" }), /invalid riskLevel: urgent/);
  });

  it("rejects invalid recommended actions", () => {
    assert.throws(
      () => assertAssessment({ ...validAssessment, recommendedAction: "auto_merge" }),
      /invalid recommendedAction: auto_merge/
    );
  });

  it("rejects confidence outside the allowed range", () => {
    assert.throws(
      () => assertAssessment({ ...validAssessment, confidence: 1.5 }),
      /confidence must be between 0 and 1/
    );
  });
});
