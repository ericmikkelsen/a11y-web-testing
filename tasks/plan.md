# Plan: Example Workflow Tasks

This file is a starter example. Copy and adapt it for your feature.

## Motivation

Use this plan to translate a feature spec into small, reviewable tasks with
clear acceptance criteria.

## Acceptance Criteria

- [ ] Every task has clear, testable acceptance criteria
- [ ] Tasks are ordered by dependency and can be implemented incrementally
- [ ] Task status is tracked in `tasks/todo.md`
- [ ] Scope notes capture non-goals and out-of-scope items

## Tasks

### Task 1: Define scope and constraints

**Acceptance:**

- Capture user problem, goals, and non-goals
- List technical constraints and assumptions
- Confirm dependencies on existing components or services

### Task 2: Implement smallest vertical slice

**Acceptance:**

- Deliver the smallest end-to-end path that proves the approach
- Add or update tests for expected behavior
- Keep the change reviewable and focused

### Task 3: Add quality gates and checks

**Acceptance:**

- Ensure lint, type-check, tests, and build steps are defined
- Verify local checks match CI expectations
- Document any required environment setup

### Task 4: Prepare PR communication

**Acceptance:**

- Summarize what changed and why
- Include validation evidence (tests, screenshots, or logs)
- Highlight risks, rollback notes, and follow-up tasks
