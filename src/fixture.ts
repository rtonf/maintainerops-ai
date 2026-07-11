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
  const parsed: unknown = JSON.parse(raw);
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

export function validateWorkItem(item: unknown): asserts item is MaintainerWorkItem {
  if (!isRecord(item)) {
    throw new Error("Fixture must be a JSON object.");
  }
  if (typeof item.kind !== "string" || !["pull_request", "issue", "release"].includes(item.kind)) {
    throw new Error("Fixture must include kind: pull_request, issue, or release.");
  }
  if (typeof item.repository !== "string" || item.repository.trim().length === 0) {
    throw new Error("Fixture must include repository.");
  }
  if (typeof item.title !== "string" || item.title.trim().length === 0) {
    throw new Error("Fixture must include title.");
  }

  if (item.number !== undefined && (!Number.isSafeInteger(item.number) || (item.number as number) <= 0)) {
    throw new Error("Fixture number must be a safe positive integer.");
  }

  for (const field of ["author", "body", "url", "diff"] as const) {
    assertOptionalString(item, field);
  }

  assertOptionalStringArray(item, "labels");
  assertOptionalStringArray(item, "comments");

  if (item.files !== undefined) {
    if (!Array.isArray(item.files)) {
      throw new Error("Fixture files must be an array.");
    }
    item.files.forEach(validateChangedFile);
  }

  if (item.checks !== undefined) {
    if (!Array.isArray(item.checks)) {
      throw new Error("Fixture checks must be an array.");
    }
    item.checks.forEach(validateCheckRun);
  }

  if (item.metadata !== undefined && !isRecord(item.metadata)) {
    throw new Error("Fixture metadata must be an object.");
  }
}

function validateChangedFile(value: unknown, index: number): void {
  if (!isRecord(value) || typeof value.path !== "string" || value.path.trim().length === 0) {
    throw new Error(`Fixture files[${index}] must include a path.`);
  }
  if (!new Set(["added", "modified", "removed", "renamed", "unknown"]).has(String(value.status))) {
    throw new Error(`Fixture files[${index}] has an invalid status.`);
  }
  for (const field of ["additions", "deletions"] as const) {
    if (value[field] !== undefined && (!Number.isSafeInteger(value[field]) || (value[field] as number) < 0)) {
      throw new Error(`Fixture files[${index}].${field} must be a non-negative integer.`);
    }
  }
  assertOptionalString(value, "patch", `Fixture files[${index}].patch must be a string.`);
}

function validateCheckRun(value: unknown, index: number): void {
  if (!isRecord(value) || typeof value.name !== "string" || value.name.trim().length === 0) {
    throw new Error(`Fixture checks[${index}] must include a name.`);
  }
  for (const field of ["conclusion", "status", "url"] as const) {
    assertOptionalString(value, field, `Fixture checks[${index}].${field} must be a string.`);
  }
}

function assertOptionalString(record: Record<string, unknown>, field: string, message?: string): void {
  if (record[field] !== undefined && typeof record[field] !== "string") {
    throw new Error(message ?? `Fixture ${field} must be a string.`);
  }
}

function assertOptionalStringArray(record: Record<string, unknown>, field: string): void {
  const value = record[field];
  if (value !== undefined && (!Array.isArray(value) || value.some((entry) => typeof entry !== "string"))) {
    throw new Error(`Fixture ${field} must be an array of strings.`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
