import { basename } from "node:path";

const testDirectories = new Set(["test", "tests", "__tests__", "spec", "specs"]);

export function isTestLikePath(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, "/").toLowerCase();
  const segments = normalized.split("/").filter(Boolean);

  if (segments.slice(0, -1).some((segment) => testDirectories.has(segment))) {
    return true;
  }

  const fileName = basename(normalized);
  return (
    /(?:^|[._-])tests?(?:[._-]|$)/.test(fileName) ||
    /(?:^|[._-])specs?(?:[._-]|$)/.test(fileName) ||
    /^test_[^.]+/.test(fileName) ||
    /_(?:test|spec)\.[^.]+$/.test(fileName)
  );
}
