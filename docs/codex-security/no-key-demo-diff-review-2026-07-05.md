# No-Key Demo Diff Review: 2026-07-05

This API-free security diff review covers the `v0.1.13` no-key demo command change.

## Scope

- `src/cli.ts`
- `src/fixture.ts`
- `src/types.ts`
- `src/cli.test.ts`
- `package.json`
- README and external feedback documentation
- Generated Action bundle from `npm run verify`

## Review Focus

- Demo mode must not call the OpenAI API.
- Demo mode must not accept live GitHub repository inputs.
- Demo mode must not require `GITHUB_TOKEN`, `OPENAI_API_KEY`, or local fixture files.
- Demo output must remain human-in-the-loop and read-only.
- Documentation must not claim unverified publication status.

## Findings

No reportable security findings were identified.

## Validation

- `node dist/cli.js demo --format markdown` printed an offline sample review packet.
- `node dist/cli.js demo --format json` printed JSON for the offline sample packet.
- `node dist/cli.js demo --model gpt-4o-mini` failed with `Unknown option for demo: --model`.
- `node dist/cli.js demo --repo owner/repo` failed with `Unknown option for demo: --repo`.
- `npm run verify` passed with 49 tests and `npm audit` reported 0 vulnerabilities.
- Secret-pattern search over changed source and docs returned only documented placeholders, historical security-report text, and test canaries.

## Residual Risk

The demo fixture is synthetic and should not be represented as external usage evidence. Its purpose is to reduce reviewer friction before they test the Action or CLI on repositories they own, maintain, or are authorized to administer.
