# npm Install Evidence

This document records public registry installation evidence for MaintainerOps AI.

## Package

- Package: `maintainerops-ai`
- Registry: `https://www.npmjs.com/package/maintainerops-ai`
- Verified version: `0.1.12`
- Dist tag: `latest`
- Binary: `maintainerops`
- Deprecated version: `0.1.8` because its published tarball omitted `dist/cli.js`

## Registry Evidence

Registry check run on 2026-07-05:

```bash
npm view maintainerops-ai version dist-tags time --json
npm view maintainerops-ai@0.1.8 deprecated
```

Observed result:

```json
{
  "version": "0.1.12",
  "dist-tags": {
    "latest": "0.1.12"
  }
}
```

The registry reports `0.1.8` as deprecated with instructions to use `0.1.9` or later. Version `0.1.12` was published through npm Trusted Publishing with provenance after the passing 10-case live model-backed eval release.

## Clean Installation Proof

The public registry package was executed from the `latest` dist tag:

```bash
npm exec --yes --package maintainerops-ai@latest -- maintainerops --help
```

Verified package contents and behavior:

- npm resolved `maintainerops-ai@0.1.12` from the public registry.
- The generated `maintainerops` command completed successfully.

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

## Publication Guard

Version `0.1.9` added a `prepack` script that rebuilds the CLI and Action runtime during both `npm pack` and `npm publish`. Version `0.1.12` preserves that guard and was published through the Trusted Publishing workflow.

## Trusted Publishing Evidence

- GitHub Release: `https://github.com/rtonf/maintainerops-ai/releases/tag/v0.1.12`
- Successful workflow run: `https://github.com/rtonf/maintainerops-ai/actions/runs/28712720794`
- npm latest: `0.1.12`

## README Badges

```markdown
[![npm version](https://img.shields.io/npm/v/maintainerops-ai.svg)](https://www.npmjs.com/package/maintainerops-ai)
[![npm downloads](https://img.shields.io/npm/dm/maintainerops-ai.svg)](https://www.npmjs.com/package/maintainerops-ai)
```
