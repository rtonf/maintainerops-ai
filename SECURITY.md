# Security Policy

## Supported use

MaintainerOps AI is intended for repositories you own, maintain, or are authorized to administer.

Do not use it to scan, probe, or review private code, systems, or repositories without permission.

## Secret handling

Before content is sent to an AI model, MaintainerOps AI redacts common secrets:

- OpenAI and GitHub tokens
- JWTs
- private key blocks
- common `.env` assignment patterns
- high-entropy bearer tokens

Redaction is defense in depth. Do not paste production secrets into fixtures, issues, pull request descriptions, or CI logs.

## Reporting vulnerabilities

Please open a private security advisory on GitHub or contact the maintainer listed in the repository metadata.
