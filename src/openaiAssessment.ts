import OpenAI from "openai";
import { assessmentJsonSchema, assertAssessment } from "./schema.js";
import { buildAssessmentPrompt } from "./prompt.js";
import type { MaintainerAssessment, MaintainerWorkItem } from "./types.js";

export async function analyzeWithOpenAI(item: MaintainerWorkItem, model: string): Promise<MaintainerAssessment> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model,
    input: [
      {
        role: "system",
        content:
          "You are MaintainerOps AI, a human-in-the-loop assistant for public open-source maintainers. You produce conservative, evidence-based triage and review packets."
      },
      {
        role: "user",
        content: buildAssessmentPrompt(item)
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "maintainer_assessment",
        strict: true,
        schema: assessmentJsonSchema
      }
    }
  });

  const output = response.output_text;
  if (!output) {
    throw new Error("OpenAI response did not include output_text.");
  }

  return assertAssessment(JSON.parse(output));
}
