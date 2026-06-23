# MaintainerOps AI Promotion Kit

This kit collects practical launch and outreach material for spreading MaintainerOps AI to OSS maintainers, security-minded project owners, and GitHub Action users.

## Positioning

MaintainerOps AI helps open-source maintainers turn pull requests and issues into structured, human-reviewed triage packets. It is read-only by design, works offline for safe CI checks, and can use the OpenAI API when maintainers explicitly enable it.

## What To Promote

- **Maintainer control:** It suggests summaries, risk level, labels, review checks, security notes, release-note hints, and draft responses without merging, closing, labeling, or publishing automatically.
- **Low-friction trial:** Maintainers can try the npm CLI with an offline fixture before adding anything to a repository.
- **GitHub Action path:** Repositories can generate review packets from pull request and issue events with read-only permissions.
- **Security posture:** The project includes redaction, stdout neutralization, runtime validation, evals, and public security review evidence.
- **Real examples:** Public review packet examples show what maintainers can expect before installing.

## Priority Actions

1. Publish or confirm the GitHub Marketplace listing is on the latest Action release.
2. Pin a short repository issue asking maintainers for early feedback.
3. Share the npm one-command trial in maintainer communities.
4. Add the Action to one or two owned public repositories and link to generated packets.
5. Post a concise launch note on GitHub, LinkedIn, X, Mastodon, and relevant OSS/security communities.
6. Ask 10 maintainers directly for feedback using the email/DM copy below.
7. Turn the best early feedback into README quotes or a short case study.

## Copy Blocks

### One-Liner

MaintainerOps AI turns GitHub PRs and issues into read-only, human-reviewed maintainer triage packets with risk level, labels, review checks, security notes, release hints, and draft responses.

### Short Launch Post

I built MaintainerOps AI for open-source maintainers who need help reviewing PRs and triaging issues without giving automation write access.

It generates structured review packets with:

- summary
- risk level
- suggested labels
- review checklist
- security notes
- release-note hints
- optional draft response

It is read-only by design, works offline for safe CI validation, and only uses the OpenAI API when explicitly configured.

Try the CLI:

```bash
npm install -g maintainerops-ai@latest
maintainerops --help
```

Project: https://github.com/rtonf/maintainerops-ai
npm: https://www.npmjs.com/package/maintainerops-ai
Marketplace: https://github.com/marketplace/actions/maintainerops-ai

### Maintainer Feedback Request

Could you try MaintainerOps AI on a PR, issue, or fixture and leave short feedback?

It is a read-only OSS maintainer assistant that generates triage packets instead of making repository changes.

Quick check:

```bash
npm install -g maintainerops-ai@latest
maintainerops --help
```

Optional source demo:

```bash
git clone https://github.com/rtonf/maintainerops-ai.git
cd maintainerops-ai
npm install
npm run demo
```

Feedback issue: https://github.com/rtonf/maintainerops-ai/issues/6

I am especially looking for:

- whether the install worked
- whether the packet would help real PR or issue triage
- what felt noisy, unclear, or missing
- whether you would run it as a read-only Action on an OSS repo

### GitHub Marketplace Blurb

MaintainerOps AI helps open-source maintainers turn pull requests and issues into human-reviewed triage packets. It suggests summaries, risk levels, labels, review checks, security notes, release-note hints, and draft responses while keeping repository control with the maintainer.

### README Badge CTA

Try MaintainerOps AI from npm or GitHub Marketplace, then leave early maintainer feedback on Issue #6.

## Community Targets

- GitHub repository README, release notes, and pinned feedback issue
- npm package README
- GitHub Marketplace Action listing
- LinkedIn post for OSS/security/tooling audiences
- X or Mastodon thread with CLI command and screenshot/GIF
- Open Source Friday or maintainer-focused communities
- Security tooling communities that discuss CodeQL, Dependabot, Semgrep, and audit workflows
- Dev.to or Hashnode article: "Read-only AI triage packets for open-source maintainers"
- Hacker News "Show HN" only after Marketplace and npm links are aligned
- Relevant GitHub Discussions in owned or friendly OSS projects

## Outreach List Template

Use this table to track direct maintainer feedback requests.

| Maintainer | Project | Channel | Sent | Tried | Feedback link | Notes |
| ---------- | ------- | ------- | ---- | ----- | ------------- | ----- |
|            |         |         |      |       |               |       |

## Launch Checklist

- [ ] Confirm npm version and GitHub Action release expectations are clearly explained.
- [ ] Confirm Marketplace listing points to the latest Action release.
- [ ] Confirm README quick start works on a clean machine.
- [ ] Confirm `docs/review-packets/README.md` links to useful examples.
- [ ] Confirm demo GIF renders in GitHub README.
- [ ] Confirm Issue #6 is open and linked from README, Marketplace notes, and launch posts.
- [ ] Add at least one new real review packet from an owned public repository.
- [ ] Publish launch post using the Short Launch Post copy.
- [ ] Send the Maintainer Feedback Request to 10 maintainers.
- [ ] Summarize feedback into concrete roadmap issues.

## Suggested Article Outline

Title: Read-only AI triage packets for open-source maintainers

1. The maintainer problem: too many PRs, issues, and security signals.
2. Why write access is risky for early automation.
3. What MaintainerOps AI produces.
4. How offline mode works for safe CI validation.
5. How to add the GitHub Action with read-only permissions.
6. What early feedback is needed.

## Metrics To Watch

- npm weekly downloads
- GitHub stars and watchers
- Marketplace installs or views
- number of maintainers who run the CLI
- number of feedback comments on Issue #6
- number of real review packet examples
- recurring false positives or noisy checklist items
