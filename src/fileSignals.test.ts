import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isTestLikePath } from "./fileSignals.js";

describe("isTestLikePath", () => {
  it("recognizes common test file conventions", () => {
    for (const path of [
      "tests/unit/widget.ts",
      "src/__tests__/widget.ts",
      "src/widget.test.ts",
      "src/widget.spec.ts",
      "pkg/widget_test.go",
      "test_widget.py"
    ]) {
      assert.equal(isTestLikePath(path), true, path);
    }
  });

  it("does not treat ordinary names containing test or spec fragments as tests", () => {
    for (const path of ["src/latest.ts", "src/special.ts", "src/contest.ts", "src/introspection.ts"]) {
      assert.equal(isTestLikePath(path), false, path);
    }
  });
});
