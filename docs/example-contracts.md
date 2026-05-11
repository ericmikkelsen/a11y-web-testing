# Spec: Chapter 05 Example Contracts

ASSUMPTIONS I'M MAKING:
1. Chapter 05 is docs-only and must not change runtime code under `src/`.
2. The browser example should be runnable from GitHub Pages without a server.
3. The Node example should be documented in the repo, but not hosted on GitHub Pages.
4. Chapter 06 will implement the runnable examples after this spec is approved.

## Objective

Define the exact example requirements for Story 01 so Chapter 06 can implement them without guessing. The goal is to document one browser example contract and one Node example contract that prove the existing accessibility-testing framework works in both environments.

## Tech Stack

- Plain JavaScript examples in the existing repository.
- Static documentation in `docs/`.
- GitHub Pages for the browser example only.
- No new runtime dependencies in Chapter 05.

## Commands

- `npm test` - confirm the current library behavior stays green while Chapter 05 docs are written.
- `git diff --stat story/library-v1...HEAD` - keep Chapter 05 docs within the reviewability budget.

## Project Structure

- `docs/example-contracts.md` - Chapter 05 source of truth for browser and Node example requirements.
- `docs/01-story.md` - story-level chapter guidance and acceptance criteria.
- `docs/library-spec.md` - current framework contract and result shape reference.
- `README.md` - optional pointer surface if the example contracts should be discoverable from the landing page later.

## Code Style

Write the requirements in plain English. Describe behavior, not implementation details. Keep each example contract small enough that a junior developer can read it and understand what the finished example must prove.

Example phrasing:

- The browser example loads in a static site and shows the framework running in a real browser.
- The Node example shows how the same framework is called from a Node-created document context.

## Testing Strategy

Chapter 05 is docs-only, so the verification is review-based rather than code-execution-based.

Must cover:
- The browser example contract is Pages-ready and runnable without a server.
- The Node example contract is documented clearly enough to implement in Chapter 06.
- Both example contracts map back to the current `ready`, `plugins`, and normalized-findings behavior.

## Boundaries

Always:
- Keep Chapter 05 documentation-only.
- Keep the browser example requirement compatible with GitHub Pages.
- Keep the Node example requirement in-repo and non-Pages-hosted.

Ask first:
- Before adding any new build, bundling, or deployment tooling.
- Before changing the public framework contract.
- Before adding runnable example code in Chapter 05.

Never:
- Implement the actual browser or Node example code in this chapter.
- Add new framework APIs or hooks.
- Change the result schema or normalization behavior in this chapter.

## Success Criteria

Chapter 05 is done when:
- The browser example contract is documented as Pages-ready and runnable in a browser.
- The Node example contract is documented as a repo example rather than a Pages-hosted demo.
- Both examples describe how they call the existing framework and what output they prove.
- No `src/` behavior changes are introduced.
- The chapter stays within the reviewability budget and is ready for Chapter 06 implementation.

## Open Questions

- Should the browser example be a single-page static demo or a small set of linked static pages?
- Should the Node example point to a test file, a README section, or both?
- Do we want a simple static Pages build step later, or should the browser example remain hand-published static HTML?