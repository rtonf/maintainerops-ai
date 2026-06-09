# Evals

MaintainerOps AI treats evals as part of the product, not as an afterthought.

Current evals run deterministic offline cases:

```bash
npm run eval
```

The initial golden set checks that:

- Security-sensitive pull requests receive `security-review`.
- Pull requests without test files receive `tests-needed`.
- Ordinary documentation issues remain low risk.

Planned model-backed evals:

- Compare model output against maintainer-labeled historical issues.
- Track false positives for security-sensitive PRs.
- Track false negatives where missing tests, release notes, or authorization risks were missed.
- Require every high-risk finding to include evidence.
- Require every suggested GitHub comment to be editable and non-accusatory.
