import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeAssessmentForWorkItem, normalizeAssessmentLabels, normalizeLabel } from "./labels.js";
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

describe("normalizeAssessmentForWorkItem", () => {
  it("adds canonical missing-test labels for pull requests without test files", () => {
    const result = normalizeAssessmentForWorkItem(
      {
        kind: "pull_request",
        repository: "owner/repo",
        title: "Fix token permission bypass",
        files: [{ path: "src/auth/session.ts", status: "modified" }]
      },
      { ...assessment, labels: ["security", "authorization"] }
    );

    assert.equal(result.labels.includes("maintainer-review"), true);
    assert.equal(result.labels.includes("security-review"), true);
    assert.equal(result.labels.includes("tests-needed"), true);
  });

  it("suppresses security and release labels for low-risk external feedback requests", () => {
    const result = normalizeAssessmentForWorkItem(
      {
        kind: "issue",
        repository: "owner/repo",
        title: "External maintainer feedback wanted",
        body: "Please try the Marketplace Action and comment on the security review packet."
      },
      { ...assessment, labels: ["feedback", "security-review", "release-notes"], riskLevel: "low" }
    );

    assert.equal(result.labels.includes("needs-triage"), true);
    assert.equal(result.labels.includes("security-review"), false);
    assert.equal(result.labels.includes("release-notes"), false);
  });

  it("caps non-security feedback requests at low risk", () => {
    const result = normalizeAssessmentForWorkItem(
      {
        kind: "issue",
        repository: "owner/repo",
        title: "External maintainer feedback wanted",
        body: "Please try the Marketplace Action and comment on the security review packet."
      },
      {
        ...assessment,
        labels: ["needs-triage", "security-review"],
        riskLevel: "medium",
        recommendedAction: "needs_more_info"
      }
    );

    assert.equal(result.riskLevel, "low");
    assert.equal(result.labels.includes("security-review"), false);
  });

  it("adds release notes for release readiness issues", () => {
    const result = normalizeAssessmentForWorkItem(
      {
        kind: "issue",
        repository: "owner/repo",
        title: "Release readiness packet for v0.1.10",
        body: "Prepare release notes and maintainer checklist."
      },
      { ...assessment, labels: ["needs-triage"] }
    );

    assert.equal(result.labels.includes("needs-triage"), true);
    assert.equal(result.labels.includes("release-notes"), true);
  });

  it("keeps release readiness issues low risk unless security review is recommended", () => {
    const result = normalizeAssessmentForWorkItem(
      {
        kind: "issue",
        repository: "owner/repo",
        title: "Release readiness packet for v0.1.10",
        body: "Prepare release notes and maintainer checklist."
      },
      {
        ...assessment,
        labels: ["needs-triage", "release-notes"],
        riskLevel: "medium",
        recommendedAction: "needs_human_review"
      }
    );

    assert.equal(result.riskLevel, "low");
    assert.equal(result.labels.includes("release-notes"), true);
  });

  it("adds security review for actionable prompt-injection issues", () => {
    const result = normalizeAssessmentForWorkItem(
      {
        kind: "issue",
        repository: "owner/repo",
        title: "Prompt-injection safe comment draft",
        body: "Untrusted issue text must not reveal secrets or execute unauthorized actions."
      },
      { ...assessment, labels: ["needs-triage"] }
    );

    assert.equal(result.labels.includes("needs-triage"), true);
    assert.equal(result.labels.includes("security-review"), true);
  });
});
