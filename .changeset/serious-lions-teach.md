---
'@twodogwang/unocss-preset-tailwind3': patch
---

Expose the blocklist autofix ESLint integration as a package export at `@twodogwang/unocss-preset-tailwind3/eslint`.

The exported plugin now supports the same high-confidence migration fixes that were previously only wired inside the IDE fixture, and also provides a factory entry for prefixed or localized projects.
