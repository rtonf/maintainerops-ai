import { readFile } from "node:fs/promises";
import { analyzeOffline } from "../offlineAnalyzer.js";
import type { MaintainerWorkItem } from "../types.js";

interface EvalCase {
  name: string;
  item: MaintainerWorkItem;
  expectedLabels: string[];
  maxRisk?: "low" | "medium" | "high" | "critical";
}

const riskOrder = ["low", "medium", "high", "critical"];

async function main(): Promise<void> {
  const raw = await readFile("examples/evals/golden.json", "utf8");
  const cases = JSON.parse(raw) as EvalCase[];
  const failures: string[] = [];

  for (const evalCase of cases) {
    const result = analyzeOffline(evalCase.item);

    for (const label of evalCase.expectedLabels) {
      if (!result.labels.includes(label)) {
        failures.push(`${evalCase.name}: expected label ${label}, got ${result.labels.join(", ")}`);
      }
    }

    if (evalCase.maxRisk && riskOrder.indexOf(result.riskLevel) > riskOrder.indexOf(evalCase.maxRisk)) {
      failures.push(`${evalCase.name}: expected risk <= ${evalCase.maxRisk}, got ${result.riskLevel}`);
    }
  }

  if (failures.length > 0) {
    process.stderr.write(`${failures.join("\n")}\n`);
    process.exitCode = 1;
    return;
  }

  process.stdout.write(`eval passed: ${cases.length} cases\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`eval failed: ${message}\n`);
  process.exitCode = 1;
});
