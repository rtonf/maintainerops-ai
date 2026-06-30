import type { MaintainerAssessment, MaintainerWorkItem } from "./types.js";

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

  if (item.kind === "issue" && isFeedbackRequest(item) && normalized.riskLevel === "low") {
    labels.delete("security-review");
    labels.delete("release-notes");
  }

  const riskLevel =
    item.kind === "issue" && isFeedbackRequest(item) && normalized.recommendedAction !== "needs_security_review"
      ? "low"
      : normalized.riskLevel;

  if (riskLevel === "low" && item.kind === "issue" && isFeedbackRequest(item)) {
    labels.delete("security-review");
    labels.delete("release-notes");
  }

  return {
    ...normalized,
    riskLevel,
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
  return (item.files ?? []).some((file) => {
    const path = file.path.toLowerCase();
    return path.includes("test") || path.includes("spec") || path.includes("__tests__");
  });
}

function isFeedbackRequest(item: MaintainerWorkItem): boolean {
  const text = `${item.title}\n${item.body ?? ""}`.toLowerCase();
  return (
    /\bfeedback (?:wanted|request(?:ed)?|welcome)\b/.test(text) ||
    /\bexternal (?:maintainer|tester)s?\b/.test(text) ||
    /\bplease (?:try|test) (?:this|the) (?:npm package|github action|cli|marketplace action)\b/.test(text)
  );
}
