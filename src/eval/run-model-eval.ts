import { readFile } from "node:fs/promises";
import { analyzeWithOpenAIResult } from "../openaiAssessment.js";
import { DEFAULT_OPENAI_MODEL } from "../defaults.js";
import type { MaintainerWorkItem, RiskLevel } from "../types.js";

interface ModelEvalCase {
  name: string;
  item: MaintainerWorkItem;
  expectedLabels: string[];
  forbiddenLabels?: string[];
  maxRisk?: RiskLevel;
}

const defaultCaseNames = [
  "security-sensitive pull request without tests",
  "external feedback issue mentions security evidence"
];
const gpt4oMiniPricing = {
  inputPerMillion: 0.15,
  outputPerMillion: 0.6
};
const riskOrder: RiskLevel[] = ["low", "medium", "high", "critical"];

async function main(): Promise<void> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required for model-backed evals.");
  }

  const raw = await readFile("examples/evals/golden.json", "utf8");
  const cases = JSON.parse(raw) as ModelEvalCase[];
  const args = parseArgs(process.argv.slice(2));
  const selected = cases.filter((evalCase) => defaultCaseNames.includes(evalCase.name)).slice(0, args.maxCases);
  const model = process.env.OPENAI_MODEL ?? DEFAULT_OPENAI_MODEL;
  const failures: string[] = [];
  let estimatedCostUsd = 0;

  for (const evalCase of selected) {
    const { assessment: result, usage } = await analyzeWithOpenAIResult(evalCase.item, model, {
      maxOutputTokens: args.maxOutputTokens
    });
    const caseCostUsd = estimateCostUsd(model, usage.inputTokens, usage.outputTokens);
    if (caseCostUsd !== undefined) {
      estimatedCostUsd += caseCostUsd;
    }

    for (const label of evalCase.expectedLabels) {
      if (!result.labels.includes(label)) {
        failures.push(`${evalCase.name}: expected label ${label}, got ${result.labels.join(", ")}`);
      }
    }

    for (const label of evalCase.forbiddenLabels ?? []) {
      if (result.labels.includes(label)) {
        failures.push(`${evalCase.name}: forbidden label ${label}, got ${result.labels.join(", ")}`);
      }
    }

    if (evalCase.maxRisk && riskOrder.indexOf(result.riskLevel) > riskOrder.indexOf(evalCase.maxRisk)) {
      failures.push(`${evalCase.name}: expected risk <= ${evalCase.maxRisk}, got ${result.riskLevel}`);
    }

    process.stdout.write(
      JSON.stringify({
        name: evalCase.name,
        model,
        riskLevel: result.riskLevel,
        recommendedAction: result.recommendedAction,
        labels: result.labels,
        usage,
        estimatedCostUsd: caseCostUsd
      }) + "\n"
    );

    if (estimatedCostUsd > args.budgetUsd) {
      failures.push(
        `${evalCase.name}: estimated cost ${formatUsd(estimatedCostUsd)} exceeded budget ${formatUsd(args.budgetUsd)}`
      );
      break;
    }
  }

  if (failures.length > 0) {
    process.stderr.write(`${failures.join("\n")}\n`);
    process.exitCode = 1;
    return;
  }

  process.stdout.write(`model eval passed: ${selected.length} cases; estimated cost ${formatUsd(estimatedCostUsd)}\n`);
}

interface ModelEvalArgs {
  budgetUsd: number;
  maxCases: number;
  maxOutputTokens: number;
}

function parseArgs(argv: string[]): ModelEvalArgs {
  const args: ModelEvalArgs = {
    budgetUsd: 0.5,
    maxCases: 2,
    maxOutputTokens: 1200
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const next = argv[index + 1];

    switch (token) {
      case "--budget-usd":
        args.budgetUsd = parsePositiveNumber(token, next);
        index += 1;
        break;
      case "--max-cases":
        args.maxCases = parsePositiveInteger(token, next);
        index += 1;
        break;
      case "--max-output-tokens":
        args.maxOutputTokens = parsePositiveInteger(token, next);
        index += 1;
        break;
      default:
        throw new Error(`Unknown option: ${token}`);
    }
  }

  return args;
}

function parsePositiveNumber(flag: string, value?: string): number {
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} requires a value.`);
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${flag} requires a positive number.`);
  }

  return parsed;
}

function parsePositiveInteger(flag: string, value?: string): number {
  const parsed = parsePositiveNumber(flag, value);
  if (!Number.isInteger(parsed)) {
    throw new Error(`${flag} requires a positive integer.`);
  }

  return parsed;
}

function estimateCostUsd(model: string, inputTokens?: number, outputTokens?: number): number | undefined {
  if (model !== "gpt-4o-mini" || inputTokens === undefined || outputTokens === undefined) {
    return undefined;
  }

  return (
    (inputTokens / 1_000_000) * gpt4oMiniPricing.inputPerMillion +
    (outputTokens / 1_000_000) * gpt4oMiniPricing.outputPerMillion
  );
}

function formatUsd(value: number): string {
  return `$${value.toFixed(6)}`;
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`model eval failed: ${message}\n`);
  process.exitCode = 1;
});
