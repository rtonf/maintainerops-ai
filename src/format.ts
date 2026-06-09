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

  return [
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
  ].join("\n");
}

function listOrNone(items: string[]): string {
  return items.length > 0 ? items.map((item) => `- ${sanitizeForStdout(item)}`).join("\n") : "- none";
}

function redactWorkItem(item: MaintainerWorkItem): MaintainerWorkItem {
  return JSON.parse(redactSecrets(JSON.stringify(item))) as MaintainerWorkItem;
}

function sanitizeAssessment(assessment: MaintainerAssessment): MaintainerAssessment {
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
    }))
  };
}

function sanitizeForStdout(value: string): string {
  return redactSecrets(value).replace(/^::/gm, "\\::");
}

function safeInline(value: string): string {
  return sanitizeForStdout(value).replace(/\r?\n/g, " ");
}
