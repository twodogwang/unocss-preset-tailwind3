# AGENTS.md

## Scope

- These instructions apply to the whole repository.

## Branching Rules

- Do not commit directly to `main`.
- Do not perform feature work on `main`.
- Create or switch to a non-`main` branch before making changes.
- Changes must reach `main` through pull requests only.
- If work is accidentally committed on `main`, move the commit to a feature branch and restore local `main` before continuing.

## Release Rules

- Do not publish stable releases directly from a feature branch or from local manual commands.
- Stable releases must reach `main` through a pull request.
- When preparing a stable release, add or update the required Changeset on the feature branch, then open a PR targeting `main`.
- Let the repository release workflow create or update the version PR, and let the workflow publish from `main` after the release PR is merged.
- Do not manually run `changeset publish`, `pnpm release:publish`, or npm publish commands for stable releases unless explicitly instructed to perform an emergency manual publish.
- Release-managed files such as `package.json`, `CHANGELOG.md`, and consumed `.changeset/*.md` files should be changed by the release workflow or by a dedicated `changeset-release/*` PR, not by ordinary feature work.

## Beta Release Rules

- Do not publish beta releases directly from a feature branch.
- Beta releases must reach `beta` through a pull request.
- When preparing a beta release, add or update the required Changeset on the feature branch, then open a PR targeting `beta`.
- Let the repository release workflow publish beta versions from the `beta` branch after the PR is merged.
- Do not manually run `changeset publish`, `pnpm release:publish`, or `pnpm release:publish:beta` from a feature branch unless explicitly instructed to perform an emergency manual publish.
- Release-managed files such as `package.json`, `CHANGELOG.md`, and `.changeset/pre.json` should be changed by the release workflow or by a dedicated `release/*` PR, not by ordinary feature work.

## Public Documentation Boundaries

- `README.md` is public, end-user facing package documentation.
- `README.md` should only contain end-user package documentation such as package purpose, installation, configuration, exports, compatibility notes, and usage examples.
- `README.md` must not include repository maintenance details, internal release workflows, Changesets procedures, CI setup, source layout, architecture notes, coding rules, or agent instructions.
- When content could fit in either public docs or internal docs, prefer treating it as internal maintenance content and keep it out of `README.md`.

## Internal Documentation Placement

- Release process and versioning workflow belong in `.changeset/README.md` or dedicated workflow documentation.
- Contributor workflow, code conventions, and repository maintenance guidance belong in dedicated internal docs such as `CONTRIBUTING.md`, `docs/`, or workflow files.
- Agent-specific repository rules belong in `AGENTS.md`, not in `README.md`.
