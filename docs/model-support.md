# Model Support

MaintainerOps AI accepts a model through the `--model` flag or `OPENAI_MODEL` environment variable.

If neither is provided, the CLI uses the built-in default from `src/defaults.ts`.

The current verified default is `gpt-4o-mini`, based on the 2026-07-01 manual model-backed eval run.

```bash
set OPENAI_MODEL=<supported-openai-model>
node dist/cli.js analyze --fixture examples/fixtures/pull_request.json --format markdown
```

Model availability can change over time. Maintainers should choose a model available to their OpenAI organization and update this project only after verifying `npm run verify` and a representative model-backed packet.

## Model-backed eval pricing guard

`npm run eval:model` is budget-gated and intentionally fails closed when the selected model does not have pricing recorded in `src/eval/run-model-eval.ts`.

This prevents a live eval from treating an unknown model as `$0` spend. To use another model for model-backed evals, update the pricing table, run the targeted eval with an explicit `--budget-usd`, and record the result in the eval evidence docs.
