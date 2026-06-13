import type { MaintainerAssessment } from "./types.js";
import type { RiskLevel } from "./types.js";

const riskLevels: ReadonlySet<RiskLevel> = new Set(["low", "medium", "high", "critical"]);
const recommendedActions: ReadonlySet<MaintainerAssessment["recommendedAction"]> = new Set([
  "needs_human_review",
  "request_changes",
  "ask_for_reproduction",
  "ready_to_merge",
  "needs_security_review",
  "needs_release_manager",
  "close_as_duplicate",
  "needs_more_info"
]);
const evidenceSources = new Set(["title", "body", "diff", "file", "comment", "check", "metadata"]);

export const assessmentJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "summary",
    "riskLevel",
    "confidence",
    "labels",
    "recommendedAction",
    "reviewChecklist",
    "securityNotes",
    "releaseNotes",
    "commentDraft",
    "evidence"
  ],
  properties: {
    summary: {
      type: "string",
      description: "A concise maintainer-facing summary."
    },
    riskLevel: {
      type: "string",
      enum: ["low", "medium", "high", "critical"]
    },
    confidence: {
      type: "number",
      minimum: 0,
      maximum: 1
    },
    labels: {
      type: "array",
      items: { type: "string" }
    },
    recommendedAction: {
      type: "string",
      enum: [
        "needs_human_review",
        "request_changes",
        "ask_for_reproduction",
        "ready_to_merge",
        "needs_security_review",
        "needs_release_manager",
        "close_as_duplicate",
        "needs_more_info"
      ]
    },
    reviewChecklist: {
      type: "array",
      items: { type: "string" }
    },
    securityNotes: {
      type: "array",
      items: { type: "string" }
    },
    releaseNotes: {
      type: "array",
      items: { type: "string" }
    },
    commentDraft: {
      type: "string"
    },
    evidence: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["source", "reference", "note"],
        properties: {
          source: {
            type: "string",
            enum: ["title", "body", "diff", "file", "comment", "check", "metadata"]
          },
          reference: { type: "string" },
          note: { type: "string" }
        }
      }
    }
  }
} as const;

export function assertAssessment(value: unknown): MaintainerAssessment {
  if (!value || typeof value !== "object") {
    throw new Error("Assessment response is not an object.");
  }

  const assessment = value as Partial<MaintainerAssessment>;
  const requiredStringFields = ["summary", "riskLevel", "recommendedAction", "commentDraft"] as const;

  for (const field of requiredStringFields) {
    if (typeof assessment[field] !== "string") {
      throw new Error(`Assessment response is missing string field: ${field}`);
    }
  }

  if (typeof assessment.confidence !== "number") {
    throw new Error("Assessment response is missing numeric field: confidence");
  }

  if (!Number.isFinite(assessment.confidence) || assessment.confidence < 0 || assessment.confidence > 1) {
    throw new Error("Assessment response confidence must be between 0 and 1.");
  }

  if (!riskLevels.has(assessment.riskLevel as RiskLevel)) {
    throw new Error(`Assessment response has invalid riskLevel: ${assessment.riskLevel}`);
  }

  if (!recommendedActions.has(assessment.recommendedAction as MaintainerAssessment["recommendedAction"])) {
    throw new Error(`Assessment response has invalid recommendedAction: ${assessment.recommendedAction}`);
  }

  for (const field of ["labels", "reviewChecklist", "securityNotes", "releaseNotes", "evidence"] as const) {
    if (!Array.isArray(assessment[field])) {
      throw new Error(`Assessment response is missing array field: ${field}`);
    }
  }

  for (const field of ["labels", "reviewChecklist", "securityNotes", "releaseNotes"] as const) {
    const entries = assessment[field];
    if (!Array.isArray(entries) || !entries.every((entry) => typeof entry === "string")) {
      throw new Error(`Assessment response array field must contain only strings: ${field}`);
    }
  }

  const evidence = assessment.evidence;
  if (!Array.isArray(evidence)) {
    throw new Error("Assessment response is missing array field: evidence");
  }

  for (const [index, entry] of evidence.entries()) {
    if (!entry || typeof entry !== "object") {
      throw new Error(`Assessment response evidence entry ${index} is not an object.`);
    }

    if (!evidenceSources.has(entry.source)) {
      throw new Error(`Assessment response evidence entry ${index} has invalid source: ${entry.source}`);
    }

    if (typeof entry.reference !== "string" || typeof entry.note !== "string") {
      throw new Error(`Assessment response evidence entry ${index} is missing string fields.`);
    }
  }

  return assessment as MaintainerAssessment;
}
