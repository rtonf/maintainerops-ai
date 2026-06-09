import type { MaintainerAssessment, MaintainerWorkItem, RiskLevel } from "./types.js";

const securityTerms = [
  "auth",
  "authorization",
  "csrf",
  "xss",
  "sql",
  "injection",
  "token",
  "secret",
  "crypto",
  "permission",
  "sandbox",
  "path validation",
  "path traversal",
  "traverse",
  "rce",
  "ssrf",
  "plugin loader"
];

const releaseTerms = ["breaking", "migration", "deprecated", "remove", "major", "release"];
const testTerms = ["test", "spec", "__tests__", ".test.", ".spec."];

export function analyzeOffline(item: MaintainerWorkItem): MaintainerAssessment {
  const searchable = [
    item.title,
    item.body,
    item.diff,
    ...(item.files?.map((file) => `${file.path}\n${file.patch ?? ""}`) ?? []),
    ...(item.comments ?? [])
  ]
    .filter(Boolean)
    .join("\n")
    .toLowerCase();

  const touchedFiles = item.files ?? [];
  const hasSecuritySignal = securityTerms.some((term) => searchable.includes(term));
  const hasReleaseSignal = releaseTerms.some((term) => searchable.includes(term));
  const hasTests = touchedFiles.some((file) => testTerms.some((term) => file.path.toLowerCase().includes(term)));
  const sourceFiles = touchedFiles.filter((file) => !testTerms.some((term) => file.path.toLowerCase().includes(term)));
  const largeChange = touchedFiles.length > 12 || sourceFiles.reduce((sum, file) => sum + (file.additions ?? 0) + (file.deletions ?? 0), 0) > 500;

  const riskLevel: RiskLevel = hasSecuritySignal ? (largeChange ? "critical" : "high") : largeChange ? "medium" : "low";
  const labels = new Set<string>();
  labels.add(item.kind === "issue" ? "needs-triage" : "maintainer-review");

  if (hasSecuritySignal) labels.add("security-review");
  if (hasReleaseSignal) labels.add("release-notes");
  if (!hasTests && item.kind === "pull_request") labels.add("tests-needed");
  if (largeChange) labels.add("large-change");

  const checklist = [
    "Confirm the change matches the project maintenance policy.",
    "Check whether the description includes user impact and rollback notes."
  ];

  if (item.kind === "pull_request") {
    checklist.push("Review changed files for behavior, compatibility, and test coverage.");
    checklist.push(hasTests ? "Verify the added or updated tests cover the changed behavior." : "Ask for tests or explain why tests are not needed.");
  }

  if (item.kind === "issue") {
    checklist.push("Confirm reproduction steps, expected behavior, actual behavior, and affected versions.");
  }

  if (hasSecuritySignal) {
    checklist.push("Route to a maintainer with security context before merging or closing.");
  }

  const securityNotes = hasSecuritySignal
    ? ["Security-sensitive terms were detected. Validate auth boundaries, secret handling, and attacker-controlled inputs before taking action."]
    : ["No obvious security-sensitive terms were detected by offline heuristics."];

  const releaseNotes = hasReleaseSignal
    ? [`Candidate release note: ${item.title}`]
    : item.kind === "pull_request"
      ? ["No release-note trigger detected. Confirm whether the change affects users."]
      : [];

  return {
    summary: buildSummary(item, hasSecuritySignal, hasTests, largeChange),
    riskLevel,
    confidence: 0.55,
    labels: [...labels],
    recommendedAction: recommendedAction(item, hasSecuritySignal, hasTests, largeChange),
    reviewChecklist: checklist,
    securityNotes,
    releaseNotes,
    commentDraft: buildCommentDraft(item, hasSecuritySignal, hasTests),
    evidence: buildEvidence(item, hasSecuritySignal, hasTests, largeChange)
  };
}

function buildSummary(item: MaintainerWorkItem, hasSecuritySignal: boolean, hasTests: boolean, largeChange: boolean): string {
  const parts = [`${item.kind.replace("_", " ")} "${item.title}" needs maintainer review.`];
  if (hasSecuritySignal) parts.push("It touches security-sensitive language or paths.");
  if (largeChange) parts.push("The change is large enough to deserve extra review time.");
  if (item.kind === "pull_request" && !hasTests) parts.push("No test file was detected in the changed file list.");
  return parts.join(" ");
}

function recommendedAction(item: MaintainerWorkItem, hasSecuritySignal: boolean, hasTests: boolean, largeChange: boolean): MaintainerAssessment["recommendedAction"] {
  if (hasSecuritySignal) return "needs_security_review";
  if (item.kind === "issue") return "needs_more_info";
  if (!hasTests || largeChange) return "needs_human_review";
  return "ready_to_merge";
}

function buildCommentDraft(item: MaintainerWorkItem, hasSecuritySignal: boolean, hasTests: boolean): string {
  if (item.kind === "issue") {
    return "Thanks for the report. Could you add reproduction steps, affected version, expected behavior, and actual behavior so maintainers can triage this accurately?";
  }

  const requests = [];
  if (!hasTests) requests.push("add tests or explain why this change is not testable");
  if (hasSecuritySignal) requests.push("call out the security boundary and any attacker-controlled inputs");

  if (requests.length === 0) {
    return "Thanks for the PR. The next step is maintainer review of the implementation and CI results.";
  }

  return `Thanks for the PR. Before maintainer approval, please ${requests.join(" and ")}.`;
}

function buildEvidence(item: MaintainerWorkItem, hasSecuritySignal: boolean, hasTests: boolean, largeChange: boolean): MaintainerAssessment["evidence"] {
  const evidence: MaintainerAssessment["evidence"] = [
    { source: "title", reference: item.title, note: "Used as the primary maintainer-facing context." }
  ];

  if (hasSecuritySignal) {
    evidence.push({ source: "metadata", reference: "security term scan", note: "Security-sensitive terms were present in title, body, diff, comments, or file paths." });
  }

  if (item.kind === "pull_request") {
    evidence.push({
      source: "file",
      reference: `${item.files?.length ?? 0} changed files`,
      note: hasTests ? "At least one test-like path was detected." : "No test-like path was detected."
    });
  }

  if (largeChange) {
    evidence.push({ source: "metadata", reference: "change size", note: "The offline analyzer classified this as a large change." });
  }

  return evidence;
}
