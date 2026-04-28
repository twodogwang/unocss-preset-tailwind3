---
'@twodogwang/unocss-preset-tailwind3': patch
---

Document the ESLint blocklist autofix coverage more explicitly and add a bilingual README section for the migration behavior.

The IDE ESLint fixture now consumes the package through the published `dist` exports, so local verification matches the real package entrypoint instead of importing source files directly.
