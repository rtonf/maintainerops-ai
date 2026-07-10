# Contributing

MaintainerOps AI accepts small, reviewable changes that preserve the human-in-the-loop workflow.

## Development setup

- Use Node.js `20.11` or newer. CI currently verifies the project on Node.js 24.
- Start from an existing issue or open a focused issue before a large behavioral change.
- Never include API keys, private repository content, or unauthorized third-party data in fixtures or tests.

Install the lockfile-resolved dependencies and run the complete local gate:

```bash
npm ci
npm run verify
```

`npm run verify` runs type checking, linting, formatting, unit tests, the UI smoke test, deterministic evals, package checks, and `npm audit`.

## Pull requests

- Explain the user impact, risk, and tests used.
- Add a regression test for bug fixes and update eval expectations when behavior changes.
- Keep generated `dist-action/index.js` aligned by running `npm run build:action`.
- Report security issues through the private process in `SECURITY.md`, not a public issue.

Features that automatically merge, close, label, comment, publish, or scan unauthorized targets should not be added.
