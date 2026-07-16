import type { MaintainerAssessment, MaintainerWorkItem } from "./types.js";
import { redactSecrets } from "./redaction.js";

export function formatAssessment(
  item: MaintainerWorkItem,
  assessment: MaintainerAssessment,
  format: "json" | "markdown"
): string {
  if (format === "json") {
    return JSON.stringify({ item: redactWorkItem(item), assessment: sanitizeAssessment(assessment) }, null, 2);
  }

  const safeItem = redactWorkItem(item);
  const safeAssessment = sanitizeAssessment(assessment);

  const lines = [
    `# MaintainerOps AI report`,
    ``,
    `**Repository:** ${safeInline(safeItem.repository)}`,
    `**Item:** ${safeItem.kind}${safeItem.number ? ` #${safeItem.number}` : ""}`,
    `**Title:** ${safeInline(safeItem.title)}`,
    `**Risk:** ${safeAssessment.riskLevel} (${Math.round(safeAssessment.confidence * 100)}% confidence)`,
    `**Recommended action:** ${safeAssessment.recommendedAction}`,
    ``,
    `## Summary`,
    ``,
    safeAssessment.summary,
    ``,
    `## Suggested labels`,
    ``,
    safeAssessment.labels.length > 0
      ? safeAssessment.labels.map((label) => `- \`${safeInline(label)}\``).join("\n")
      : "- none",
    ``,
    `## Review checklist`,
    ``,
    listOrNone(safeAssessment.reviewChecklist),
    ``,
    `## Security notes`,
    ``,
    listOrNone(safeAssessment.securityNotes),
    ``,
    `## Release notes`,
    ``,
    listOrNone(safeAssessment.releaseNotes),
    ``,
    `## Comment draft`,
    ``,
    safeAssessment.commentDraft || "_No comment draft generated._",
    ``,
    `## Evidence`,
    ``,
    safeAssessment.evidence.length > 0
      ? safeAssessment.evidence
          .map((entry) => `- **${entry.source}:** ${safeInline(entry.reference)} - ${safeInline(entry.note)}`)
          .join("\n")
      : "- none"
  ];

  if (safeAssessment.evidenceAudit) {
    lines.push("", ...formatEvidenceAudit(safeAssessment.evidenceAudit));
  }

  return lines.join("\n");
}

function listOrNone(items: string[]): string {
  return items.length > 0 ? items.map((item) => `- ${sanitizeForStdout(item)}`).join("\n") : "- none";
}

function redactWorkItem(item: MaintainerWorkItem): MaintainerWorkItem {
  const redacted = JSON.parse(redactSecrets(JSON.stringify(item))) as MaintainerWorkItem;
  return {
    kind: redacted.kind,
    repository: redacted.repository,
    number: redacted.number,
    title: redacted.title,
    author: redacted.author,
    url: redacted.url,
    labels: redacted.labels,
    files: redacted.files?.map((file) => ({
      path: file.path,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions
    })),
    checks: redacted.checks?.map((check) => ({
      name: check.name,
      conclusion: check.conclusion,
      status: check.status
    }))
  };
}

function sanitizeAssessment(assessment: MaintainerAssessment): MaintainerAssessment {
  const evidenceAudit = assessment.evidenceAudit
    ? {
        validReferences: assessment.evidenceAudit.validReferences,
        invalidReferences: assessment.evidenceAudit.invalidReferences.map((entry) => ({
          source: entry.source,
          reference: sanitizeForStdout(redactSecrets(entry.reference)),
          reason: sanitizeForStdout(redactSecrets(entry.reason))
        })),
        untrustedInputWarnings: assessment.evidenceAudit.untrustedInputWarnings.map((warning) => ({
          source: warning.source,
          reference: sanitizeForStdout(redactSecrets(warning.reference)),
          pattern: sanitizeForStdout(redactSecrets(warning.pattern))
        }))
      }
    : undefined;

  return {
    ...assessment,
    summary: sanitizeForStdout(redactSecrets(assessment.summary)),
    labels: assessment.labels.map((label) => sanitizeForStdout(redactSecrets(label))),
    reviewChecklist: assessment.reviewChecklist.map((item) => sanitizeForStdout(redactSecrets(item))),
    securityNotes: assessment.securityNotes.map((item) => sanitizeForStdout(redactSecrets(item))),
    releaseNotes: assessment.releaseNotes.map((item) => sanitizeForStdout(redactSecrets(item))),
    commentDraft: sanitizeForStdout(redactSecrets(assessment.commentDraft)),
    evidence: assessment.evidence.map((entry) => ({
      source: entry.source,
      reference: sanitizeForStdout(redactSecrets(entry.reference)),
      note: sanitizeForStdout(redactSecrets(entry.note))
    })),
    ...(evidenceAudit ? { evidenceAudit } : {})
  };
}

function formatEvidenceAudit(audit: NonNullable<MaintainerAssessment["evidenceAudit"]>): string[] {
  const invalidReferences =
    audit.invalidReferences.length > 0
      ? audit.invalidReferences.map(
          (entry) => `  - **${entry.source}:** ${safeInline(entry.reference)} - ${safeInline(entry.reason)}`
        )
      : ["  - none"];
  const warnings =
    audit.untrustedInputWarnings.length > 0
      ? audit.untrustedInputWarnings.map(
          (warning) => `  - **${warning.source} ${safeInline(warning.reference)}:** ${safeInline(warning.pattern)}`
        )
      : ["  - none"];

  return [
    "## Evidence audit",
    "",
    `- **Valid references:** ${audit.validReferences}`,
    `- **Invalid references:** ${audit.invalidReferences.length}`,
    ...invalidReferences,
    `- **Untrusted input warnings:** ${audit.untrustedInputWarnings.length}`,
    ...warnings
  ];
}

function sanitizeForStdout(value: string): string {
  return redactSecrets(value).replace(/##\[/g, "# #[").replace(/::/g, "\\:\\:");
}

function safeInline(value: string): string {
  return sanitizeForStdout(value).replace(/\r?\n/g, " ");
}
