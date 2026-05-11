# Spec: Accessibility Testing Library

## Objective

Build a framework-agnostic library that passes a page/document context into accessibility test hooks and returns structured findings. The first version should focus on proving the hook contract and normalization path, with AxeCore as the first external consumer of `plugins`.

User outcome:

- A consumer passes a page URL or document context into the library.
- The library waits until the target is ready to inspect.
- The library passes the DOM into caller-supplied checks.
- AxeCore can be run through `plugins` without being built into the core library.
- The library returns normalized findings that can be rendered, stored, or forwarded by host apps.

## Tech Stack

Assumption for v1:

- Plain JavaScript in the existing repository, with no required runtime framework dependency.
- Browser- and plugin-friendly API shape so the same core logic can later be reused by server, CMS, extension, or bookmarklet surfaces.

Optional future additions, not required for this spec:

- TypeScript types for the public API
- A browser automation adapter for server-side execution

## Commands

Current repository commands:

- `npm run format` - format files with Prettier

Planned library verification commands:

- `npm test` - run the library test suite once it exists
- `npm run lint` - run static checks once linting is added
- `npm run build` - build distributable output if the library is packaged

## Project Structure

Target shape for the library slice:

- `src/` - core library implementation
- `src/checks/` - built-in accessibility checks
- `src/adapters/` - host-specific adapters for document, URL, or browser contexts
- `src/types/` - shared result-shape helpers if needed
- `test/` or `src/**/*.test.js` - unit and contract tests for the public API

Planned public API surface:

- `runAccessibilityChecks(options)` - primary entry point
- `ready` hook - resolves when the target is ready for inspection
- `imageHandler` hook - resolves offending image URLs or captured image data when needed
- `plugins` hook - caller-provided checks that receive the DOM and return findings

## Code Style

Prefer small, explicit functions and stable data shapes. Keep result objects flat and serializable so they can cross process or message boundaries later.

Example result shape:

```js
{
  violation: true,
  wcagVersion: '2.2',
  ruleId: 'img-alt-text',
  rule: 'Images must have meaningful alternative text',
  message: 'Image is missing alt text',
  target: 'img#hero-logo',
  url: 'https://example.com/#:~:text=Hero%20logo',
  wcagURL: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html'
}
```

Conventions:

- Keep the API deterministic for a given document state.
- Separate automated findings from human-check findings with an explicit value.
- Treat hook output as the primary extension point before adding any engine-specific integration.
- Avoid passing raw DOM nodes across boundaries unless the execution context is already in-browser.

## Testing Strategy

Start with contract tests that prove the public API shape and the minimal execution flow.

Must cover:

- The library waits for `ready` before running checks.
- The library passes the DOM into `plugins`.
- AxeCore can be executed through `plugins` as the first integration proof.
- The library normalizes all returned findings to the shared schema.
- AxeCore findings can be normalized without changing the hook contract.
- The library surfaces human-check cases distinctly when a rule cannot be proven automatically.

Preferred test style:

- Red/green tests for each new behavior slice.
- Unit tests for normalization and hook invocation.
- Contract tests for the public return shape.

## Boundaries

Always:

- Return serializable finding objects.
- Keep the API small and host-agnostic.
- Make rule IDs and messages stable enough for downstream rendering.

Ask first:

- Before adding a runtime dependency.
- Before changing the public result schema in a breaking way.
- Before adding browser automation or build tooling that changes how the library executes.

Never:

- Couple the core library to WordPress, Drupal, browser extension APIs, or bookmarklet code.
- Bake server transport concerns into the core checks.
- Require cross-origin iframe handling in the library itself.
- Treat low-confidence guesses as definitive violations.

## Success Criteria

The library is ready for the next implementation step when:

- The public API is defined in one place and reviewed.
- The result schema includes rule identity, human-readable context, target location, and WCAG metadata.
- The `ready`, `imageHandler`, and `plugins` hooks have explicit contracts.
- The first test suite proves the library waits for readiness, passes the DOM to hooks, and returns normalized findings from AxeCore.
- The design stays reusable for the later runner and plugin layers.

## Open Questions

- Should the first implementation be plain JavaScript or TypeScript?
- Should `target` be a selector string, a text fragment, or both?
- Should `violation` support a third `check` state in v1, or should that be a separate field such as `status`?
- Should the library own built-in rule definitions, or should those live in a separate rule package?
- Should `imageHandler` return a URL, a data URI, or a richer image descriptor?
- Should `plugins` receive the full document context object, or only the DOM/document reference?
