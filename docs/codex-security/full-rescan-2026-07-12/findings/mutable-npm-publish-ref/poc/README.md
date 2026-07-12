# Safe local ref ambiguity probe

This probe creates a disposable local Git repository with both
`refs/heads/v0.1.15` and `refs/tags/v0.1.15`, pointing at different commits.
It demonstrates the source ambiguity used by the workflow without contacting
GitHub, running Actions, requesting OIDC credentials, installing dependencies,
or publishing a package. The temporary repository is removed before exit.

Requirements: Node.js 20 or newer and Git.

From the report directory:

```sh
cd poc
node ref-ambiguity.mjs
```
