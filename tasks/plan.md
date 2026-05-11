# Plan: Chapter 05 Example Docs

## Motivation

Document the exact requirements for the browser and Node examples before Chapter 06 starts implementation.

## Acceptance Criteria

- [ ] The browser example requirement is Pages-ready and runnable in a static browser context.
- [ ] The Node example requirement is documented in-repo and not Pages-hosted.
- [ ] Both example contracts explain how they use the current `ready`, `plugins`, and normalized findings behavior.
- [ ] The chapter stays docs-only and does not change `src/` behavior.
- [ ] The docs stay within the chapter reviewability budget.

## Tasks

### Task 1: Draft example contract spec

**Acceptance:**

- Create a dedicated example requirements doc in `docs/`.
- List assumptions, boundaries, and success criteria in plain English.
- Define the browser and Node example requirements separately.

### Task 2: Specify browser Pages-ready behavior

**Acceptance:**

- Document that the browser example must run from a static GitHub Pages site.
- Describe the browser-side flow using the existing framework contract.
- State any build or deployment assumptions explicitly.

### Task 3: Specify Node repo example behavior

**Acceptance:**

- Document that the Node example stays in-repo rather than on GitHub Pages.
- Describe the Node-side flow using the existing framework contract.
- Clarify what the Node example must prove for Chapter 06.

### Task 4: Add discoverability pointers

**Acceptance:**

- Add brief links or references from existing docs if needed.
- Keep any pointer changes minimal and behavior-focused.
- Avoid any framework or runtime code changes.

### Task 5: Review and prepare handoff

**Acceptance:**

- Confirm the docs are understandable without reading the implementation.
- Confirm the docs are narrow enough to keep Chapter 06 reviewable.
- Record any open questions that must be answered before implementation.
