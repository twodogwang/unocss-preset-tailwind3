# AGENTS.md

## Scope

- These instructions apply to the whole repository.

## Branching Rules

- Do not commit directly to `main`.
- Do not perform feature work on `main`.
- Create or switch to a non-`main` branch before making changes.
- Changes must reach `main` through pull requests only.
- If work is accidentally committed on `main`, move the commit to a feature branch and restore local `main` before continuing.

## Public Documentation Boundaries

- `README.md` is public, end-user facing package documentation.
- `README.md` should only contain end-user package documentation such as package purpose, installation, configuration, exports, compatibility notes, and usage examples.
- `README.md` must not include repository maintenance details, internal release workflows, Changesets procedures, CI setup, source layout, architecture notes, coding rules, or agent instructions.
- When content could fit in either public docs or internal docs, prefer treating it as internal maintenance content and keep it out of `README.md`.

## Internal Documentation Placement

- Release process and versioning workflow belong in `.changeset/README.md` or dedicated workflow documentation.
- Contributor workflow, code conventions, and repository maintenance guidance belong in dedicated internal docs such as `CONTRIBUTING.md`, `docs/`, or workflow files.
- Agent-specific repository rules belong in `AGENTS.md`, not in `README.md`.
