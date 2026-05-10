# Project Coding Standards

## Commits

- Use [Conventional Commits](https://www.conventionalcommits.org/) for every commit
- Format: `<type>(<optional scope>): <description>`
- Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`, `ci`, `build`, `style`
- Breaking changes: append `!` after the type (e.g., `feat!:`) or add `BREAKING CHANGE:` in the footer
- Commits are linted automatically on every PR via the `Conventional Commits` workflow

## Versioning

- Versions are managed automatically by [semantic-release](https://semantic-release.gitbook.io/semantic-release/)
- `fix:` → patch bump · `feat:` → minor bump · `feat!:` / `BREAKING CHANGE:` → major bump
- Every push to `main` is evaluated immediately; semantic-release tags the release and updates `CHANGELOG.md`
- Never manually edit `package.json` version or `CHANGELOG.md`

## Testing

- Write tests before or alongside implementation (TDD)
- For bugs: write a failing test first, then fix (Prove-It pattern)
- Run tests before every commit: `npm test`

## Code Quality

- Review across five axes: correctness, readability, architecture, security, performance
- Every PR must pass: lint, type check, tests, build
- No secrets in code or version control — use environment variables

## Implementation

- Build in small, verifiable increments (one slice at a time)
- Each increment: implement → test → verify → commit
- Never mix formatting changes with behavior changes in the same commit
- Target ~100 lines per commit; split PRs over ~300 lines

## Boundaries

- **Always:** Run tests before commits, validate user input, follow conventional commit format
- **Ask first:** Database schema changes, new dependencies, breaking API changes
- **Never:** Commit secrets, remove failing tests without approval, skip CI verification

## Skills

The following [Addy Osmani agent skills](https://github.com/addyosmani/agent-skills) are available in `.github/skills/`:

- `git-workflow-and-versioning` — Commit discipline, branching strategy, conventional commits
- `ci-cd-and-automation` — Quality gate pipelines, GitHub Actions patterns
- `code-review-and-quality` — Five-axis review checklist with configurable reviewability budget
- `test-driven-development` — TDD cycle and Prove-It pattern for bug fixes
- `spec-driven-development` — Spec-before-code workflow with human review gates
- `incremental-implementation` — Thin vertical slices, scope discipline, rollback-friendly changes
- `narrative-branching` — Story/chapter branch structure for readable, reviewable AI-generated code
- `visual-pr-communication` — Mermaid change map, before/after narrative, junior-dev-friendly PR descriptions
- `prototype-decomposition` — Two-phase rescue of oversized prototype branches into story and chapters

## Chat Modes

Ten Copilot chat modes are available in `.github/chat-modes/`. Select a mode in the
Copilot Chat UI to activate its workflow.

This `.github/copilot-instructions.md` file is the authoritative source for Copilot
instructions in this repository. Any mirrored copies must stay synchronized with this
file to avoid conflicting guidance for contributors.
