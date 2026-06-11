# External Feedback Request

MaintainerOps AI is ready for early external maintainer feedback.

Public feedback issue: https://github.com/rtonf/maintainerops-ai/issues/6

## Copy/paste request

```text
Could you try MaintainerOps AI and leave short feedback on Issue #6?

Package: https://www.npmjs.com/package/maintainerops-ai
Feedback issue: https://github.com/rtonf/maintainerops-ai/issues/6

Quick check:
npm exec --yes --package maintainerops-ai@latest -- maintainerops --help

Optional packet check:
npm exec --yes --package maintainerops-ai@latest -- maintainerops analyze --fixture examples/fixtures/pull_request.json --format markdown --offline

Please mention:
- whether install/exec worked
- whether the packet would help PR or issue triage
- what was noisy, unclear, or missing
- whether you would use this in a read-only OSS maintainer workflow
```

## What to try

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
