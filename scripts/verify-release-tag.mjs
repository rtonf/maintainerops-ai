import { readFile } from "node:fs/promises";
import { pathToFileURL, URL } from "node:url";

export function verifyReleaseTag(tag, version) {
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(`Stable npm publishing requires a stable semantic version, got ${version}.`);
  }

  const expectedTag = `v${version}`;
  if (tag !== expectedTag) {
    throw new Error(
      `Release tag ${tag || "<missing>"} does not match package version ${version}; expected ${expectedTag}.`
    );
  }
}

async function main() {
  const tag = process.argv[2];
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  verifyReleaseTag(tag, packageJson.version);
  process.stdout.write(`release tag verified: ${tag}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write(
      `release tag verification failed: ${error instanceof Error ? error.message : String(error)}\n`
    );
    process.exitCode = 1;
  });
}
