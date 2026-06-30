import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeAssessmentLabels, normalizeLabel } from "./labels.js";
import type { MaintainerAssessment } from "./types.js";

const assessment: MaintainerAssessment = {
  summary: "Summary.",
  riskLevel: "low",
  confidence: 0.8,
  labels: [],
  recommendedAction: "needs_human_review",
  reviewChecklist: [],
  securityNotes: [],
  releaseNotes: [],
  commentDraft: "Draft.",
  evidence: []
};

describe("normalizeLabel", () => {
  it("maps model label aliases to canonical project labels", () => {
    assert.deepEqual(normalizeLabel("security"), ["security-review"]);
    assert.deepEqual(normalizeLabel("needs_security_review"), ["security-review"]);
    assert.deepEqual(normalizeLabel("triage"), ["needs-triage"]);
    assert.deepEqual(normalizeLabel("tests needed"), ["tests-needed"]);
  });

  it("keeps unknown labels stable and kebab-cased", () => {
    assert.deepEqual(normalizeLabel("Needs Product Review"), ["needs-product-review"]);
  });
});

describe("normalizeAssessmentLabels", () => {
  it("deduplicates normalized model labels", () => {
    assert.deepEqual(
      normalizeAssessmentLabels({
        ...assessment,
        labels: ["security", "needs_security_review", "tests needed", "tests-needed"]
      }).labels,
      ["security-review", "tests-needed"]
    );
  });
});
