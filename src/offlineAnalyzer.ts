import type { MaintainerAssessment, MaintainerWorkItem, RiskLevel } from "./types.js";
import { isTestLikePath } from "./fileSignals.js";
import { addEvidenceAudit } from "./evidenceAudit.js";

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
  "dependency update",
  "gradle-wrapper",
  "wrapper",
  "path validation",
  "path traversal",
  "traverse",
  "rce",
  "ssrf",
  "plugin loader"
];

const actionableSecurityPatterns = [
  /\bbypass\b/,
  /\bexploit\b/,
  /\bvulnerability\b/,
  /\bcve-\d{4}-\d+\b/,
  /\bleak(?:ed|s|ing)?\b/,
  /\bexposed\b/,
  /\bpath traversal\b/,
  /\brce\b/,
  /\bssrf\b/,
  /\bxss\b/,
  /\bcsrf\b/,
  /\bsql injection\b/,
  /\bprompt[- ]injection\b/,
  /\bunauthorized\b/,
  /\b(?:missing|absent)\b.{0,40}\b(?:auth(?:entication|orization)?|permission|validation|check)\b/,
  /\bwithout\b.{0,40}\b(?:auth(?:entication|orization)?|permission|validation)\s+(?:check|enforcement|guard)\b/,
  /\b(?:auth(?:entication|orization)?|permission|validation|check)\b.{0,40}\b(?:missing|absent|not enforced)\b/
];
const feedbackRequestPatterns = [
  /\bfeedback (?:wanted|request(?:ed)?|welcome)\b/,
  /\bexternal (?:maintainer|tester)s?\b/,
  /\bplease (?:try|test) (?:this|the) (?:npm package|github action|cli|marketplace action)\b/,
  /\bfound (?:this|it) (?:through|on) (?:github )?marketplace\b/
];
const releaseTerms = ["breaking", "migration", "deprecated", "remove", "major", "release", "bump", "upgrade"];
const MAX_SEARCHABLE_CHARS = 1_000_000;

export function analyzeOffline(item: MaintainerWorkItem): MaintainerAssessment {
  const searchable = buildSearchableText(item);

  const touchedFiles = item.files ?? [];
  const hasRawSecuritySignal = securityTerms.some((term) => searchable.includes(term));
  const isFeedbackRequest =
    item.kind === "issue" && feedbackRequestPatterns.some((pattern) => pattern.test(searchable));
  const hasActionableSecuritySignal = actionableSecurityPatterns.some((pattern) => pattern.test(searchable));
  const hasSecuritySignal = hasRawSecuritySignal && (!isFeedbackRequest || hasActionableSecuritySignal);
  const hasReleaseSignal = !isFeedbackRequest && releaseTerms.some((term) => searchable.includes(term));
  const hasTests = touchedFiles.some((file) => isTestLikePath(file.path));
  const sourceFiles = touchedFiles.filter((file) => !isTestLikePath(file.path));
  const largeChange =
    touchedFiles.length > 12 ||
    sourceFiles.reduce((sum, file) => sum + (file.additions ?? 0) + (file.deletions ?? 0), 0) > 500;

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
    checklist.push(
      hasTests
        ? "Verify the added or updated tests cover the changed behavior."
        : "Ask for tests or explain why tests are not needed."
    );
  }

  if (item.kind === "issue" && isFeedbackRequest) {
    checklist.push("Collect whether install, CLI execution, or Action setup worked for the external tester.");
    checklist.push("Capture what was useful, noisy, unclear, or missing for a real maintainer workflow.");
  } else if (item.kind === "issue") {
    checklist.push("Confirm reproduction steps, expected behavior, actual behavior, and affected versions.");
  }

  if (hasSecuritySignal) {
    checklist.push("Route to a maintainer with security context before merging or closing.");
  }

  const securityNotes = hasSecuritySignal
    ? [
        "Security-sensitive terms were detected. Validate auth boundaries, secret handling, and attacker-controlled inputs before taking action."
      ]
    : ["No obvious security-sensitive terms were detected by offline heuristics."];

  const releaseNotes = hasReleaseSignal
    ? [`Candidate release note: ${item.title}`]
    : item.kind === "pull_request"
      ? ["No release-note trigger detected. Confirm whether the change affects users."]
      : [];

  const assessment: MaintainerAssessment = {
    summary: buildSummary(item, hasSecuritySignal, hasTests, largeChange),
    riskLevel,
    confidence: 0.55,
    labels: [...labels],
    recommendedAction: recommendedAction(item, hasSecuritySignal, hasTests, largeChange),
    reviewChecklist: checklist,
    securityNotes,
    releaseNotes,
    commentDraft: buildCommentDraft(item, hasSecuritySignal, hasTests, isFeedbackRequest),
    evidence: buildEvidence(item, hasSecuritySignal, hasTests, largeChange)
  };

  return addEvidenceAudit(item, assessment);
}

function buildSearchableText(item: MaintainerWorkItem): string {
  const parts = [
    item.title,
    item.body,
    ...(item.comments ?? []),
    ...(item.files?.flatMap((file) => [file.path, file.patch]) ?? []),
    item.files?.some((file) => file.patch) ? undefined : item.diff
  ];
  const bounded: string[] = [];
  let remaining = MAX_SEARCHABLE_CHARS;

  for (const part of parts) {
    if (!part || remaining <= 0) continue;
    const slice = part.slice(0, remaining);
    bounded.push(slice);
    remaining -= slice.length + 1;
  }

  return bounded.join("\n").toLowerCase();
}

function buildSummary(
  item: MaintainerWorkItem,
  hasSecuritySignal: boolean,
  hasTests: boolean,
  largeChange: boolean
): string {
  const parts = [`${item.kind.replace("_", " ")} "${item.title}" needs maintainer review.`];
  if (hasSecuritySignal) parts.push("It touches security-sensitive language or paths.");
  if (largeChange) parts.push("The change is large enough to deserve extra review time.");
  if (item.kind === "pull_request" && !hasTests) parts.push("No test file was detected in the changed file list.");
  return parts.join(" ");
}

function recommendedAction(
  item: MaintainerWorkItem,
  hasSecuritySignal: boolean,
  hasTests: boolean,
  largeChange: boolean
): MaintainerAssessment["recommendedAction"] {
  if (hasSecuritySignal) return "needs_security_review";
  if (item.kind === "issue") return "needs_more_info";
  if (!hasTests || largeChange) return "needs_human_review";
  return "ready_to_merge";
}

function buildCommentDraft(
  item: MaintainerWorkItem,
  hasSecuritySignal: boolean,
  hasTests: boolean,
  isFeedbackRequest: boolean
): string {
  if (item.kind === "issue" && isFeedbackRequest) {
    return "Thanks for trying MaintainerOps AI. Could you share whether install or Action setup worked, what repository or fixture you used, and what was useful, noisy, unclear, or missing?";
  }

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

function buildEvidence(
  item: MaintainerWorkItem,
  hasSecuritySignal: boolean,
  hasTests: boolean,
  largeChange: boolean
): MaintainerAssessment["evidence"] {
  const evidence: MaintainerAssessment["evidence"] = [
    { source: "title", reference: item.title, note: "Used as the primary maintainer-facing context." }
  ];

  if (hasSecuritySignal) {
    const securityEvidence = findSecurityEvidence(item);
    if (securityEvidence) evidence.push(securityEvidence);
  }

  if (item.kind === "pull_request" && item.files?.[0]) {
    evidence.push({
      source: "file",
      reference: item.files[0].path,
      note: hasTests
        ? `At least one test-like path was detected across ${item.files.length} changed files.`
        : `No test-like path was detected across ${item.files.length} changed files.`
    });
  }

  if (largeChange) {
    evidence.push({
      source: item.files?.[0] ? "file" : "title",
      reference: item.files?.[0]?.path ?? item.title,
      note: "The offline analyzer classified this as a large change."
    });
  }

  return evidence;
}

function findSecurityEvidence(item: MaintainerWorkItem): MaintainerAssessment["evidence"][number] | undefined {
  if (containsSecurityTerm(item.title)) {
    return {
      source: "title",
      reference: item.title,
      note: "Security-sensitive language was detected in the title."
    };
  }

  if (typeof item.body === "string" && containsSecurityTerm(item.body)) {
    return {
      source: "body",
      reference: "body",
      note: "Security-sensitive language was detected in the body."
    };
  }

  for (const [index, comment] of (item.comments ?? []).entries()) {
    if (containsSecurityTerm(comment)) {
      return {
        source: "comment",
        reference: `comment:${index + 1}`,
        note: "Security-sensitive language was detected in a comment."
      };
    }
  }

  for (const file of item.files ?? []) {
    if (containsSecurityTerm(file.path) || (typeof file.patch === "string" && containsSecurityTerm(file.patch))) {
      return {
        source: "file",
        reference: file.path,
        note: "Security-sensitive language was detected in a changed file path or patch."
      };
    }
  }

  if (typeof item.diff === "string" && containsSecurityTerm(item.diff)) {
    return {
      source: "diff",
      reference: "diff",
      note: "Security-sensitive language was detected in the diff."
    };
  }

  return undefined;
}

function containsSecurityTerm(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    securityTerms.some((term) => normalized.includes(term)) ||
    actionableSecurityPatterns.some((pattern) => pattern.test(normalized))
  );
}
