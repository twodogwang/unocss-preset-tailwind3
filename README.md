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

## ESLint Autofix Coverage

The package also exports an ESLint plugin entrypoint at `@twodogwang/unocss-preset-tailwind3/eslint`. Use it when you want blocklist diagnostics to participate in `eslint --fix`:

```js
import unocss from '@unocss/eslint-config/flat'
import { createEslintPluginTailwind3 } from '@twodogwang/unocss-preset-tailwind3/eslint'

export default [
  {
    ...unocss,
    plugins: {
      ...(unocss.plugins ?? {}),
      tailwind3: createEslintPluginTailwind3({
        enableFix: true,
      }),
    },
    rules: {
      ...unocss.rules,
      'unocss/blocklist': 'off',
      'tailwind3/blocklist-autofix': 'warn',
    },
  },
]
```

Set `enableFix: false` if you want diagnostics only and do not want `eslint --fix` to rewrite classes.

The current high-confidence autofix subset covers these legacy rule families:

- color aliases such as `c-#fff`, `text-#fff`, `bg-#fff`, `fill-#fff`, `stroke-#fff`, `accent-#fff`, and `caret-#fff`
- opacity aliases such as `bg-op50`, `border-op50`, `ring-op50`, `divide-op50`, `backdrop-op50`, and `op50`
- spacing and sizing aliases such as `w4`, `minw0`, `p4`, `mx2`, `gapx4`, `insetx-4`, `top4`, `scrollm-4`, `borderspacing-2`, and `spacex4`
- layout aliases such as `display-inline`, `of-hidden`, `columns3`, `flex-inline`, `auto-flow-row`, `rows-2`, `cols-2`, `pos-absolute`, `z10`, and `order2`
- border and decoration aliases such as `b-2`, `rd-md`, `shadowmd`, `decoration-none`, `underline-2`, `outline-width-2`, `ring-width-2`, and `stroke-width-2`
- typography aliases such as `text-size-sm`, `font-size-sm`, `text-color-red-500`, `text-indent-4`, `lh-6`, `font-tracking-wide`, `text-align-left`, `vertical-middle`, `fw-bold`, `case-upper`, `text-truncate`, `tab-4`, `line-clamp-inherit`, `numeric-lining`, and `fractions-diagonal`
- transform and effect aliases such as `transform-rotate-45`, `transform-origin-top-right`, `translate-x-12px`, `filter-blur-sm`, `text-shadow-none`, and the supported `text-stroke-*` width and hex color aliases

The current blocklist-only, no-autofix subset includes these rule families:

- gradient shorthands such as `bg-gradient-linear`, `bg-gradient-from-red-500`, `bg-gradient-stops-3`, and `shape-r`
- animation naming aliases such as `keyframes-spin` and `animate-name-wiggle`
- perspective and 3D transform aliases such as `perspective-1000px`, `perspective-origin-center`, and `preserve-3d`
- text shadow and text stroke tokens that do not map to a single safe replacement, such as `text-shadow-md`, `text-shadow-color-red-500`, and `text-stroke-red-500`

Those families still produce blocklist diagnostics, but they are intentionally left unfixed because the correct migration depends on surrounding classes, theme values, or a manual rewrite to arbitrary properties.

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
| `locale` | `'zh-CN'` | Controls built-in blocklist migration messages. Currently supports `'zh-CN'` and `'en'`. |
| `attributifyPseudo` | `false` | Passes through UnoCSS preset options for pseudo handling in attributify-style workflows. |

Example with options:

```ts
import { defineConfig } from 'unocss'
import presetTailwind3 from '@twodogwang/unocss-preset-tailwind3'

export default defineConfig({
  presets: [
    presetTailwind3({
      dark: 'media',
      locale: 'en',
      preflight: 'on-demand',
      important: '#app',
    }),
  ],
})
```

## Exports

The package default export is `presetTailwind3`. It also exposes named exports such as `rules`, `variants`, `shortcuts`, `shorthands`, `theme`, `colors`, and `preflights` for advanced composition. For ESLint autofix integration, use the dedicated subpath export `@twodogwang/unocss-preset-tailwind3/eslint`.

## Notes

- This package is designed for teams that want Tailwind-like authoring constraints on top of UnoCSS.
- Preflight is disabled by default.
- The blocklist is intentionally opinionated. It focuses on patterns that are high-confidence mismatches for Tailwind 3.

## 中文版

一个严格模式的 UnoCSS preset，用来把 utility 和 variant 的可用范围收窄到接近 Tailwind CSS 3.x 语义。

### 这个包解决什么问题

UnoCSS 本身非常灵活，但这种灵活性也会放进很多并不符合 Tailwind 语法的快捷写法和别名。这个 preset 适合希望继续使用 UnoCSS 作为引擎，同时把书写规则约束到更接近 Tailwind 3 的项目。

实际效果主要是：

- 接受 Tailwind 风格的 utilities 和 variants
- 拒绝大量 Tailwind 3 不支持的 UnoCSS / Windi 风格别名
- 保留和 Tailwind 3 兼容的 arbitrary values 与 arbitrary variants
- 为一部分旧写法提供迁移提示

### 安装

```bash
pnpm add -D unocss @twodogwang/unocss-preset-tailwind3
```

### 基本用法

```ts
import { defineConfig } from 'unocss'
import presetTailwind3 from '@twodogwang/unocss-preset-tailwind3'

export default defineConfig({
  presets: [
    presetTailwind3(),
  ],
})
```

### 包含内容

- 覆盖 spacing、sizing、layout、effects、color、transform、typography 等 Tailwind 3 风格 utility
- 提供 `hover:`、`focus:`、`dark:`、`sm:`、`max-md:`、`supports-[...]`、`[&>*]:...` 等 Tailwind 风格 variants
- 内置 blocklist，用来拒绝大量非 Tailwind 的别名和宽松缩写
- 为部分旧语法提供 migration message，例如 `c-#fff` -> `text-[#fff]`、`bg-op50` -> `bg-opacity-50`
- 可选的 preflight 生成，并支持 `on-demand`

### 示例行为

可接受的写法：

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

会被拒绝的写法：

```txt
w4
p4
c-#fff
bg-op50
lt-md:w-4
filter-blur-sm
transform-rotate-45
```

### ESLint 自动修复覆盖范围

包同时提供 `@twodogwang/unocss-preset-tailwind3/eslint` 这个 ESLint plugin 入口。如果你希望 blocklist 诊断参与 `eslint --fix`，可以这样接入：

```js
import unocss from '@unocss/eslint-config/flat'
import { createEslintPluginTailwind3 } from '@twodogwang/unocss-preset-tailwind3/eslint'

export default [
  {
    ...unocss,
    plugins: {
      ...(unocss.plugins ?? {}),
      tailwind3: createEslintPluginTailwind3({
        enableFix: true,
      }),
    },
    rules: {
      ...unocss.rules,
      'unocss/blocklist': 'off',
      'tailwind3/blocklist-autofix': 'warn',
    },
  },
]
```

如果你只想保留诊断、不希望 `eslint --fix` 改写 class，把 `enableFix` 设为 `false` 即可。

目前高置信度可自动修复的旧规则族包括：

- 颜色别名，如 `c-#fff`、`text-#fff`、`bg-#fff`、`fill-#fff`、`stroke-#fff`、`accent-#fff`、`caret-#fff`
- 透明度别名，如 `bg-op50`、`border-op50`、`ring-op50`、`divide-op50`、`backdrop-op50`、`op50`
- spacing 和 sizing 别名，如 `w4`、`minw0`、`p4`、`mx2`、`gapx4`、`insetx-4`、`top4`、`scrollm-4`、`borderspacing-2`、`spacex4`
- layout 别名，如 `display-inline`、`of-hidden`、`columns3`、`flex-inline`、`auto-flow-row`、`rows-2`、`cols-2`、`pos-absolute`、`z10`、`order2`
- border 和 decoration 别名，如 `b-2`、`rd-md`、`shadowmd`、`decoration-none`、`underline-2`、`outline-width-2`、`ring-width-2`、`stroke-width-2`
- typography 别名，如 `text-size-sm`、`font-size-sm`、`text-color-red-500`、`text-indent-4`、`lh-6`、`font-tracking-wide`、`text-align-left`、`vertical-middle`、`fw-bold`、`case-upper`、`text-truncate`、`tab-4`、`line-clamp-inherit`、`numeric-lining`、`fractions-diagonal`
- transform 和 effect 别名，如 `transform-rotate-45`、`transform-origin-top-right`、`translate-x-12px`、`filter-blur-sm`、`text-shadow-none`，以及当前支持的 `text-stroke-*` 宽度和十六进制颜色别名

目前只会报 blocklist、不做自动修复的规则族包括：

- gradient shorthand，如 `bg-gradient-linear`、`bg-gradient-from-red-500`、`bg-gradient-stops-3`、`shape-r`
- animation naming 别名，如 `keyframes-spin`、`animate-name-wiggle`
- perspective 和 3D transform 别名，如 `perspective-1000px`、`perspective-origin-center`、`preserve-3d`
- 无法映射到单一安全替换目标的 `text-shadow` / `text-stroke` token，如 `text-shadow-md`、`text-shadow-color-red-500`、`text-stroke-red-500`

这些规则族仍然会产生 blocklist 诊断，但不会自动修复，因为正确迁移通常依赖周边 class、theme 值，或者需要手工改写成 arbitrary property。

### 配置

`presetTailwind3()` 支持以下选项：

| 选项 | 默认值 | 说明 |
| --- | --- | --- |
| `dark` | `'class'` | 深色模式策略。可选 `'class'`、`'media'`，或 `{ dark: '.dark', light: '.light' }` 这类自定义选择器。 |
| `preflight` | `false` | 开启生成的 CSS variable preflight。传 `'on-demand'` 时只输出已激活项。 |
| `arbitraryVariants` | `true` | 开启 arbitrary variant extractor，用于 `[&>*]:...` 这类选择器变体。 |
| `variablePrefix` | `'un-'` | 改写生成的 CSS 自定义属性前缀，例如把 `--un-...` 改成自定义前缀。 |
| `important` | `false` | 为声明增加 `!important`，或在传入选择器字符串时把规则收敛到某个容器下。 |
| `prefix` | `undefined` | 在项目需要 utility 前缀时启用 UnoCSS 前缀。 |
| `locale` | `'zh-CN'` | 控制内置 blocklist migration message 语言。目前支持 `'zh-CN'` 和 `'en'`。 |
| `attributifyPseudo` | `false` | 透传给 UnoCSS preset 的 pseudo 相关配置，适用于 attributify 风格工作流。 |

带选项的示例：

```ts
import { defineConfig } from 'unocss'
import presetTailwind3 from '@twodogwang/unocss-preset-tailwind3'

export default defineConfig({
  presets: [
    presetTailwind3({
      dark: 'media',
      locale: 'en',
      preflight: 'on-demand',
      important: '#app',
    }),
  ],
})
```

### 导出

包的默认导出是 `presetTailwind3`。同时也暴露了 `rules`、`variants`、`shortcuts`、`shorthands`、`theme`、`colors`、`preflights` 等命名导出，便于高级组合使用。需要接入 ESLint autofix 时，请使用专门的子路径导出 `@twodogwang/unocss-preset-tailwind3/eslint`。

### 说明

- 这个包适合希望在 UnoCSS 之上施加 Tailwind 风格书写约束的团队。
- `preflight` 默认关闭。
- blocklist 是刻意带倾向性的，只聚焦那些与 Tailwind 3 明显不一致、且能高置信判断的问题写法。
