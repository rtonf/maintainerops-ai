import { readFile } from "node:fs/promises";
import { analyzeWithOpenAI } from "../openaiAssessment.js";
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
const riskOrder: RiskLevel[] = ["low", "medium", "high", "critical"];

async function main(): Promise<void> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required for model-backed evals.");
  }

  const raw = await readFile("examples/evals/golden.json", "utf8");
  const cases = JSON.parse(raw) as ModelEvalCase[];
  const selected = cases.filter((evalCase) => defaultCaseNames.includes(evalCase.name));
  const model = process.env.OPENAI_MODEL ?? DEFAULT_OPENAI_MODEL;
  const failures: string[] = [];

  for (const evalCase of selected) {
    const result = await analyzeWithOpenAI(evalCase.item, model);

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
        labels: result.labels
      }) + "\n"
    );
  }

  if (failures.length > 0) {
    process.stderr.write(`${failures.join("\n")}\n`);
    process.exitCode = 1;
    return;
  }

  process.stdout.write(`model eval passed: ${selected.length} cases\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`model eval failed: ${message}\n`);
  process.exitCode = 1;
});
