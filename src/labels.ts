import type { MaintainerAssessment } from "./types.js";

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
