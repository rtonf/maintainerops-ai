import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseArgs } from "./cli.js";

describe("parseArgs", () => {
  it("parses fixture analysis", () => {
    const args = parseArgs(["analyze", "--fixture", "example.json", "--format", "json", "--offline"]);
    assert.equal(args.command, "analyze");
    assert.equal(args.fixture, "example.json");
    assert.equal(args.format, "json");
    assert.equal(args.offline, true);
  });

  it("rejects pull and issue together", () => {
    assert.throws(() => parseArgs(["analyze", "--repo", "owner/repo", "--pull", "1", "--issue", "2"]));
  });

  it("requires authorization for live GitHub analysis", () => {
    assert.throws(() => parseArgs(["analyze", "--repo", "owner/repo", "--pull", "1"]));
    const args = parseArgs(["analyze", "--repo", "owner/repo", "--pull", "1", "--authorized"]);
    assert.equal(args.authorized, true);
  });
});
