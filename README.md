# @twodogwang/unocss-preset-tailwind3

A strict UnoCSS preset that narrows the utility and variant surface to match Tailwind CSS 3.x semantics.

## Why this package exists

UnoCSS is intentionally flexible, but that flexibility also allows many shortcuts and aliases that are not valid Tailwind syntax. This preset is for projects that want UnoCSS as the engine while keeping authoring rules much closer to Tailwind CSS 3.

In practice, it helps you:

- accept Tailwind-style utilities and variants
- reject many UnoCSS / Windi-style aliases that Tailwind 3 does not support
- keep arbitrary values and arbitrary variants that are compatible with Tailwind 3
- provide migration hints for a curated set of legacy shortcuts

## Installation

```bash
pnpm add -D unocss @twodogwang/unocss-preset-tailwind3
```

## Basic usage

```ts
import { defineConfig } from 'unocss'
import presetTailwind3 from '@twodogwang/unocss-preset-tailwind3'

export default defineConfig({
  presets: [
    presetTailwind3(),
  ],
})
```

## What it includes

- Tailwind 3 style utility coverage for spacing, sizing, layout, effects, color, transform, typography, and more
- Tailwind-style variants such as `hover:`, `focus:`, `dark:`, `sm:`, `max-md:`, `supports-[...]`, and arbitrary selector variants like `[&>*]:...`
- a blocklist that rejects many non-Tailwind aliases and loose shorthand forms
- migration messages for selected legacy patterns, for example `c-#fff` -> `text-[#fff]` and `bg-op50` -> `bg-opacity-50`
- optional preflight generation with support for `on-demand`

## Example behavior

Accepted examples:

```txt
w-4
px-6
text-red-500
dark:text-white
max-md:hidden
[&>*]:p-4
w-[123px]
supports-[display:grid]:grid
```

Rejected examples:

```txt
w4
p4
c-#fff
bg-op50
lt-md:w-4
filter-blur-sm
transform-rotate-45
```

## Configuration

`presetTailwind3()` accepts the following options:

| Option | Default | Description |
| --- | --- | --- |
| `dark` | `'class'` | Dark mode strategy. Use `'class'`, `'media'`, or custom selectors like `{ dark: '.dark', light: '.light' }`. |
| `preflight` | `false` | Enables generated CSS variable preflights. Use `'on-demand'` to emit only activated entries. |
| `arbitraryVariants` | `true` | Enables the arbitrary variant extractor used for selectors such as `[&>*]:...`. |
| `variablePrefix` | `'un-'` | Rewrites generated CSS custom property names, for example `--un-...` to a custom prefix. |
| `important` | `false` | Adds `!important` to declarations or scopes selectors under a container when set to a selector string. |
| `prefix` | `undefined` | Applies UnoCSS utility prefixes if your project needs prefixed class names. |
| `attributifyPseudo` | `false` | Passes through UnoCSS preset options for pseudo handling in attributify-style workflows. |

Example with options:

```ts
import { defineConfig } from 'unocss'
import presetTailwind3 from '@twodogwang/unocss-preset-tailwind3'

export default defineConfig({
  presets: [
    presetTailwind3({
      dark: 'media',
      preflight: 'on-demand',
      important: '#app',
    }),
  ],
})
```

## Exports

The package default export is `presetTailwind3`. It also exposes named exports such as `rules`, `variants`, `shortcuts`, `shorthands`, `theme`, `colors`, and `preflights` for advanced composition.

## Notes

- This package is designed for teams that want Tailwind-like authoring constraints on top of UnoCSS.
- Preflight is disabled by default.
- The blocklist is intentionally opinionated. It focuses on patterns that are high-confidence mismatches for Tailwind 3.

## Repository maintenance

- This repository includes a conservative Renovate baseline in `renovate.json`.
- Updates are grouped around UnoCSS packages, the TypeScript toolchain, CSS tooling, and GitHub Actions to reduce PR noise.
- To activate Renovate, install the Renovate GitHub App for this repository or the parent organization.
