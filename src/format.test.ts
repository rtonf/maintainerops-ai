import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatAssessment } from "./format.js";
import type { ChangedFile, MaintainerAssessment, MaintainerWorkItem } from "./types.js";

const escapedSecretKey = ["api", "_key"].join("");
const escapedSecretValue = ["json-colon", "-secret-", "1234567890"].join("");
const escapedSecretAssignment = [
  String.raw`source: body: 'contains \"`,
  escapedSecretKey,
  String.raw`\": \"`,
  escapedSecretValue,
  String.raw`\"'`
].join("");

const item: MaintainerWorkItem = {
  kind: "pull_request",
  repository: "owner/repo##[legacy",
  title: "Add ::runner command",
  author: "maintainer##[author",
  url: "https://example.test/pull/1::url",
  body: escapedSecretAssignment,
  diff: `aws_access_key_id: ${"AKIA"}${"ABCDEFGHIJKLMNOP"}`,
  comments: ["PRIVATE_CANARY_COMMENT_12345"],
  files: [
    {
      path: "src/##[feature::file.ts",
      status: "modified##[status" as ChangedFile["status"],
      additions: 10,
      deletions: 2,
      patch: "PRIVATE_CANARY_PATCH_12345"
    }
  ],
  labels: ["security##[label", "::runner-label"],
  checks: [
    {
      name: "build##[check::name",
      conclusion: "failure::conclusion",
      status: "completed##[status"
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
    assert.equal(
      escapedSecretAssignment,
      [
        String.raw`source: body: 'contains \"`,
        escapedSecretKey,
        String.raw`\": \"`,
        escapedSecretValue,
        String.raw`\"'`
      ].join("")
    );
    const output = formatAssessment(item, assessment, "json");
    const parsed = JSON.parse(output) as { item: MaintainerWorkItem };
    assert.equal(output.includes(escapedSecretKey), false);
    assert.equal(output.includes(escapedSecretValue), false);
    assert.equal(output.includes(`${"AKIA"}${"ABCDEFGHIJKLMNOP"}`), false);
    assert.equal(output.includes("PRIVATE_CANARY_COMMENT_12345"), false);
    assert.equal(output.includes("PRIVATE_CANARY_PATCH_12345"), false);
    assert.equal(output.includes("PRIVATE_CANARY_METADATA_12345"), false);
    assert.equal("body" in parsed.item, false);
    assert.equal("diff" in parsed.item, false);
    assert.equal("comments" in parsed.item, false);
    assert.equal("metadata" in parsed.item, false);
    assert.deepEqual(Object.keys(parsed.item).sort(), [
      "author",
      "checks",
      "files",
      "kind",
      "labels",
      "repository",
      "title",
      "url"
    ]);
    assert.equal(output.includes("##["), false);
    assert.equal(output.includes("::"), false);
    assert.equal(parsed.item.repository, "owner/repo# #[legacy");
    assert.equal(parsed.item.title, "Add \\:\\:runner command");
    assert.equal(parsed.item.author, "maintainer# #[author");
    assert.equal(parsed.item.url, "https://example.test/pull/1\\:\\:url");
    assert.deepEqual(parsed.item.labels, ["security# #[label", "\\:\\:runner-label"]);
    assert.equal(parsed.item.files?.[0]?.path, "src/# #[feature\\:\\:file.ts");
    assert.equal(parsed.item.files?.[0]?.status, "modified# #[status");
    assert.equal(parsed.item.checks?.[0]?.name, "build# #[check\\:\\:name");
    assert.equal(parsed.item.checks?.[0]?.conclusion, "failure\\:\\:conclusion");
    assert.equal(parsed.item.checks?.[0]?.status, "completed# #[status");
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
});
