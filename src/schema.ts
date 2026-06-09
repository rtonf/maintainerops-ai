import type { MaintainerAssessment } from "./types.js";

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

  for (const field of ["labels", "reviewChecklist", "securityNotes", "releaseNotes", "evidence"] as const) {
    if (!Array.isArray(assessment[field])) {
      throw new Error(`Assessment response is missing array field: ${field}`);
    }
  }

  return assessment as MaintainerAssessment;
}
