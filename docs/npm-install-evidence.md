# npm Install Evidence

This document records public registry install evidence for the Codex for Open Source application.

## Package

- Package: `maintainerops-ai`
- Registry: `https://www.npmjs.com/package/maintainerops-ai`
- Verified version: `0.1.7`
- Dist tag: `latest`
- Binary: `maintainerops`

## Install execution proof

Registry check run on 2026-06-20:

```bash
npm view maintainerops-ai version dist-tags time --json
```

Observed result:

```json
{
  "version": "0.1.7",
  "dist-tags": {
    "latest": "0.1.7"
  },
  "time": {
    "created": "2026-06-09T10:56:25.010Z",
    "modified": "2026-06-20T02:44:19.128Z",
    "0.1.0": "2026-06-09T10:56:25.492Z",
    "0.1.1": "2026-06-09T10:58:36.319Z",
    "0.1.2": "2026-06-11T00:30:20.260Z",
    "0.1.3": "2026-06-11T07:06:06.928Z",
    "0.1.4": "2026-06-12T13:03:52.165Z",
    "0.1.5": "2026-06-16T13:11:57.789Z",
    "0.1.7": "2026-06-20T02:44:19.011Z"
  }
}
```

Command run on 2026-06-20:

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

The command completed successfully from the public npm package after publishing `maintainerops-ai@0.1.7`. The package exposes a CLI that can generate maintainer review packets from fixtures or authorized GitHub pull requests/issues.

## README badge

The README includes npm version and monthly downloads badges:

```markdown
[![npm version](https://img.shields.io/npm/v/maintainerops-ai.svg)](https://www.npmjs.com/package/maintainerops-ai)
[![npm downloads](https://img.shields.io/npm/dm/maintainerops-ai.svg)](https://www.npmjs.com/package/maintainerops-ai)
```
