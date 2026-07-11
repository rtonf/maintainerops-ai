import { appendFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

export interface ActionOutputEnvironment {
  GITHUB_OUTPUT?: string;
  GITHUB_STEP_SUMMARY?: string;
}

export async function writeActionReport(
  report: string,
  format: "json" | "markdown",
  env: ActionOutputEnvironment
): Promise<void> {
  if (env.GITHUB_STEP_SUMMARY) {
    const summary = format === "json" ? `# MaintainerOps AI report\n\n\`\`\`json\n${report}\n\`\`\`\n` : `${report}\n`;
    await appendFile(env.GITHUB_STEP_SUMMARY, summary, "utf8");
  }

  if (env.GITHUB_OUTPUT) {
    let delimiter = `maintainerops_${randomUUID()}`;
    while (report.includes(delimiter)) {
      delimiter = `maintainerops_${randomUUID()}`;
    }
    await appendFile(env.GITHUB_OUTPUT, `report<<${delimiter}\n${report}\n${delimiter}\n`, "utf8");
  }
}
