import assert from "node:assert/strict";
import { test } from "node:test";
import { buildActionArgs } from "./actionArgs.js";

test("builds pull request action args", () => {
  assert.deepEqual(
    buildActionArgs({
      INPUT_MODE: "pull_request",
      INPUT_REPO: "owner/repo",
      INPUT_NUMBER: "42",
      INPUT_FORMAT: "json",
      INPUT_OFFLINE: "true",
      INPUT_AUTHORIZED: "true"
    }),
    ["analyze", "--format", "json", "--offline", "--authorized", "--repo", "owner/repo", "--pull", "42"]
  );
});

test("builds fixture action args without repository inputs", () => {
  assert.deepEqual(buildActionArgs({ INPUT_MODE: "fixture", INPUT_FIXTURE: "examples/fixture.json" }), [
    "analyze",
    "--format",
    "markdown",
    "--fixture",
    "examples/fixture.json"
  ]);
});

test("fails when pull request mode is missing required inputs", () => {
  assert.throws(() => buildActionArgs({ INPUT_MODE: "pull_request", INPUT_REPO: "owner/repo" }), {
    message: "mode=pull_request requires repo and number inputs"
  });
});

test("fails on unknown action mode", () => {
  assert.throws(() => buildActionArgs({ INPUT_MODE: "release" }), {
    message: "mode must be pull_request, issue, or fixture"
  });
});
