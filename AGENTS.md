# AGENTS.md

## Scope

- These instructions apply to the whole repository.

## Public Documentation Boundaries

- `README.md` is public, end-user facing package documentation.
- `README.md` should only contain end-user package documentation such as package purpose, installation, configuration, exports, compatibility notes, and usage examples.
- `README.md` must not include repository maintenance details, internal release workflows, Changesets procedures, CI setup, source layout, architecture notes, coding rules, or agent instructions.
- When content could fit in either public docs or internal docs, prefer treating it as internal maintenance content and keep it out of `README.md`.

## Internal Documentation Placement

- Release process and versioning workflow belong in `.changeset/README.md` or dedicated workflow documentation.
- Contributor workflow, code conventions, and repository maintenance guidance belong in dedicated internal docs such as `CONTRIBUTING.md`, `docs/`, or workflow files.
- Agent-specific repository rules belong in `AGENTS.md`, not in `README.md`.
