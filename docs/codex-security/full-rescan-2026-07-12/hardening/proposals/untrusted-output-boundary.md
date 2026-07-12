# Untrusted output boundary

## Scope

This proposal addresses MOAI-001 (case-sensitive Bearer redaction) and MOAI-003 (legacy runner command marker). Both findings begin with contributor-controlled issue or pull-request text and end at a privileged external boundary.

## Current and desired invariant

Today, different callers rely on a regular expression and a formatter to make content safe. We want one explicit invariant: every value derived from a work item is redacted before model input and neutralized for the exact runner parser before stdout. A caller must choose the boundary intentionally; passing raw work-item text to either sink should be a reviewable defect.

## Options

The baseline is two narrow regex fixes. The stronger option is shared, sink-specific helpers with tests at the final call sites. We should not use one universal escaping function because model redaction and runner-command neutralization protect different consumers and have different compatibility needs.

## Rollout

Add case-insensitive Bearer tests and runner-marker canary tests first. Introduce the helpers, migrate prompt and Action callers, search for direct output, then run the existing verification suite. If a compatibility issue appears, revert the caller migration while retaining the narrow redaction and marker fixes.

## Acceptance

Synthetic lowercase and mixed-case bearer credentials never appear in model input. Sanitized output contains neither `##[` nor a line-leading `::`. Existing packet content remains readable and the Action canary completes without interpreting supplied markers.
