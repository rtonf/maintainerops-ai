import { loadFixture } from "./fixture.js";
import { fetchIssueWorkItem, fetchPullRequestWorkItem } from "./github.js";
import { analyzeOffline } from "./offlineAnalyzer.js";
import { analyzeWithOpenAI } from "./openaiAssessment.js";
import type { AnalyzeOptions, MaintainerAssessment, MaintainerWorkItem } from "./types.js";

export async function resolveWorkItem(input: {
  fixture?: string;
  repo?: string;
  pull?: number;
  issue?: number;
}): Promise<MaintainerWorkItem> {
  if (input.fixture) {
    return loadFixture(input.fixture);
  }

  if (input.repo && input.pull) {
    return fetchPullRequestWorkItem(input.repo, input.pull);
  }

  if (input.repo && input.issue) {
    return fetchIssueWorkItem(input.repo, input.issue);
  }

  throw new Error("Provide --fixture, or --repo with --pull/--issue.");
}

export async function assessWorkItem(item: MaintainerWorkItem, options: AnalyzeOptions): Promise<MaintainerAssessment> {
  if (options.offline || !process.env.OPENAI_API_KEY) {
    return analyzeOffline(item);
  }

  return analyzeWithOpenAI(item, options.model);
}
