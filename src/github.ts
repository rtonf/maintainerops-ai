import type { ChangedFile, MaintainerWorkItem } from "./types.js";

interface GitHubIssue {
  number: number;
  title: string;
  body?: string | null;
  html_url: string;
  user?: { login: string };
  labels?: Array<string | { name?: string }>;
}

interface GitHubPullRequest extends GitHubIssue {
  diff_url?: string;
}

interface GitHubFile {
  filename: string;
  status: string;
  additions?: number;
  deletions?: number;
  patch?: string;
}

const MAX_PULL_REQUEST_FILE_PAGES = 30;

export async function fetchIssueWorkItem(repo: string, issueNumber: number): Promise<MaintainerWorkItem> {
  const issue = await githubJson<GitHubIssue>(`/repos/${repo}/issues/${issueNumber}`);
  return {
    kind: "issue",
    repository: repo,
    number: issue.number,
    title: issue.title,
    author: issue.user?.login,
    body: issue.body ?? "",
    url: issue.html_url,
    labels: normalizeLabels(issue.labels)
  };
}

export async function fetchPullRequestWorkItem(repo: string, pullNumber: number): Promise<MaintainerWorkItem> {
  const pr = await githubJson<GitHubPullRequest>(`/repos/${repo}/pulls/${pullNumber}`);
  const files = await fetchPullRequestFiles(repo, pullNumber);

  return {
    kind: "pull_request",
    repository: repo,
    number: pr.number,
    title: pr.title,
    author: pr.user?.login,
    body: pr.body ?? "",
    url: pr.html_url,
    labels: normalizeLabels(pr.labels),
    files: files.map(toChangedFile)
  };
}

async function fetchPullRequestFiles(repo: string, pullNumber: number): Promise<GitHubFile[]> {
  const files: GitHubFile[] = [];
  let page = 1;

  while (page <= MAX_PULL_REQUEST_FILE_PAGES) {
    const pageFiles = await githubJson<GitHubFile[]>(
      `/repos/${repo}/pulls/${pullNumber}/files?per_page=100&page=${page}`
    );
    files.push(...pageFiles);

    if (pageFiles.length < 100) {
      return files;
    }

    page += 1;
  }

  throw new Error(
    `Pull request file list exceeds ${MAX_PULL_REQUEST_FILE_PAGES * 100} files; split the review or analyze a narrower change set.`
  );
}

async function githubJson<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "maintainerops-ai",
    "X-GitHub-Api-Version": "2022-11-28"
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(`https://api.github.com${path}`, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API error ${response.status} ${response.statusText} on ${path}`);
  }

  return (await response.json()) as T;
}

function normalizeLabels(labels: GitHubIssue["labels"]): string[] {
  return (
    labels
      ?.map((label) => {
        if (typeof label === "string") return label;
        return label.name ?? "";
      })
      .filter(Boolean) ?? []
  );
}

function toChangedFile(file: GitHubFile): ChangedFile {
  const status = ["added", "modified", "removed", "renamed"].includes(file.status) ? file.status : "unknown";
  return {
    path: file.filename,
    status: status as ChangedFile["status"],
    additions: file.additions,
    deletions: file.deletions,
    patch: file.patch
  };
}
