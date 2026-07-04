import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { evaluateCaseResult, parseArgs, selectCases } from "./run-model-eval.js";
import type { MaintainerAssessment } from "../types.js";

const assessment: MaintainerAssessment = {
  summary: "Review auth boundary changes.",
  riskLevel: "high",
  confidence: 0.7,
  labels: ["security-review", "tests-needed"],
  recommendedAction: "needs_security_review",
  reviewChecklist: ["Check auth boundary.", "Ask for tests."],
  securityNotes: ["Auth-sensitive path changed."],
  releaseNotes: [],
  commentDraft: "Please add tests and describe the security boundary.",
  evidence: [{ source: "title", reference: "Fix auth bypass", note: "Security-sensitive title." }]
};

describe("parseArgs", () => {
  it("defaults model evals to the smoke suite", () => {
    assert.deepEqual(parseArgs([]), {
      budgetUsd: 0.5,
      maxCases: 5,
      maxOutputTokens: 1200,
      casesFile: "examples/evals/model-backed.json",
      suite: "smoke",
      caseNames: [],
      list: false,
      summaryJson: false
    });
  });

  it("parses suite, case, and report controls", () => {
    const args = parseArgs([
      "--suite",
      "all",
      "--case",
      "security-sensitive pull request without tests",
      "--budget-usd",
      "0.25",
      "--max-cases",
      "3",
      "--max-output-tokens",
      "900",
      "--cases-file",
      "tmp/cases.json",
      "--list",
      "--summary-json"
    ]);

    assert.equal(args.suite, "all");
    assert.deepEqual(args.caseNames, ["security-sensitive pull request without tests"]);
    assert.equal(args.budgetUsd, 0.25);
    assert.equal(args.maxCases, 3);
    assert.equal(args.maxOutputTokens, 900);
    assert.equal(args.casesFile, "tmp/cases.json");
    assert.equal(args.list, true);
    assert.equal(args.summaryJson, true);
  });
});

describe("selectCases", () => {
  const cases = [
    { name: "a", suite: "smoke" as const, expectedLabels: [], item: minimalIssue("a") },
    { name: "b", suite: "expanded" as const, expectedLabels: [], item: minimalIssue("b") },
    { name: "c", suite: "expanded" as const, expectedLabels: [], item: minimalIssue("c") }
  ];

  it("selects smoke cases by default", () => {
    assert.deepEqual(
      selectCases(cases, parseArgs([])).map((evalCase) => evalCase.name),
      ["a"]
    );
  });

  it("supports explicit case selection with max case caps", () => {
    assert.deepEqual(
      selectCases(cases, parseArgs(["--case", "b", "--case", "c", "--max-cases", "1"])).map(
        (evalCase) => evalCase.name
      ),
      ["b"]
    );
  });

  it("can list every selected case when the caller removes the max case cap", () => {
    const args = { ...parseArgs(["--suite", "all", "--list"]), maxCases: Number.MAX_SAFE_INTEGER };
    assert.deepEqual(
      selectCases(cases, args).map((evalCase) => evalCase.name),
      ["a", "b", "c"]
    );
  });
});

describe("evaluateCaseResult", () => {
  it("passes matching labels, action, and risk bounds", () => {
    assert.deepEqual(
      evaluateCaseResult(
        {
          name: "security",
          expectedLabels: ["security-review"],
          forbiddenLabels: ["release-notes"],
          expectedRecommendedAction: "needs_security_review",
          minRisk: "medium",
          maxRisk: "critical",
          item: minimalIssue("security")
        },
        assessment
      ),
      []
    );
  });

  it("accepts equivalent maintainer actions", () => {
    assert.deepEqual(
      evaluateCaseResult(
        {
          name: "feedback",
          expectedLabels: ["security-review"],
          expectedRecommendedAction: "needs_more_info",
          acceptableRecommendedActions: ["needs_security_review"],
          item: minimalIssue("feedback")
        },
        assessment
      ),
      []
    );
  });

  it("reports forbidden labels and action/risk mismatches", () => {
    const failures = evaluateCaseResult(
      {
        name: "security",
        expectedLabels: ["maintainer-review"],
        forbiddenLabels: ["tests-needed"],
        expectedRecommendedAction: "needs_more_info",
        forbiddenRecommendedActions: ["needs_security_review"],
        minRisk: "critical",
        maxRisk: "medium",
        item: minimalIssue("security")
      },
      assessment
    );

    assert.equal(failures.length, 6);
  });
});

function minimalIssue(title: string) {
  return {
    kind: "issue" as const,
    repository: "example/repo",
    title
  };
}
