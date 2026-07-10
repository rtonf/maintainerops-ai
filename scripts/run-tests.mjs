import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const testFiles = [
  ...findFiles("dist", (path) => path.endsWith(".test.js")),
  ...findFiles("scripts", (path) => path.endsWith(".test.mjs"))
].sort();

if (testFiles.length === 0) {
  process.stderr.write("No compiled test files were found. Run npm run build:cli first.\n");
  process.exitCode = 1;
} else {
  const result = spawnSync(process.execPath, ["--test", ...testFiles], { stdio: "inherit" });
  process.exitCode = result.status ?? 1;
}

function findFiles(directory, predicate) {
  if (!existsSync(directory)) {
    return [];
  }

  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...findFiles(path, predicate));
    } else if (predicate(path)) {
      files.push(path);
    }
  }

  return files;
}
