#!/usr/bin/env node
import { pathToFileURL } from "node:url";
import { assessWorkItem, resolveWorkItem } from "./analyze.js";
import { formatAssessment } from "./format.js";
import type { CliArgs } from "./types.js";

export async function runCli(argv: string[]): Promise<void> {
  const args = parseArgs(argv);

  if (args.command === "help") {
    printHelp();
    return;
  }

  const item = await resolveWorkItem({
    fixture: args.fixture,
    repo: args.repo,
    pull: args.pull,
    issue: args.issue
  });

  const assessment = await assessWorkItem(item, {
    format: args.format,
    offline: args.offline,
    model: args.model ?? process.env.OPENAI_MODEL ?? "gpt-5.4-mini"
  });

  process.stdout.write(`${formatAssessment(item, assessment, args.format)}\n`);
}

export function parseArgs(argv: string[]): CliArgs {
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    return { command: "help", format: "markdown", offline: false, authorized: false };
  }

  const [command, ...rest] = argv;
  if (command !== "analyze") {
    throw new Error(`Unknown command: ${command}`);
  }

  const args: CliArgs = {
    command,
    format: "markdown",
    offline: false,
    authorized: process.env.MAINTAINEROPS_AUTHORIZED === "true"
  };

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    const next = rest[index + 1];

    switch (token) {
      case "--fixture":
        args.fixture = requireValue(token, next);
        index += 1;
        break;
      case "--repo":
        args.repo = requireValue(token, next);
        index += 1;
        break;
      case "--pull":
        args.pull = parsePositiveInt(token, next);
        index += 1;
        break;
      case "--issue":
        args.issue = parsePositiveInt(token, next);
        index += 1;
        break;
      case "--format":
        args.format = parseFormat(requireValue(token, next));
        index += 1;
        break;
      case "--model":
        args.model = requireValue(token, next);
        index += 1;
        break;
      case "--offline":
        args.offline = true;
        break;
      case "--authorized":
        args.authorized = true;
        break;
      default:
        throw new Error(`Unknown option: ${token}`);
    }
  }

  if (args.pull && args.issue) {
    throw new Error("Use either --pull or --issue, not both.");
  }

  if (args.repo && !args.authorized) {
    throw new Error("Analyzing live GitHub repositories requires --authorized or MAINTAINEROPS_AUTHORIZED=true. Only analyze repositories you own, maintain, or have permission to review.");
  }

  return args;
}

function requireValue(flag: string, value?: string): string {
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} requires a value.`);
  }
  return value;
}

function parsePositiveInt(flag: string, value?: string): number {
  const parsed = Number.parseInt(requireValue(flag, value), 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${flag} requires a positive integer.`);
  }
  return parsed;
}

function parseFormat(value: string): "json" | "markdown" {
  if (value !== "json" && value !== "markdown") {
    throw new Error("--format must be json or markdown.");
  }
  return value;
}

function printHelp(): void {
  process.stdout.write(`MaintainerOps AI

Usage:
  maintainerops analyze --fixture examples/fixtures/pull_request.json [--format markdown|json]
  maintainerops analyze --repo owner/name --pull 123 [--format markdown|json]
  maintainerops analyze --repo owner/name --issue 456 [--format markdown|json]

Options:
  --offline        Force deterministic offline analysis.
  --authorized     Confirm you own, maintain, or have permission to review the target repo.
  --model <id>    OpenAI model to use when OPENAI_API_KEY is set.
`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCli(process.argv.slice(2)).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`maintainerops: ${message}\n`);
    process.exitCode = 1;
  });
}
