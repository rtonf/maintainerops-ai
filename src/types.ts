export type WorkItemKind = "pull_request" | "issue" | "release";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface MaintainerWorkItem {
  kind: WorkItemKind;
  repository: string;
  number?: number;
  title: string;
  author?: string;
  body?: string;
  url?: string;
  labels?: string[];
  files?: ChangedFile[];
  diff?: string;
  comments?: string[];
  checks?: CheckRunSummary[];
  metadata?: Record<string, unknown>;
}

export interface ChangedFile {
  path: string;
  status: "added" | "modified" | "removed" | "renamed" | "unknown";
  additions?: number;
  deletions?: number;
  patch?: string;
}

export interface CheckRunSummary {
  name: string;
  conclusion?: string;
  status?: string;
  url?: string;
}

export interface MaintainerAssessment {
  summary: string;
  riskLevel: RiskLevel;
  confidence: number;
  labels: string[];
  recommendedAction:
    | "needs_human_review"
    | "request_changes"
    | "ask_for_reproduction"
    | "ready_to_merge"
    | "needs_security_review"
    | "needs_release_manager"
    | "close_as_duplicate"
    | "needs_more_info";
  reviewChecklist: string[];
  securityNotes: string[];
  releaseNotes: string[];
  commentDraft: string;
  evidence: EvidenceItem[];
}

export interface EvidenceItem {
  source: "title" | "body" | "diff" | "file" | "comment" | "check" | "metadata";
  reference: string;
  note: string;
}

export interface AnalyzeOptions {
  format: "json" | "markdown";
  offline: boolean;
  model: string;
}

export interface CliArgs {
  command: "analyze" | "help";
  fixture?: string;
  repo?: string;
  pull?: number;
  issue?: number;
  format: "json" | "markdown";
  offline: boolean;
  model?: string;
  authorized: boolean;
}
