# Immutable publication source

## Scope

This proposal addresses MOAI-007, where a manual npm publication input can select a branch rather than the intended release tag before an OIDC-enabled publish.

## Current and desired invariant

The current workflow treats a release name as a generic checkout ref. We want the package published by Trusted Publishing to come only from an approved release tag or a release event whose tag is resolved explicitly. The package contents, tag identity, and publication event should be auditable together.

## Options

Removing manual dispatch is the lowest-privilege option and is preferred if release recovery can be handled by re-running the release. If operators need manual recovery, keep the workflow but checkout `refs/tags/${tag}`, validate the tag namespace, and require a protected npm environment. In both cases, protect release tags and keep action dependencies pinned.

## Rollout

Add a disposable fixture containing a branch and tag with the same short name. Verify the workflow rejects the branch and accepts only the tag. Update repository rules and npm Trusted Publishing configuration together, then publish a non-production test release or inspect the built tarball before the first real release. Roll back by reverting the workflow change, never by bypassing the tag/environment controls.

## Acceptance

No workflow input can cause a branch ref to reach the publish job. The checked-out commit digest matches the intended tag, the package tarball is reproducible from that tag, and the OIDC publication job is gated by the repository's release controls.
