import type { EvidenceItem, MaintainerAssessment, MaintainerWorkItem } from "./types.js";

type EvidenceAudit = NonNullable<MaintainerAssessment["evidenceAudit"]>;
type UntrustedInputWarning = EvidenceAudit["untrustedInputWarnings"][number];

const untrustedInstructionPatterns: ReadonlyArray<{
  pattern: string;
  expressions: readonly RegExp[];
}> = [
  {
    pattern: "ignore previous/system instructions",
    expressions: [
      /\bignore\s+(?:all\s+|any\s+|the\s+)?(?:previous|prior|above|system|developer)\s+(?:system\s+|developer\s+)?(?:instructions?|prompts?|messages?|rules?)\b/i,
      /\b(?:disregard|override|bypass)\s+(?:all\s+|any\s+|the\s+)?(?:previous|prior|above|system|developer)\s+(?:instructions?|prompts?|messages?|rules?)\b/i,
      /\b(?:ignore|disregard|override)\s+(?:all\s+|any\s+|the\s+)?(?:system|developer)(?:'s)?\s+(?:polic(?:y|ies)|rules?|instructions?)\b/i
    ]
  },
  {
    pattern: "reveal/exfiltrate secrets",
    expressions: [
      /\b(?:reveal|show|print|expose|leak|exfiltrat(?:e|ion)|send|upload)\b[\s\S]{0,80}\b(?:secrets?|tokens?|passwords?|credentials?|api[-_ ]?keys?|environment variables?|env vars?)\b/i,
      /\b(?:secrets?|tokens?|passwords?|credentials?|api[-_ ]?keys?|environment variables?|env vars?)\b[\s\S]{0,80}\b(?:reveal|show|print|expose|leak|exfiltrat(?:e|ion)|send|upload)\b/i,
      /\b(?:reveal|show|print|expose|leak|exfiltrat(?:e|ion)|send|upload)\b[\s\S]{0,80}\b[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*_(?:API_KEY|TOKEN|SECRET|PASSWORD|CREDENTIALS?)\b/i
    ]
  },
  {
    pattern: "execute/run commands",
    expressions: [
      /\b(?:execute|run|invoke|launch)\s+(?:(?:this|the|these|following)\s+){0,2}(?:commands?|shell|scripts?|powershell|bash|cmd(?:\.exe)?|terminal)\b/i,
      /\b(?:execute|run)\s+(?:sudo\s+)?(?:rm|curl|wget|bash|sh|powershell|cmd(?:\.exe)?|python|node|npm|npx|pnpm|yarn|git)\b/i,
      /(?:^|[.!?;:,]\s*|\b(?:and|then|please)\s+)\b(?:execute|run)\s+(?:a|an|the)\s+(?:shell\s+)?commands?\b/i,
      /\b(?:open|start)\s+(?:a\s+|the\s+)?(?:shell|terminal)\b/i
    ]
  }
];

export function addEvidenceAudit(item: MaintainerWorkItem, assessment: MaintainerAssessment): MaintainerAssessment {
  return {
    ...assessment,
    evidenceAudit: auditEvidence(item, assessment.evidence)
  };
}

export function auditEvidence(item: MaintainerWorkItem, evidence: readonly EvidenceItem[]): EvidenceAudit {
  const invalidReferences: EvidenceAudit["invalidReferences"] = [];
  let validReferences = 0;

  for (const entry of evidence) {
    const reason = invalidReferenceReason(item, entry);
    if (reason) {
      invalidReferences.push({
        source: entry.source,
        reference: entry.reference,
        reason
      });
    } else {
      validReferences += 1;
    }
  }

  return {
    validReferences,
    invalidReferences,
    untrustedInputWarnings: detectUntrustedInputWarnings(item)
  };
}

export function detectUntrustedInputWarnings(item: MaintainerWorkItem): UntrustedInputWarning[] {
  const inputs: Array<{
    source: UntrustedInputWarning["source"];
    reference: string;
    text: string;
  }> = [];

  if (typeof item.body === "string") {
    inputs.push({ source: "body", reference: "body", text: item.body });
  }

  if (typeof item.diff === "string") {
    inputs.push({ source: "diff", reference: "diff", text: item.diff });
  }

  for (const [index, comment] of (item.comments ?? []).entries()) {
    inputs.push({ source: "comment", reference: `comment:${index + 1}`, text: comment });
  }

  return inputs.flatMap((input) =>
    untrustedInstructionPatterns
      .filter(({ expressions }) => expressions.some((expression) => expression.test(input.text)))
      .map(({ pattern }) => ({
        source: input.source,
        reference: input.reference,
        pattern
      }))
  );
}

function invalidReferenceReason(item: MaintainerWorkItem, evidence: EvidenceItem): string | null {
  switch (evidence.source) {
    case "title":
      return evidence.reference === "title" || evidence.reference === item.title
        ? null
        : 'Expected the canonical reference "title" or the exact title value.';
    case "body":
      if (typeof item.body !== "string") return "The work item does not contain a body field.";
      return evidence.reference === "body" || evidence.reference === item.body
        ? null
        : 'Expected the canonical reference "body" or the exact body value.';
    case "diff":
      if (typeof item.diff !== "string") return "The work item does not contain a diff field.";
      return evidence.reference === "diff" || evidence.reference === item.diff
        ? null
        : 'Expected the canonical reference "diff" or the exact diff value.';
    case "file":
      return (item.files ?? []).some((file) => file.path === evidence.reference)
        ? null
        : "Reference does not match a changed file path.";
    case "comment":
      return commentReferenceReason(item, evidence.reference);
    case "check":
      return (item.checks ?? []).some((check) => check.name === evidence.reference)
        ? null
        : "Reference does not match a check name.";
    case "metadata":
      return item.metadata && Object.prototype.hasOwnProperty.call(item.metadata, evidence.reference)
        ? null
        : "Reference does not match a metadata key.";
  }
}

function commentReferenceReason(item: MaintainerWorkItem, reference: string): string | null {
  const match = /^comment:([1-9]\d*)$/.exec(reference);
  if (!match) {
    return 'Expected a 1-based comment reference such as "comment:1".';
  }

  const index = Number(match[1]) - 1;
  return index < (item.comments?.length ?? 0) ? null : "Comment reference is outside the available comment range.";
}
