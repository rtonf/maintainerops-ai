import { readFile } from "node:fs/promises";
import type { MaintainerWorkItem } from "./types.js";

export async function loadFixture(path: string): Promise<MaintainerWorkItem> {
  const raw = await readFile(path, "utf8");
  const parsed = JSON.parse(raw) as MaintainerWorkItem;
  validateWorkItem(parsed);
  return parsed;
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
