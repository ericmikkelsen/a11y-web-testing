# Story 01: Accessibility Testing Framework

## Motivation

We need a small, reusable core library that can pass a DOM into accessibility test hooks before we build any host-specific runners, plugins, or UI layers. The first story should prove the contract and a first consumer of `plugins` without creating a large, hard-to-review PR.

## Assumptions

- This story covers the core library only, not the server backend, WordPress/Drupal plugins, browser extension, bookmarklet, or results UI.
- The library returns serializable finding objects so later hosts can render or transport them.
- AxeCore is not built into this story; it is the follow-on integration in story 02.
- Each chapter PR should stay under 250 changed lines whenever possible.

## Acceptance Criteria

- [ ] The public library API is defined in one place and has a stable result schema.
- [ ] The library waits for `ready` before running any checks.
- [ ] The library passes the DOM into caller-provided `plugins`.
- [ ] Returned findings are normalized and include rule identity, human-readable context, WCAG metadata, and a target location.
- [ ] A runnable browser example demonstrates passing a browser DOM through the framework.
- [ ] A runnable Node example demonstrates passing a Node DOM context through the framework.
- [ ] Chapter PRs stay small enough to review independently, targeting under 250 changed lines each.

## Chapters

| #   | Branch                                            | One-sentence scope                                                                                 | Budget     |
| --- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------- |
| 01  | `chapter/library-v1/01-api-contract`              | Define the library entry point, options shape, and normalized finding schema.                      | <250 lines |
| 02  | `chapter/library-v1/02-test-harness`              | Add the smallest contract test harness that proves the API shape and return contract.              | <250 lines |
| 03  | `chapter/library-v1/03-dom-hook-orchestration`    | Implement readiness gating and make sure `plugins` receives the DOM context.                       | <250 lines |
| 04  | `chapter/library-v1/04-result-normalization`      | Normalize hook output into the shared serializable result schema.                                  | <250 lines |
| 05  | `chapter/library-v1/05-example-docs`              | Document what both examples must demonstrate and how each maps to the framework contract.          | <250 lines |
| 06  | `chapter/library-v1/06-browser-and-node-examples` | Add one runnable browser example and one runnable Node example following the documented contracts. | <250 lines |

## Out of Scope

- Server endpoints or job runners.
- WordPress, Drupal, browser extension, or bookmarklet packaging.
- Cross-origin iframe orchestration.
- Results presentation UI.
- Low-confidence or ambiguous heuristics that require a human to confirm every case.
- Hand-built accessibility rule sets before the hook contract and AxeCore path are proven.

## Dependencies

- Existing repo conventions for formatting, commits, and release automation.
- Approval of the public result schema before implementation starts.

## Reviewability Notes

- Chapter 01 should establish the shared contract so later chapters do not need to reshape it.
- Chapter 02 should stay test-only so later chapters can build against a locked contract.
- Chapter 03 should only wire DOM readiness and hook plumbing; it should not add new rule logic.
- Chapter 04 should only normalize findings; it should not expand the hook surface.
- Chapter 05 should define example requirements only and avoid changing the framework contract.
- Chapter 06 should only add runnable examples and avoid changing the framework contract.
- Chapter 05 requirements are documented in [example-contracts.md](example-contracts.md).
