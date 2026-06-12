export interface ActionEnvironment {
  INPUT_MODE?: string;
  INPUT_REPO?: string;
  GITHUB_REPOSITORY?: string;
  INPUT_NUMBER?: string;
  INPUT_FIXTURE?: string;
  INPUT_FORMAT?: string;
  INPUT_OFFLINE?: string;
  INPUT_AUTHORIZED?: string;
  MAINTAINEROPS_AUTHORIZED?: string;
}

export function buildActionArgs(env: ActionEnvironment): string[] {
  const mode = env.INPUT_MODE;
  const repo = env.INPUT_REPO || env.GITHUB_REPOSITORY;
  const number = env.INPUT_NUMBER;
  const fixture = env.INPUT_FIXTURE;
  const format = env.INPUT_FORMAT || "markdown";
  const offline = env.INPUT_OFFLINE === "true";
  const authorized = env.INPUT_AUTHORIZED === "true" || env.MAINTAINEROPS_AUTHORIZED === "true";

  const args = ["analyze", "--format", format];
  if (offline) {
    args.push("--offline");
  }
  if (authorized) {
    args.push("--authorized");
  }

  if (fixture) {
    args.push("--fixture", fixture);
    return args;
  }

  if (mode === "pull_request") {
    if (!repo || !number) {
      throw new Error("mode=pull_request requires repo and number inputs");
    }
    args.push("--repo", repo, "--pull", number);
    return args;
  }

  if (mode === "issue") {
    if (!repo || !number) {
      throw new Error("mode=issue requires repo and number inputs");
    }
    args.push("--repo", repo, "--issue", number);
    return args;
  }

  throw new Error("mode must be pull_request, issue, or fixture");
}
