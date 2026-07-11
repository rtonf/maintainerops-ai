import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateWorkItem } from "./fixture.js";

describe("validateWorkItem", () => {
  it("accepts a well-formed work item", () => {
    assert.doesNotThrow(() =>
      validateWorkItem({
        kind: "pull_request",
        repository: "owner/repo",
        number: 12,
        title: "Add tests",
        files: [{ path: "src/widget.ts", status: "modified", additions: 3, deletions: 1 }]
      })
    );
  });

  it("rejects malformed nested fields before analysis", () => {
    assert.throws(
      () =>
        validateWorkItem({
          kind: "pull_request",
          repository: "owner/repo",
          title: "Malformed files",
          files: "not-an-array"
        }),
      /files must be an array/
    );
    assert.throws(
      () =>
        validateWorkItem({
          kind: "pull_request",
          repository: "owner/repo",
          title: "Malformed file",
          files: [{ path: "src/widget.ts", status: "changed" }]
        }),
      /invalid status/
    );
  });
});
