import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { verifyReleaseTag } from "./verify-release-tag.mjs";

describe("verifyReleaseTag", () => {
  it("accepts an exact stable version tag", () => {
    assert.doesNotThrow(() => verifyReleaseTag("v0.1.14", "0.1.14"));
  });

  it("rejects mismatched and prerelease publication", () => {
    assert.throws(() => verifyReleaseTag("v0.1.13", "0.1.14"), /does not match package version/);
    assert.throws(() => verifyReleaseTag("v0.2.0-beta.1", "0.2.0-beta.1"), /requires a stable semantic version/);
  });
});
