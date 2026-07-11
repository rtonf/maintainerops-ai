import type { MaintainerAssessment, MaintainerWorkItem } from "./types.js";
import { isTestLikePath } from "./fileSignals.js";

const canonicalLabels = new Set([
  "needs-triage",
  "maintainer-review",
  "security-review",
  "release-notes",
  "tests-needed",
  "large-change"
]);

const labelAliases = new Map<string, string>([
  ["triage", "needs-triage"],
  ["needs_triage", "needs-triage"],
  ["needs triage", "needs-triage"],
  ["feedback", "needs-triage"],
  ["maintainer review", "maintainer-review"],
  ["maintainer_review", "maintainer-review"],
  ["review", "maintainer-review"],
  ["security", "security-review"],
  ["security review", "security-review"],
  ["security_review", "security-review"],
  ["needs security review", "security-review"],
  ["needs_security_review", "security-review"],
  ["release notes", "release-notes"],
  ["release_notes", "release-notes"],
  ["release", "release-notes"],
  ["tests", "tests-needed"],
  ["test-needed", "tests-needed"],
  ["test needed", "tests-needed"],
  ["tests needed", "tests-needed"],
  ["tests_needed", "tests-needed"],
  ["needs tests", "tests-needed"],
  ["needs_tests", "tests-needed"],
  ["large change", "large-change"],
  ["large_change", "large-change"]
]);

export function normalizeAssessmentLabels(assessment: MaintainerAssessment): MaintainerAssessment {
  const labels = assessment.labels.flatMap((label) => normalizeLabel(label)).filter(Boolean);
  return {
    ...assessment,
    labels: [...new Set(labels)]
  };
}

export function normalizeAssessmentForWorkItem(
  item: MaintainerWorkItem,
  assessment: MaintainerAssessment
): MaintainerAssessment {
  const normalized = normalizeAssessmentLabels(assessment);
  const labels = new Set(normalized.labels);

  labels.add(item.kind === "issue" ? "needs-triage" : "maintainer-review");

  if (item.kind === "pull_request" && !hasTestLikeFile(item)) {
    labels.add("tests-needed");
  }

  if (hasReleaseReadinessSignal(item)) {
    labels.add("release-notes");
  }

  if (hasDependencyReviewSignal(item)) {
    labels.add("security-review");
    labels.add("release-notes");
  }

  if (hasActionableSecurityIssueSignal(item)) {
    labels.add("security-review");
  }

  if (item.kind === "issue" && isFeedbackRequest(item) && normalized.riskLevel === "low") {
    labels.delete("security-review");
    labels.delete("release-notes");
  }

  const riskLevel =
    (shouldCapIssueRisk(item, normalized) || isMetadataMaintenanceIssue(item)) &&
    normalized.recommendedAction !== "needs_security_review"
      ? "low"
      : normalized.riskLevel;

  const recommendedAction = normalizeRecommendedActionForWorkItem(item, normalized.recommendedAction);

  if (riskLevel === "low" && item.kind === "issue" && isFeedbackRequest(item)) {
    labels.delete("security-review");
    labels.delete("release-notes");
  }

  return {
    ...normalized,
    riskLevel,
    recommendedAction,
    labels: [...labels]
  };
}

export function normalizeLabel(label: string): string[] {
  const normalized = label.trim().toLowerCase().replace(/\s+/g, " ");
  if (!normalized) return [];

  const direct = canonicalLabels.has(normalized) ? normalized : labelAliases.get(normalized);
  if (direct) return [direct];

  const underscoreNormalized = normalized.replace(/_/g, " ");
  const underscoreAlias = labelAliases.get(underscoreNormalized);
  if (underscoreAlias) return [underscoreAlias];

  return [normalized.replace(/\s+/g, "-").replace(/_+/g, "-")];
}

function hasTestLikeFile(item: MaintainerWorkItem): boolean {
  return (item.files ?? []).some((file) => isTestLikePath(file.path));
}

function isFeedbackRequest(item: MaintainerWorkItem): boolean {
  const text = `${item.title}\n${item.body ?? ""}`.toLowerCase();
  return (
    /\bfeedback (?:wanted|request(?:ed)?|welcome)\b/.test(text) ||
    /\bexternal (?:maintainer|tester)s?\b/.test(text) ||
    /\bplease (?:try|test) (?:this|the) (?:npm package|github action|cli|marketplace action)\b/.test(text)
  );
}

function hasReleaseReadinessSignal(item: MaintainerWorkItem): boolean {
  const text = `${item.title}\n${item.body ?? ""}`.toLowerCase();
  return (
    /\brelease readiness\b/.test(text) ||
    /\brelease notes?\b/.test(text) ||
    /\bprepare release\b/.test(text) ||
    /\bmaintainer checklist\b/.test(text) ||
    /\blatest intended action release\b/.test(text) ||
    /\bmarketplace action listing\b/.test(text)
  );
}

function hasDependencyReviewSignal(item: MaintainerWorkItem): boolean {
  if (item.kind !== "pull_request") return false;
  const text =
    `${item.title}\n${item.body ?? ""}\n${(item.files ?? []).map((file) => file.path).join("\n")}`.toLowerCase();
  return (
    /\bdependency update\b/.test(text) ||
    /\bbump\b/.test(text) ||
    /\bupgrade\b/.test(text) ||
    text.includes("package-lock.json") ||
    text.includes("package.json") ||
    text.includes("gradle-wrapper") ||
    text.includes("gradlew")
  );
}

function hasActionableSecurityIssueSignal(item: MaintainerWorkItem): boolean {
  const text = `${item.title}\n${item.body ?? ""}`.toLowerCase();
  return (
    item.kind === "issue" &&
    !isFeedbackRequest(item) &&
    (/\bprompt[- ]injection\b/.test(text) ||
      /\breveal secrets?\b/.test(text) ||
      /\bexecute unauthorized actions?\b/.test(text) ||
      /\bsecurity\b/.test(text))
  );
}

function shouldCapIssueRisk(item: MaintainerWorkItem, assessment: MaintainerAssessment): boolean {
  return (
    item.kind === "issue" &&
    (isFeedbackRequest(item) || (hasReleaseReadinessSignal(item) && !hasActionableSecurityIssueSignal(item))) &&
    assessment.recommendedAction !== "needs_security_review"
  );
}

function isMetadataMaintenanceIssue(item: MaintainerWorkItem): boolean {
  const text = `${item.title}\n${item.body ?? ""}`.toLowerCase();
  return (
    item.kind === "issue" && /\blicense detection\b/.test(text) && /\bmetadata\b|\bspdx\b|\bnoassertion\b/.test(text)
  );
}

function normalizeRecommendedActionForWorkItem(
  item: MaintainerWorkItem,
  action: MaintainerAssessment["recommendedAction"]
): MaintainerAssessment["recommendedAction"] {
  if (hasDirectSecurityReviewSignal(item)) {
    return "needs_security_review";
  }

  if (item.kind === "issue" && (action === "ready_to_merge" || action === "request_changes")) {
    return "needs_human_review";
  }

  return action;
}

function hasDirectSecurityReviewSignal(item: MaintainerWorkItem): boolean {
  const text = `${item.title}\n${item.body ?? ""}`.toLowerCase();
  return (
    /\bbypass\b/.test(text) ||
    /\bmissing\b.{0,40}\b(?:auth|authorization|permission|check)\b/.test(text) ||
    /\b(?:auth|authorization|permission|token)\b.{0,40}\b(?:bypass|missing|not enforced)\b/.test(text)
  );
}
