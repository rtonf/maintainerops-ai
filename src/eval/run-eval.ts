import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { analyzeOffline } from "../offlineAnalyzer.js";
import type { MaintainerAssessment, MaintainerWorkItem, RiskLevel } from "../types.js";

export interface EvalCase {
  name: string;
  item: MaintainerWorkItem;
  expectedLabels: string[];
  forbiddenLabels?: string[];
  expectedRecommendedAction?: MaintainerAssessment["recommendedAction"];
  minRisk?: RiskLevel;
  maxRisk?: RiskLevel;
  minEvidence?: number;
}

const riskOrder = ["low", "medium", "high", "critical"];

async function main(): Promise<void> {
  const raw = await readFile("examples/evals/golden.json", "utf8");
  const cases = JSON.parse(raw) as unknown;
  if (!Array.isArray(cases)) {
    throw new Error("Offline eval case file must contain an array.");
  }
  const failures = evaluateOfflineCases(cases as EvalCase[]);

  if (failures.length > 0) {
    process.stderr.write(`${failures.join("\n")}\n`);
    process.exitCode = 1;
    return;
  }

  process.stdout.write(`eval passed: ${cases.length} cases\n`);
}

export function evaluateOfflineCases(cases: EvalCase[]): string[] {
  if (cases.length === 0) {
    return ["Offline eval case set must contain at least one case."];
  }

  const failures: string[] = [];

  for (const evalCase of cases) {
    const result = analyzeOffline(evalCase.item);

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

    if (evalCase.minRisk && riskOrder.indexOf(result.riskLevel) < riskOrder.indexOf(evalCase.minRisk)) {
      failures.push(`${evalCase.name}: expected risk >= ${evalCase.minRisk}, got ${result.riskLevel}`);
    }

    if (evalCase.maxRisk && riskOrder.indexOf(result.riskLevel) > riskOrder.indexOf(evalCase.maxRisk)) {
      failures.push(`${evalCase.name}: expected risk <= ${evalCase.maxRisk}, got ${result.riskLevel}`);
    }

    if (evalCase.minEvidence !== undefined && result.evidence.length < evalCase.minEvidence) {
      failures.push(`${evalCase.name}: expected at least ${evalCase.minEvidence} evidence item(s)`);
    }
  }

  return failures;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`eval failed: ${message}\n`);
    process.exitCode = 1;
  });
}
