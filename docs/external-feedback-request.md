# External Feedback Request

MaintainerOps AI is ready for early external maintainer feedback.

Public feedback issue: https://github.com/rtonf/maintainerops-ai/issues/6

Current public channels:

- npm latest: `maintainerops-ai@0.1.5`
- GitHub Marketplace latest: `rtonf/maintainerops-ai@v0.1.6`
- Source release candidate: `v0.1.7` is prepared for the next npm and Marketplace publication.

## Copy/paste request

```text
Could you try MaintainerOps AI and leave short feedback on Issue #6?

Package: https://www.npmjs.com/package/maintainerops-ai
Feedback issue: https://github.com/rtonf/maintainerops-ai/issues/6
GitHub Action: https://github.com/marketplace/actions/maintainerops-ai

Quick check:
npm exec --yes --package maintainerops-ai@latest -- maintainerops --help

Optional packet check:
npm exec --yes --package maintainerops-ai@latest -- maintainerops analyze --fixture examples/fixtures/pull_request.json --format markdown --offline

Please mention:
- whether install/exec worked
- whether Marketplace Action setup worked, if you tried it
- whether the packet would help PR or issue triage
- what was noisy, unclear, or missing
- whether you would use this in a read-only OSS maintainer workflow
```

## What to try

From GitHub Marketplace or a repository workflow:

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
      - uses: rtonf/maintainerops-ai@v0.1.6
        with:
          mode: ${{ github.event_name == 'pull_request' && 'pull_request' || 'issue' }}
          repo: ${{ github.repository }}
          number: ${{ github.event.pull_request.number || github.event.issue.number }}
          format: markdown
          offline: true
          authorized: true
```

From npm:

```bash
npm exec --yes --package maintainerops-ai@latest -- maintainerops --help
```

Then run one offline packet against a fixture:

```bash
npm exec --yes --package maintainerops-ai@latest -- maintainerops analyze --fixture examples/fixtures/pull_request.json --format markdown --offline
```

Or try it from source:

```bash
npm install
npm run verify
npm run demo
```

## Feedback requested

- Was the review packet useful for deciding the next maintainer action?
- Did the labels match what you would apply?
- Did the packet miss a security, release, or test-coverage concern?
- Was anything too noisy or too cautious?
- Would you run this in a read-only GitHub Action on a public OSS repo?

## How to respond

Please comment on Issue #6 with:

- Repository or fixture used
- Command run
- Packet output link or summary
- What was useful
- What was wrong or missing
- Whether you would use it again
