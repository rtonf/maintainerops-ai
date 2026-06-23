import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { analyzeOffline } from "./offlineAnalyzer.js";
import type { MaintainerWorkItem } from "./types.js";

describe("analyzeOffline", () => {
  it("routes security-sensitive pull requests without tests to security review", () => {
    const item: MaintainerWorkItem = {
      kind: "pull_request",
      repository: "owner/repo",
      number: 12,
      title: "Tighten auth token validation",
      files: [{ path: "src/auth.ts", status: "modified", additions: 30, deletions: 4 }]
    };

    const assessment = analyzeOffline(item);

    assert.equal(assessment.riskLevel, "high");
    assert.equal(assessment.recommendedAction, "needs_security_review");
    assert.equal(assessment.labels.includes("security-review"), true);
    assert.equal(assessment.labels.includes("tests-needed"), true);
  });

  it("keeps ordinary documentation issues low risk and asks for more information", () => {
    const item: MaintainerWorkItem = {
      kind: "issue",
      repository: "owner/repo",
      number: 18,
      title: "Clarify installation docs",
      body: "The setup guide should mention the package manager version."
    };

    const assessment = analyzeOffline(item);

    assert.equal(assessment.riskLevel, "low");
    assert.equal(assessment.recommendedAction, "needs_more_info");
    assert.deepEqual(assessment.labels, ["needs-triage"]);
  });

  it("flags large non-test pull requests for human review", () => {
    const item: MaintainerWorkItem = {
      kind: "pull_request",
      repository: "owner/repo",
      number: 25,
      title: "Refactor package layout",
      files: Array.from({ length: 13 }, (_, index) => ({
        path: `src/module-${index}.ts`,
        status: "modified" as const,
        additions: 20,
        deletions: 2
      }))
    };

    const assessment = analyzeOffline(item);

    assert.equal(assessment.riskLevel, "medium");
    assert.equal(assessment.recommendedAction, "needs_human_review");
    assert.equal(assessment.labels.includes("large-change"), true);
    assert.equal(assessment.labels.includes("tests-needed"), true);
  });

  it("does not inflate feedback request issues that mention security evidence", () => {
    const item: MaintainerWorkItem = {
      kind: "issue",
      repository: "owner/repo",
      number: 6,
      title: "External maintainer feedback wanted",
      body: "Please try the Marketplace Action or npm CLI and comment on whether the security review packet is useful."
    };

    const assessment = analyzeOffline(item);

    assert.equal(assessment.riskLevel, "low");
    assert.equal(assessment.recommendedAction, "needs_more_info");
    assert.equal(assessment.labels.includes("needs-triage"), true);
    assert.equal(assessment.labels.includes("security-review"), false);
    assert.equal(assessment.labels.includes("release-notes"), false);
    assert.match(assessment.commentDraft, /install or Action setup worked/);
  });

  it("keeps missing-permission reports in security review despite feedback wording", () => {
    const result = analyzeOffline({
      kind: "issue",
      repository: "owner/repo",
      title: "Permission check missing",
      body: "The route does not verify ownership. Please try this npm package and comment."
    });

    assert.equal(result.riskLevel, "high");
    assert.equal(result.labels.includes("security-review"), true);
    assert.equal(result.recommendedAction, "needs_security_review");
  });

  it("bounds large duplicated patch input while preserving title signals", () => {
    const patch = "x".repeat(2_000_000);
    const result = analyzeOffline({
      kind: "pull_request",
      repository: "owner/repo",
      title: "Fix authorization bypass",
      body: "security fix",
      diff: patch,
      files: [{ path: "src/large.ts", status: "modified", patch }]
    });

    assert.equal(result.labels.includes("security-review"), true);
  });
});
