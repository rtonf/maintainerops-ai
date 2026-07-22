import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ref = "v0.1.15";
const repo = mkdtempSync(join(tmpdir(), "mutable-npm-publish-ref-"));

function git(...args) {
  return execFileSync("git", args, {
    cwd: repo,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

try {
  git("init", "-q");
  git("config", "user.name", "local-ref-probe");
  git("config", "user.email", "local-ref-probe@example.invalid");

  writeFileSync(join(repo, "marker.txt"), "tag target\n");
  git("add", "marker.txt");
  git("commit", "-qm", "base");

  git("branch", ref);
  git("tag", ref);
  git("check-ref-format", `refs/heads/${ref}`);
  git("check-ref-format", `refs/tags/${ref}`);

  git("checkout", "-q", "--detach", `refs/heads/${ref}`);
  writeFileSync(join(repo, "marker.txt"), "branch target\n");
  git("commit", "-qam", "branch moves");
  git("update-ref", `refs/heads/${ref}`, "HEAD");

  const branchCommit = git("rev-parse", `refs/heads/${ref}`);
  const tagCommit = git("rev-parse", `refs/tags/${ref}`);
  const matchingRefs = git("show-ref", ref).split(/\r?\n/).filter(Boolean);

  if (branchCommit === tagCommit || matchingRefs.length !== 2) {
    throw new Error("the test repository did not produce distinct branch and tag refs");
  }

  console.log(`[+] refs/heads/${ref} -> ${branchCommit.slice(0, 12)}`);
  console.log(`[+] refs/tags/${ref}  -> ${tagCommit.slice(0, 12)}`);
  console.log("[+] the same input text is valid for both ref namespaces");
  console.log("[+] no network, Actions runner, OIDC token, or npm publish was used");
} finally {
  rmSync(repo, { recursive: true, force: true });
}
