import { redactSecrets, truncateForModel } from "./redaction.js";
import type { MaintainerWorkItem } from "./types.js";

export function buildAssessmentPrompt(item: MaintainerWorkItem): string {
  const payload = redactSecrets(
    truncateForModel(
      JSON.stringify(
        {
          task: "Assess this open-source maintainer work item.",
          instructions: [
            "Act as a conservative OSS maintainer assistant.",
            "Prioritize human review, security, compatibility, and test coverage.",
            "Do not recommend auto-merge, auto-close, or public security disclosure.",
            "Return only the structured schema requested by the API call.",
            "Use short, actionable language a maintainer can paste into GitHub after review."
          ],
          item
        },
        null,
        2
      )
    )
  );

  return payload;
}
