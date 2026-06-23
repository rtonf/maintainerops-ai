# npm Install Evidence

This document records public registry installation evidence for MaintainerOps AI.

## Package

- Package: `maintainerops-ai`
- Registry: `https://www.npmjs.com/package/maintainerops-ai`
- Verified version: `0.1.9`
- Dist tag: `latest`
- Binary: `maintainerops`
- Deprecated version: `0.1.8` because its published tarball omitted `dist/cli.js`

## Registry Evidence

Registry check run on 2026-06-24:

```bash
npm view maintainerops-ai version dist-tags --json
npm view maintainerops-ai@0.1.8 deprecated
```

Observed result:

```json
{
  "version": "0.1.9",
  "dist-tags": {
    "latest": "0.1.9"
  }
}
```

The registry reports `0.1.8` as deprecated with instructions to use `0.1.9` or later.

## Clean Installation Proof

The public registry package was installed into a new temporary directory:

```powershell
$temp = "C:\tmp\maintainerops-019-registry-check"
npm install --prefix $temp maintainerops-ai@0.1.9 --ignore-scripts
& "$temp\node_modules\.bin\maintainerops.cmd" --help
```

Verified package contents and behavior:

- `node_modules/maintainerops-ai/dist/cli.js` exists.
- npm generated `maintainerops`, `maintainerops.cmd`, and `maintainerops.ps1` shims.
- The installed Windows command completed successfully.

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

Version `0.1.9` adds a `prepack` script that rebuilds the CLI and Action runtime during both `npm pack` and `npm publish`. Its verified tarball contains 38 files, including `dist/cli.js`.

## README Badges

```markdown
[![npm version](https://img.shields.io/npm/v/maintainerops-ai.svg)](https://www.npmjs.com/package/maintainerops-ai)
[![npm downloads](https://img.shields.io/npm/dm/maintainerops-ai.svg)](https://www.npmjs.com/package/maintainerops-ai)
```
