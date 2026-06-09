#!/usr/bin/env node
import { runCli } from "./cli.js";

const mode = process.env.INPUT_MODE;
const repo = process.env.INPUT_REPO || process.env.GITHUB_REPOSITORY;
const number = process.env.INPUT_NUMBER;
const fixture = process.env.INPUT_FIXTURE;
const format = process.env.INPUT_FORMAT || "markdown";

const args = ["analyze", "--format", format];
if (process.env.MAINTAINEROPS_AUTHORIZED === "true" || process.env.GITHUB_ACTIONS === "true") {
  args.push("--authorized");
}

if (fixture) {
  args.push("--fixture", fixture);
} else if (mode === "pull_request" && repo && number) {
  args.push("--repo", repo, "--pull", number);
} else if (mode === "issue" && repo && number) {
  args.push("--repo", repo, "--issue", number);
} else {
  args.push("--help");
}

runCli(args).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`maintainerops action failed: ${message}\n`);
  process.exitCode = 1;
});
