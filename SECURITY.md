# Security Policy

## Supported Versions

MaintainerOps AI is pre-1.0 software. Security fixes are shipped in the latest npm package and GitHub Action release.

| Version                               | Supported        |
| ------------------------------------- | ---------------- |
| Latest npm `maintainerops-ai` release | Yes              |
| Latest GitHub Action release          | Yes              |
| Older releases                        | Best effort only |

## Supported Use

MaintainerOps AI is intended for repositories you own, maintain, or are authorized to administer.

Do not use it to scan, probe, or review private code, systems, or repositories without permission.

The project is human-in-the-loop. It does not auto-merge pull requests, auto-close issues, publish releases, or scan repositories without maintainer authorization.

## Secret Handling

Before content is sent to an AI model, MaintainerOps AI redacts common secrets:

- OpenAI and GitHub tokens
- JWTs
- private key blocks
- common `.env` assignment patterns
- high-entropy bearer tokens

Redaction is defense in depth. Do not paste production secrets into fixtures, issues, pull request descriptions, or CI logs.

## Reporting Vulnerabilities

Please report suspected vulnerabilities privately instead of opening a public issue.

Preferred path:

1. Open a GitHub private vulnerability report from the repository's **Security** tab: <https://github.com/rtonf/maintainerops-ai/security/advisories/new>
2. Include a concise description, affected version or commit, reproduction steps, impact, and any suggested fix.
3. If the report involves a secret, token, or private repository content, redact the sensitive value before sending it.

If GitHub private reporting is unavailable, contact the repository owner through the public GitHub profile and request a private disclosure channel. Do not publish exploit details until a fix is available.

## Response Targets

These are targets, not guarantees:

- Initial acknowledgement: within 7 days.
- Initial triage: within 14 days.
- Fix or mitigation plan for confirmed high-impact issues: within 30 days.
- Public advisory or release note: after a fix is available or a mitigation is documented.

## Scope

In scope:

- secret redaction bypasses
- prompt/output handling that could leak private input
- GitHub Actions permission or untrusted-code execution issues
- unsafe default behavior that could run against unauthorized repositories
- package publication or release-integrity problems

Out of scope:

- reports against repositories you do not own or have permission to test
- denial-of-service testing against GitHub, npm, OpenAI, or other third-party services
- social engineering
- vulnerability reports that require exposing real secrets or private code publicly

## Disclosure

Confirmed vulnerabilities are fixed in public releases when possible. Security-sensitive details may be withheld until users have had a reasonable chance to upgrade.
