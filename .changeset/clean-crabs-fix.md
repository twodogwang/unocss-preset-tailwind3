---
'@twodogwang/unocss-preset-tailwind3': major
---

Align the preset more strictly with Tailwind CSS 3 by removing non-standard utility entry points that were still exposed by default.

This release removes the `css variables / css property shortcuts`, `question-mark` utilities, and the internal `__container` shortcut path from the default preset surface.

The standard `container` utility remains supported and is now matched directly by the runtime rule instead of routing through a shortcut indirection.

Blocklist migration hints are also updated so deprecated `color-#hex` syntax no longer suggests the removed arbitrary CSS property form.
