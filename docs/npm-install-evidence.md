# npm Install Evidence

This document records public registry install evidence for the Codex for Open Source application.

## Package

- Package: `maintainerops-ai`
- Registry: `https://www.npmjs.com/package/maintainerops-ai`
- Verified version: `0.1.2`
- Dist tag: `latest`
- Binary: `maintainerops`

## Install execution proof

Registry check run on 2026-06-11:

```bash
npm view maintainerops-ai version dist-tags time --json
```

Observed result:

```json
{
  "version": "0.1.2",
  "dist-tags": {
    "latest": "0.1.2"
  },
  "time": {
    "created": "2026-06-09T10:56:25.010Z",
    "modified": "2026-06-11T00:30:20.373Z",
    "0.1.0": "2026-06-09T10:56:25.492Z",
    "0.1.1": "2026-06-09T10:58:36.319Z",
    "0.1.2": "2026-06-11T00:30:20.260Z"
  }
}
```

Command run on 2026-06-11:

```bash
npm exec --yes --package maintainerops-ai@latest -- maintainerops --help
```

Observed result:

```text
MaintainerOps AI

Usage:
  maintainerops analyze --fixture examples/fixtures/pull_request.json [--format markdown|json]
  maintainerops analyze --repo owner/name --pull 123 [--format markdown|json]
  maintainerops analyze --repo owner/name --issue 456 [--format markdown|json]

Options:
  --offline        Force deterministic offline analysis.
  --authorized     Confirm you own, maintain, or have permission to review the target repo.
  --model <id>    OpenAI model to use when OPENAI_API_KEY is set.
```

The command completed successfully from the public npm package after publishing `maintainerops-ai@0.1.2`. The package exposes a CLI that can generate maintainer review packets from fixtures or authorized GitHub pull requests/issues.

## README badge

The README includes npm version and monthly downloads badges:

```markdown
[![npm version](https://img.shields.io/npm/v/maintainerops-ai.svg)](https://www.npmjs.com/package/maintainerops-ai)
[![npm downloads](https://img.shields.io/npm/dm/maintainerops-ai.svg)](https://www.npmjs.com/package/maintainerops-ai)
```
