import { readFile } from "node:fs/promises";
import type { MaintainerWorkItem } from "./types.js";

const DEMO_WORK_ITEM: MaintainerWorkItem = {
  kind: "pull_request",
  repository: "example/critical-oss-package",
  number: 1287,
  title: "Harden plugin loader path validation",
  author: "contributor-42",
  body: "This PR rejects plugin paths that traverse outside the configured plugin directory. It also updates the loader error messages.",
  url: "https://github.com/example/critical-oss-package/pull/1287",
  labels: ["bugfix"],
  files: [
    {
      path: "src/plugins/loader.ts",
      status: "modified",
      additions: 34,
      deletions: 12,
      patch:
        "- const resolved = path.resolve(root, requested);\n+ const resolved = safeResolveWithin(root, requested);\n+ if (!resolved.startsWith(root)) throw new Error('invalid plugin path');"
    },
    {
      path: "src/plugins/safe-resolve.ts",
      status: "added",
      additions: 52,
      deletions: 0,
      patch:
        "+ export function safeResolveWithin(root: string, requested: string) {\n+   return path.resolve(root, requested);\n+ }"
    }
  ],
  checks: [
    {
      name: "test",
      status: "completed",
      conclusion: "success"
    }
  ]
};

export async function loadFixture(path: string): Promise<MaintainerWorkItem> {
  const raw = await readFile(path, "utf8");
  const parsed = JSON.parse(raw) as MaintainerWorkItem;
  validateWorkItem(parsed);
  return parsed;
}

export function loadDemoFixture(): MaintainerWorkItem {
  return {
    ...DEMO_WORK_ITEM,
    labels: [...(DEMO_WORK_ITEM.labels ?? [])],
    files: DEMO_WORK_ITEM.files?.map((file) => ({ ...file })),
    checks: DEMO_WORK_ITEM.checks?.map((check) => ({ ...check }))
  };
}

export function validateWorkItem(item: MaintainerWorkItem): void {
  if (!item.kind || !["pull_request", "issue", "release"].includes(item.kind)) {
    throw new Error("Fixture must include kind: pull_request, issue, or release.");
  }
  if (!item.repository || typeof item.repository !== "string") {
    throw new Error("Fixture must include repository.");
  }
  if (!item.title || typeof item.title !== "string") {
    throw new Error("Fixture must include title.");
  }
}
