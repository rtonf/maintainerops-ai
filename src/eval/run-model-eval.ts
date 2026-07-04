import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { analyzeWithOpenAIResult } from "../openaiAssessment.js";
import { DEFAULT_OPENAI_MODEL } from "../defaults.js";
import type { MaintainerAssessment, MaintainerWorkItem, RiskLevel } from "../types.js";

export interface ModelEvalCase {
  name: string;
  suite?: "smoke" | "expanded";
  item: MaintainerWorkItem;
  expectedLabels: string[];
  forbiddenLabels?: string[];
  expectedRecommendedAction?: MaintainerAssessment["recommendedAction"];
  forbiddenRecommendedActions?: MaintainerAssessment["recommendedAction"][];
  minRisk?: RiskLevel;
  maxRisk?: RiskLevel;
}

const gpt4oMiniPricing = {
  inputPerMillion: 0.15,
  outputPerMillion: 0.6
};
const riskOrder: RiskLevel[] = ["low", "medium", "high", "critical"];
const defaultCasesFile = "examples/evals/model-backed.json";

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const raw = await readFile(args.casesFile, "utf8");
  const cases = JSON.parse(raw) as ModelEvalCase[];

  if (args.list) {
    for (const evalCase of selectCases(cases, { ...args, maxCases: Number.MAX_SAFE_INTEGER })) {
      process.stdout.write(`${evalCase.name}\n`);
    }
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required for model-backed evals.");
  }

  const selected = selectCases(cases, args);
  const model = process.env.OPENAI_MODEL ?? DEFAULT_OPENAI_MODEL;
  const failures: string[] = [];
  let estimatedCostUsd = 0;
  const results: ModelEvalCaseResult[] = [];

  for (const evalCase of selected) {
    const { assessment: result, usage } = await analyzeWithOpenAIResult(evalCase.item, model, {
      maxOutputTokens: args.maxOutputTokens
    });
    const caseCostUsd = estimateCostUsd(model, usage.inputTokens, usage.outputTokens);
    if (caseCostUsd !== undefined) {
      estimatedCostUsd += caseCostUsd;
    }

    failures.push(...evaluateCaseResult(evalCase, result));
    results.push({
      name: evalCase.name,
      model,
      riskLevel: result.riskLevel,
      recommendedAction: result.recommendedAction,
      labels: result.labels,
      usage,
      estimatedCostUsd: caseCostUsd
    });

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
    if (args.summaryJson) {
      process.stdout.write(
        JSON.stringify({
          passed: false,
          cases: results.length,
          estimatedCostUsd,
          failures,
          results
        }) + "\n"
      );
    }
    process.stderr.write(`${failures.join("\n")}\n`);
    process.exitCode = 1;
    return;
  }

  if (args.summaryJson) {
    process.stdout.write(
      JSON.stringify({
        passed: true,
        cases: selected.length,
        estimatedCostUsd,
        failures,
        results
      }) + "\n"
    );
  }
  process.stdout.write(`model eval passed: ${selected.length} cases; estimated cost ${formatUsd(estimatedCostUsd)}\n`);
}

interface ModelEvalCaseResult {
  name: string;
  model: string;
  riskLevel: RiskLevel;
  recommendedAction: MaintainerAssessment["recommendedAction"];
  labels: string[];
  usage: {
    inputTokens?: number;
    outputTokens?: number;
  };
  estimatedCostUsd?: number;
}

export interface ModelEvalArgs {
  budgetUsd: number;
  maxCases: number;
  maxOutputTokens: number;
  casesFile: string;
  suite: "smoke" | "expanded" | "all";
  caseNames: string[];
  list: boolean;
  summaryJson: boolean;
}

export function parseArgs(argv: string[]): ModelEvalArgs {
  const args: ModelEvalArgs = {
    budgetUsd: 0.5,
    maxCases: 5,
    maxOutputTokens: 1200,
    casesFile: defaultCasesFile,
    suite: "smoke",
    caseNames: [],
    list: false,
    summaryJson: false
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
      case "--cases-file":
        args.casesFile = parseStringValue(token, next);
        index += 1;
        break;
      case "--suite":
        args.suite = parseSuite(next);
        index += 1;
        break;
      case "--case":
        args.caseNames.push(parseStringValue(token, next));
        index += 1;
        break;
      case "--list":
        args.list = true;
        break;
      case "--summary-json":
        args.summaryJson = true;
        break;
      default:
        throw new Error(`Unknown option: ${token}`);
    }
  }

  return args;
}

export function selectCases(cases: ModelEvalCase[], args: ModelEvalArgs): ModelEvalCase[] {
  const selected =
    args.caseNames.length > 0
      ? cases.filter((evalCase) => args.caseNames.includes(evalCase.name))
      : cases.filter((evalCase) => args.suite === "all" || evalCase.suite === args.suite);

  const missing = args.caseNames.filter((caseName) => !cases.some((evalCase) => evalCase.name === caseName));
  if (missing.length > 0) {
    throw new Error(`Unknown model eval case(s): ${missing.join(", ")}`);
  }

  return selected.slice(0, args.maxCases);
}

export function evaluateCaseResult(evalCase: ModelEvalCase, result: MaintainerAssessment): string[] {
  const failures: string[] = [];

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

  if (evalCase.expectedRecommendedAction && result.recommendedAction !== evalCase.expectedRecommendedAction) {
    failures.push(
      `${evalCase.name}: expected recommendedAction ${evalCase.expectedRecommendedAction}, got ${result.recommendedAction}`
    );
  }

  for (const action of evalCase.forbiddenRecommendedActions ?? []) {
    if (result.recommendedAction === action) {
      failures.push(`${evalCase.name}: forbidden recommendedAction ${action}`);
    }
  }

  if (evalCase.minRisk && riskOrder.indexOf(result.riskLevel) < riskOrder.indexOf(evalCase.minRisk)) {
    failures.push(`${evalCase.name}: expected risk >= ${evalCase.minRisk}, got ${result.riskLevel}`);
  }

  if (evalCase.maxRisk && riskOrder.indexOf(result.riskLevel) > riskOrder.indexOf(evalCase.maxRisk)) {
    failures.push(`${evalCase.name}: expected risk <= ${evalCase.maxRisk}, got ${result.riskLevel}`);
  }

  return failures;
}

function parseStringValue(flag: string, value?: string): string {
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} requires a value.`);
  }

  return value;
}

function parseSuite(value?: string): ModelEvalArgs["suite"] {
  if (value !== "smoke" && value !== "expanded" && value !== "all") {
    throw new Error("--suite must be smoke, expanded, or all.");
  }

  return value;
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

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`model eval failed: ${message}\n`);
    process.exitCode = 1;
  });
}
