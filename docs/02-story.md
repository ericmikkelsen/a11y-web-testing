# Story 02: AxeCore Integration

## Motivation

Once the core framework can accept a DOM and run `additionalTests`, we need one real integration to prove the hook is useful in practice. AxeCore is the first external engine we will route through that extension point.

## Assumptions

- Story 01 has already established the public API, readiness gating, and normalized result shape.
- This story does not change the core framework contract unless the AxeCore adapter exposes a gap in it.
- AxeCore is used as an adapter or integration test of `additionalTests`, not as a built-in rule engine in the core library.
- Each chapter PR should stay under 250 changed lines whenever possible.

## Acceptance Criteria

- [ ] AxeCore can run through `additionalTests` against the DOM supplied by story 01.
- [ ] AxeCore findings are normalized into the shared result schema without changing the framework contract.
- [ ] The integration proves the framework can accept a real external engine without coupling the core library to AxeCore.

## Chapters

| #   | Branch                                       | One-sentence scope                                                          | Budget |
| --- | -------------------------------------------- | --------------------------------------------------------------------------- | ------ |
| 01  | `chapter/library-v1/06-axe-adapter`          | Add the AxeCore adapter that consumes the DOM through `additionalTests`. | <250 lines |
| 02  | `chapter/library-v1/07-axe-normalization`    | Normalize AxeCore output into the shared serializable result schema. | <250 lines |
| 03  | `chapter/library-v1/08-integration-docs`     | Add a minimal example or usage note showing how to plug AxeCore into the framework. | <250 lines |

## Out of Scope

- New framework APIs beyond what story 01 already established.
- Built-in accessibility rule authoring outside the AxeCore adapter path.
- Server endpoints or job runners.
- WordPress, Drupal, browser extension, or bookmarklet packaging.

## Dependencies

- Story 01 must be complete before this story starts.
- AxeCore must remain an external dependency, not a bundled rule implementation inside the framework core.

## Reviewability Notes

- Chapter 01 should only prove the adapter can execute through the existing hook contract.
- Chapter 02 should only translate AxeCore output into the framework result shape.
- Chapter 03 should stay example-only or near-example-only so the integration stays easy to review.