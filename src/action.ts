#!/usr/bin/env node
import { buildActionArgs } from "./actionArgs.js";
import { runCli } from "./cli.js";

runCli(buildActionArgs(process.env)).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`maintainerops action failed: ${message}\n`);
  process.exitCode = 1;
});
