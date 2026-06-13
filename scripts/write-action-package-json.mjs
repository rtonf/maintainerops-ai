import { readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const actionDist = "dist-action";

function removeDeclarations(directory) {
  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      removeDeclarations(fullPath);

      if (readdirSync(fullPath).length === 0) {
        rmSync(fullPath, { recursive: true, force: true });
      }

      continue;
    }

    if (entry.endsWith(".d.ts")) {
      rmSync(fullPath);
    }
  }
}

removeDeclarations(actionDist);
writeFileSync(`${actionDist}/package.json`, `${JSON.stringify({ type: "module" }, null, 2)}\n`);
