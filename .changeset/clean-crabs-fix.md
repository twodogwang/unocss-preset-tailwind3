---
'@twodogwang/unocss-preset-tailwind3': major
---

Align the preset more strictly with Tailwind CSS 3 by removing non-standard utility entry points that were still exposed by default.

This release removes the `css variables / css property shortcuts`, `question-mark` utilities, and the internal `__container` shortcut path from the default preset surface.

The standard `container` utility remains supported and is now matched directly by the runtime rule instead of routing through a shortcut indirection.

Blocklist migration hints are also updated so deprecated `color-#hex` syntax no longer suggests the removed arbitrary CSS property form.

This release also adds reusable blocklist migration autofix helpers and an IDE ESLint fixture that consumes the package through `dist` exports instead of direct source imports.

Documented autofix-covered rule families:

- color aliases such as `c-#fff`, `text-#fff`, `bg-#fff`, `fill-#fff`, `stroke-#fff`, `accent-#fff`, and `caret-#fff`
- opacity aliases such as `bg-op50`, `border-op50`, `ring-op50`, `divide-op50`, `backdrop-op50`, and `op50`
- spacing and sizing aliases such as `w4`, `minw0`, `p4`, `mx2`, `gapx4`, `insetx-4`, `top4`, `scrollm-4`, `borderspacing-2`, and `spacex4`
- layout aliases such as `display-inline`, `of-hidden`, `columns3`, `flex-inline`, `auto-flow-row`, `rows-2`, `cols-2`, `pos-absolute`, `z10`, and `order2`
- border and decoration aliases such as `b-2`, `rd-md`, `shadowmd`, `decoration-none`, `underline-2`, `outline-width-2`, `ring-width-2`, and `stroke-width-2`
- typography aliases such as `text-size-sm`, `font-size-sm`, `text-color-red-500`, `text-indent-4`, `lh-6`, `font-tracking-wide`, `text-align-left`, `vertical-middle`, `fw-bold`, `case-upper`, `text-truncate`, `tab-4`, `line-clamp-inherit`, `numeric-lining`, and `fractions-diagonal`
- transform and effect aliases such as `transform-rotate-45`, `transform-origin-top-right`, `translate-x-12px`, `filter-blur-sm`, `text-shadow-none`, and the supported `text-stroke-*` width and hex color aliases

Documented blocklist-only, no-autofix rule families:

- gradient shorthands such as `bg-gradient-linear`, `bg-gradient-from-red-500`, `bg-gradient-stops-3`, and `shape-r`
- animation naming aliases such as `keyframes-spin` and `animate-name-wiggle`
- perspective and 3D transform aliases such as `perspective-1000px`, `perspective-origin-center`, and `preserve-3d`
- text shadow and text stroke tokens that do not map to a single safe replacement, such as `text-shadow-md`, `text-shadow-color-red-500`, and `text-stroke-red-500`
