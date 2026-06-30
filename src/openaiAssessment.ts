import OpenAI from "openai";
import { assessmentJsonSchema, assertAssessment } from "./schema.js";
import { buildAssessmentPrompt } from "./prompt.js";
import { normalizeAssessmentForWorkItem } from "./labels.js";
import type { MaintainerAssessment, MaintainerWorkItem } from "./types.js";

export interface OpenAIAssessmentUsage {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}

export interface OpenAIAssessmentResult {
  assessment: MaintainerAssessment;
  usage: OpenAIAssessmentUsage;
}

export interface OpenAIAssessmentOptions {
  maxOutputTokens?: number;
}

export async function analyzeWithOpenAI(
  item: MaintainerWorkItem,
  model: string,
  options: OpenAIAssessmentOptions = {}
): Promise<MaintainerAssessment> {
  const result = await analyzeWithOpenAIResult(item, model, options);
  return result.assessment;
}

export async function analyzeWithOpenAIResult(
  item: MaintainerWorkItem,
  model: string,
  options: OpenAIAssessmentOptions = {}
): Promise<OpenAIAssessmentResult> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model,
    max_output_tokens: options.maxOutputTokens,
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

  return {
    assessment: normalizeAssessmentForWorkItem(item, assertAssessment(JSON.parse(output))),
    usage: {
      inputTokens: response.usage?.input_tokens,
      outputTokens: response.usage?.output_tokens,
      totalTokens: response.usage?.total_tokens
    }
  };
}
