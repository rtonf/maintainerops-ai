import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatAssessment } from "./format.js";
import type { MaintainerAssessment, MaintainerWorkItem } from "./types.js";

const item: MaintainerWorkItem = {
  kind: "pull_request",
  repository: "owner/repo",
  title: "Add maintainer automation",
  body: 'contains "api_key": "json-colon-secret-1234567890"',
  diff: `aws_access_key_id: ${"AKIA"}${"ABCDEFGHIJKLMNOP"}`,
  comments: ["PRIVATE_CANARY_COMMENT_12345"],
  files: [
    {
      path: "src/feature.ts",
      status: "modified",
      additions: 10,
      deletions: 2,
      patch: "PRIVATE_CANARY_PATCH_12345"
    }
  ],
  metadata: {
    raw: "PRIVATE_CANARY_METADATA_12345"
  }
};

const assessment: MaintainerAssessment = {
  summary: "::warning file=src/format.ts,line=23::model command",
  riskLevel: "medium",
  confidence: 0.9,
  labels: ["security"],
  recommendedAction: "needs_security_review",
  reviewChecklist: ["::group::hidden"],
  securityNotes: ["Bearer abcdefghijklmnopqrstuvwxyz1234567890"],
  releaseNotes: [],
  commentDraft: "::add-mask::MASKME",
  evidence: [{ source: "body", reference: "::error::ref", note: "uses token=plain-secret-value" }]
};

describe("formatAssessment", () => {
  it("redacts raw work item content in JSON output", () => {
    const output = formatAssessment(item, assessment, "json");
    const parsed = JSON.parse(output) as { item: MaintainerWorkItem };
    assert.equal(output.includes("json-colon-secret-1234567890"), false);
    assert.equal(output.includes(`${"AKIA"}${"ABCDEFGHIJKLMNOP"}`), false);
    assert.equal(output.includes("PRIVATE_CANARY_COMMENT_12345"), false);
    assert.equal(output.includes("PRIVATE_CANARY_PATCH_12345"), false);
    assert.equal(output.includes("PRIVATE_CANARY_METADATA_12345"), false);
    assert.equal("body" in parsed.item, false);
    assert.equal("diff" in parsed.item, false);
    assert.equal("comments" in parsed.item, false);
    assert.equal("metadata" in parsed.item, false);
    assert.equal(output.includes("src/feature.ts"), true);
    assert.match(output, /REDACTED/);
  });

  it("neutralizes GitHub Actions workflow commands in markdown output", () => {
    const output = formatAssessment(item, assessment, "markdown");
    assert.equal(
      output.split("\n").some((line) => line.startsWith("::")),
      false
    );
    assert.match(output, /\\:\\:warning/);
    assert.match(output, /\\:\\:add-mask/);
    assert.equal(output.includes("##["), false);
    assert.equal(output.includes("::"), false);
    assert.equal(output.includes("plain-secret-value"), false);
  });

  it("renders evidence audit counts and warnings in JSON and markdown", () => {
    const audited: MaintainerAssessment = {
      ...assessment,
      evidenceAudit: {
        validReferences: 2,
        invalidReferences: [
          { source: "body", reference: "::error::bad-reference", reason: "Not present in the input." }
        ],
        untrustedInputWarnings: [{ source: "comment", reference: "comment:1", pattern: "execute/run commands" }]
      }
    };

    const json = JSON.parse(formatAssessment(item, audited, "json")) as {
      assessment: MaintainerAssessment;
    };
    const markdown = formatAssessment(item, audited, "markdown");

    assert.equal(json.assessment.evidenceAudit?.validReferences, 2);
    assert.equal(json.assessment.evidenceAudit?.invalidReferences.length, 1);
    assert.equal(json.assessment.evidenceAudit?.untrustedInputWarnings.length, 1);
    assert.match(markdown, /## Evidence audit/);
    assert.match(markdown, /\*\*Valid references:\*\* 2/);
    assert.match(markdown, /\*\*Invalid references:\*\* 1/);
    assert.match(markdown, /\*\*Untrusted input warnings:\*\* 1/);
    assert.equal(markdown.includes("::error"), false);
  });
});
