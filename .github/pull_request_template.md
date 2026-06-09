## Summary

## Maintainer risk checklist

- [ ] This change is scoped and reviewable.
- [ ] Tests or a no-test rationale are included.
- [ ] Security-sensitive behavior is called out.
- [ ] Release notes or migration notes are included if user-facing behavior changed.

## MaintainerOps AI

Run:

```bash
npm run demo
```

For a live repository, use only authorized targets:

```bash
node dist/cli.js analyze --repo owner/project --pull 123 --authorized --format markdown
```
