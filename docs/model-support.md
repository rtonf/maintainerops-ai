# Model Support

MaintainerOps AI accepts a model through the `--model` flag or `OPENAI_MODEL` environment variable.

If neither is provided, the CLI uses the built-in default from `src/defaults.ts`.

```bash
set OPENAI_MODEL=<supported-openai-model>
node dist/cli.js analyze --fixture examples/fixtures/pull_request.json --format markdown
```

Model availability can change over time. Maintainers should choose a model available to their OpenAI organization and update this project only after verifying `npm run verify` and a representative model-backed packet.
