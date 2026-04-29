# Changelog

## 1.0.0-beta.2

### Patch Changes

- d5d4be6: Expose the blocklist autofix ESLint integration as a package export at `@twodogwang/unocss-preset-tailwind3/eslint`.

  The exported plugin now supports the same high-confidence migration fixes that were previously only wired inside the IDE fixture, and also provides a factory entry for prefixed, localized, or diagnostics-only projects via `enableFix: false`.

## 1.0.0-beta.1

### Patch Changes

- 5cb7815: Document the ESLint blocklist autofix coverage more explicitly and add a bilingual README section for the migration behavior.

  The IDE ESLint fixture now consumes the package through the published `dist` exports, so local verification matches the real package entrypoint instead of importing source files directly.

## 0.2.0

### Minor Changes

- ef1c3ad: Restore Tailwind 3 strictness when `prefix` is enabled and block legacy syntaxes consistently under prefixed usage.

  Add localized blocklist migration messages via the `locale` option, with built-in `zh-CN` and `en` support.

  Fix prefixed negative utility handling and add exhaustive blocklist prefix audit coverage for migration and raw blocklist rules.

## 0.1.3

### Patch Changes

- Run the release workflow on Node.js 24 and keep verbose publish diagnostics to avoid npm CLI upgrade failures in GitHub Actions.

## 0.1.2

### Patch Changes

- Refresh the npm CLI before publishing and print verbose release diagnostics to help debug npm publish failures in GitHub Actions.

## 0.1.1

### Patch Changes

- Add blocklist migration hints for common legacy utility aliases and set up a tag-driven release workflow with changelog support.

## 0.1.0

- Initial release.
