# npm Install Evidence

This document records public registry install evidence for the Codex for Open Source application.

## Package

- Package: `maintainerops-ai`
- Registry: `https://www.npmjs.com/package/maintainerops-ai`
- Verified version: `0.1.1`
- Binary: `maintainerops`

## Install execution proof

Command run on 2026-06-10:

```bash
npm exec --yes --package maintainerops-ai@latest -- maintainerops --help
```

Observed result:

```text
MaintainerOps AI

Usage:
  maintainerops analyze --fixture examples/fixtures/pull_request.json --format markdown
  maintainerops analyze --repo owner/name --pull 123 --authorized --format json
  maintainerops analyze --repo owner/name --issue 456 --authorized --offline
```

The command completed successfully from the public npm package. The package exposes a CLI that can generate maintainer review packets from fixtures or authorized GitHub pull requests/issues.

## README badge

The README includes npm version and monthly downloads badges:

```markdown
[![npm version](https://img.shields.io/npm/v/maintainerops-ai.svg)](https://www.npmjs.com/package/maintainerops-ai)
[![npm downloads](https://img.shields.io/npm/dm/maintainerops-ai.svg)](https://www.npmjs.com/package/maintainerops-ai)
```
