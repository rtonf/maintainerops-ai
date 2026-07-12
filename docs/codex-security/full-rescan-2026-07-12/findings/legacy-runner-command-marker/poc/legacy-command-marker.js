"use strict";

const payload = "routine change ##[add-mask]attacker-value";
const reportLine = `pull request "${payload}" needs maintainer review.`;

function vulnerableSanitizeForStdout(value) {
  return value.replace(/^::/gm, "\\::");
}

function proposedSanitizeForStdout(value) {
  return value.replace(/::/g, ": :").replace(/##\[/g, "# #[");
}

const vulnerableOutput = vulnerableSanitizeForStdout(reportLine);
if (!vulnerableOutput.includes("##[add-mask]")) {
  throw new Error("the local reproduction did not preserve the legacy marker");
}

const proposedOutput = proposedSanitizeForStdout(reportLine);
if (proposedOutput.includes("##[") || proposedOutput.includes("::")) {
  throw new Error("the proposed escaping left a runner marker in the output");
}

console.log(`[+] input: ${payload}`);
console.log(`[+] vulnerable output: ${vulnerableOutput}`);
console.log(`[+] legacy marker survived at offset ${vulnerableOutput.indexOf("##[")}`);
console.log(`[+] proposed output: ${proposedOutput}`);
console.log("[+] no network, GitHub API, or runner was contacted");
