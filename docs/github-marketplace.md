# GitHub Marketplace Listing Notes

These notes prepare MaintainerOps AI for GitHub Marketplace publication as a GitHub Action.

## Listing name

MaintainerOps AI

## Short description

Generate human-reviewed PR and issue triage packets for OSS maintainers.

## Marketplace description

MaintainerOps AI helps open-source maintainers turn pull requests and issues into structured review packets. Each packet includes a summary, risk level, suggested labels, review checklist, security notes, release-note hints, and an optional draft response.

The Action is designed for maintainer control:

- Read-only GitHub permissions.
- Explicit authorization for live repository analysis.
- No automatic merge, close, label, comment, release, or publish operations.
- Offline mode for pull request validation without API secrets.
- Secret redaction and GitHub Actions stdout neutralization before output.

## Recommended categories

- Code quality
- Security
- Utilities

## Recommended tags

- open-source
- maintainer-tools
- pull-request-review
- issue-triage
- security-review
- release-readiness
- human-in-the-loop

## Example usage

```yaml
name: MaintainerOps AI

on:
  pull_request:
    types: [opened, synchronize, reopened]
  issues:
    types: [opened, edited]

permissions:
  contents: read
  pull-requests: read
  issues: read

jobs:
  review-packet:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
        with:
          persist-credentials: false
      - uses: rtonf/maintainerops-ai@v0.1.3
        with:
          mode: ${{ github.event_name == 'pull_request' && 'pull_request' || 'issue' }}
          repo: ${{ github.repository }}
          number: ${{ github.event.pull_request.number || github.event.issue.number }}
          format: markdown
          offline: true
          authorized: true
```

## Safety statement

MaintainerOps AI is a human-in-the-loop assistant. It does not make repository changes by itself. Maintainers must review the packet and decide whether to comment, label, request changes, merge, close, or release.

Use this Action only on repositories you own, maintain, or are explicitly authorized to administer.
