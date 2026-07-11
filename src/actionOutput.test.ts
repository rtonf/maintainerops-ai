import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { writeActionReport } from "./actionOutput.js";

describe("writeActionReport", () => {
  it("writes markdown to the step summary and a multiline action output", async () => {
    const directory = await mkdtemp(join(tmpdir(), "maintainerops-action-output-"));
    const summaryPath = join(directory, "summary.md");
    const outputPath = join(directory, "output.txt");

    await writeActionReport("# Packet\n\nSafe result", "markdown", {
      GITHUB_STEP_SUMMARY: summaryPath,
      GITHUB_OUTPUT: outputPath
    });

    assert.equal(await readFile(summaryPath, "utf8"), "# Packet\n\nSafe result\n");
    assert.match(
      await readFile(outputPath, "utf8"),
      /^report<<maintainerops_[^\n]+\n# Packet\n\nSafe result\nmaintainerops_[^\n]+\n$/
    );
  });

  it("wraps JSON summaries in a code fence", async () => {
    const directory = await mkdtemp(join(tmpdir(), "maintainerops-action-json-"));
    const summaryPath = join(directory, "summary.md");

    await writeActionReport('{"safe":true}', "json", { GITHUB_STEP_SUMMARY: summaryPath });

    assert.match(await readFile(summaryPath, "utf8"), /```json\n\{"safe":true\}\n```/);
  });
});
