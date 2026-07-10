#!/usr/bin/env node
import { buildActionArgs } from "./actionArgs.js";
import { writeActionReport } from "./actionOutput.js";
import { executeCli } from "./cli.js";

async function main(): Promise<void> {
  const args = buildActionArgs(process.env);
  const report = await executeCli(args);
  process.stdout.write(`${report}\n`);
  await writeActionReport(report, process.env.INPUT_FORMAT === "json" ? "json" : "markdown", process.env);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`maintainerops action failed: ${message}\n`);
  process.exitCode = 1;
});
