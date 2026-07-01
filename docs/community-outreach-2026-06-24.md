# Community Outreach: 2026-06-24

## Goal

Collect concrete installation and workflow feedback from 1-2 external OSS maintainers without mass-posting or violating community self-promotion rules.

## Primary Feedback Links

- Pinned issue: `https://github.com/rtonf/maintainerops-ai/issues/6`
- GitHub Discussion: `https://github.com/rtonf/maintainerops-ai/discussions/17`
- Repository: `https://github.com/rtonf/maintainerops-ai`
- Marketplace: `https://github.com/marketplace/actions/maintainerops-ai`

## Completed

- Updated Issue #6 for npm and Marketplace `v0.1.9`.
- Pinned Issue #6 on the repository.
- Updated Discussion #17 with the current install command and Action version.
- Published npm, GitHub Release, and Marketplace `v0.1.9`.
- Published one feedback request in the pinned r/github self-promotion megathread.
- Prepared the r/opensource submission form with the required `Promotional` flair, leaving all copy blank for owner-authored text as required by the community rules.
- Opened the Hacker News submission login page; owner login and owner-authored copy are required by the HN guidelines.

## Community Rule Screening

| Community               | Decision                                                           | Reason                                                              |
| ----------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------- |
| Reddit r/github         | Eligible only in the pinned self-promotion megathread              | Subreddit rule 4 requires all project promotion in that thread      |
| Reddit r/opensource     | Do not post agent-authored copy                                    | Rules prohibit AI-generated content and excessive self-promotion    |
| Hacker News             | Do not post agent-authored copy                                    | HN guidelines prohibit generated or AI-edited text                  |
| DEV Community           | Candidate after account and current publishing rules are confirmed | Use a substantive maintainer-workflow article, not a link-only post |
| LinkedIn / Mastodon / X | Candidate when an authenticated owner account is available         | Publish one concise request and engage with replies                 |

## r/github Megathread Comment

MaintainerOps AI is a read-only CLI and GitHub Action that turns PRs and issues into human-reviewed maintainer packets: risk level, suggested labels, review checks, security notes, release hints, and a draft response.

I am looking for 1-2 OSS maintainers to try the current `v0.1.9` release and share concrete feedback. It does not merge, close, label, or publish automatically.

Quick check:

```bash
npm install -g maintainerops-ai@latest
maintainerops --help
```

Project: https://github.com/rtonf/maintainerops-ai

Feedback: https://github.com/rtonf/maintainerops-ai/issues/6

Useful feedback includes whether installation worked, whether the packet helps real triage, what felt noisy or missing, and whether you would run it with read-only permissions.

## DEV Article Pitch

**Title:** What I learned building read-only AI triage packets for OSS maintainers

Cover the maintainer problem, why the Action has read-only permissions, offline analysis, human review, public evals and security reports, the npm `0.1.8` packaging incident and `prepack` repair, and the specific external feedback still needed.

## Short Social Post

Looking for 1-2 OSS maintainers to test MaintainerOps AI `v0.1.9`.

It creates human-reviewed PR/issue triage packets with risk, labels, review checks, security notes, and release hints. It is read-only and works offline; it never auto-merges or auto-closes.

Project: https://github.com/rtonf/maintainerops-ai

Feedback: https://github.com/rtonf/maintainerops-ai/issues/6

## Current v0.1.11 Update

Use this shorter current request after the npm Trusted Publishing release:

```text
Looking for 1-2 OSS maintainers to test MaintainerOps AI.

It creates read-only PR/issue review packets with risk, labels, review checks, security notes, release hints, and a draft response. It does not merge, close, label, comment, or publish automatically.

Quick check:
npm exec --yes --package maintainerops-ai@latest -- maintainerops --help

npm latest: maintainerops-ai@0.1.11
Project: https://github.com/rtonf/maintainerops-ai
Feedback: https://github.com/rtonf/maintainerops-ai/issues/6
```

## Outreach Log

| Date       | Channel                    | Status                 | Link                                                              | Replies    | Follow-up                                        |
| ---------- | -------------------------- | ---------------------- | ----------------------------------------------------------------- | ---------- | ------------------------------------------------ |
| 2026-06-24 | GitHub Issue #6            | Published and pinned   | https://github.com/rtonf/maintainerops-ai/issues/6                | 0 external | Monitor and answer within 24 hours               |
| 2026-06-24 | GitHub Discussion #17      | Updated                | https://github.com/rtonf/maintainerops-ai/discussions/17          | 0 external | Monitor and answer within 24 hours               |
| 2026-06-24 | Reddit r/github megathread | Published              | https://www.reddit.com/r/github/comments/1jy8rea/comment/otj6ufv/ | 0 external | Monitor and answer within 24 hours               |
| 2026-06-24 | Reddit r/opensource        | Owner handoff prepared | https://www.reddit.com/r/opensource/submit/                       |            | Owner writes original copy and submits           |
| 2026-06-24 | Hacker News                | Login handoff prepared | https://news.ycombinator.com/submit                               |            | Owner logs in, writes original copy, and submits |

## Response Handling

1. Thank the tester and record the exact version and command used.
2. Ask for no secrets or private repository content.
3. Convert reproducible defects into a GitHub issue and deterministic eval.
4. Record useful/noisy/missing observations in the usage log.
5. Do not offer rewards, request votes, or ask users to post positive feedback.
