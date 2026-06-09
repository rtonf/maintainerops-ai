const secretPatterns: Array<[RegExp, string]> = [
  [/sk-[A-Za-z0-9_-]{20,}/g, "sk-[REDACTED]"],
  [/gh[pousr]_[A-Za-z0-9_]{20,}/g, "gh_[REDACTED]"],
  [/github_pat_[A-Za-z0-9_]{40,}/g, "github_pat_[REDACTED]"],
  [/\bAKIA[0-9A-Z]{16}\b/g, "AKIA[REDACTED]"],
  [/\bASIA[0-9A-Z]{16}\b/g, "ASIA[REDACTED]"],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, "[REDACTED_PRIVATE_KEY]"],
  [/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, "[REDACTED_JWT]"],
  [/(api[_-]?key|token|secret|password)\s*=\s*["']?[^"'\s]+["']?/gi, "$1=[REDACTED]"],
  [
    /(\\?["']?)(api[_-]?key|token|secret|password|aws_access_key_id|aws_secret_access_key|access_token|refresh_token)(\\?["']?)\s*:\s*(\\?["'])([^"'\\]+)(\\?["'])/gi,
    "$1$2$3: $4[REDACTED]$6"
  ],
  [/Bearer\s+[A-Za-z0-9._~+/-]{20,}/g, "Bearer [REDACTED]"]
];

export function redactSecrets(input: string): string {
  return secretPatterns.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), input);
}

export function truncateForModel(input: string, maxChars = 120_000): string {
  if (input.length <= maxChars) {
    return input;
  }

  const head = input.slice(0, Math.floor(maxChars * 0.7));
  const tail = input.slice(input.length - Math.floor(maxChars * 0.25));
  return `${head}\n\n[...truncated ${input.length - head.length - tail.length} characters...]\n\n${tail}`;
}
