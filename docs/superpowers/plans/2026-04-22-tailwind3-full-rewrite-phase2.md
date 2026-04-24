# Tailwind 3 Full Rewrite Phase 2 Plan

## Goal

在第一阶段主线完成后，继续把尚未进入 rewrite 模板的 Tailwind-facing 规则族按波次纳入统一治理，直到覆盖整个 preset。

## Planning Principles

- 以后不再以“挑几个高优先级 utility”方式推进，而是以
  [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
  为完整总表
- 每一波仍沿用既有模板：
  - shared fixture
  - runtime 正反向测试
  - Tailwind parity
  - utility spec
  - blocklist migration subset
  - spec / plan / log / status / index
- 波次内部优先按“真实偏差已知 + 相邻规则族可复用模板 + 写集尽量集中”排序

## Wave Plan

### Wave 1: Background And Adjacent Visual Families

范围：

- `background-color / bg-opacity`
- `background-style / gradient / clip / origin / repeat / position`
- `ring`
- `decoration / underline-offset`
- `shadow`
- `divide`

推荐顺序：

1. `background-color / bg-opacity`
2. `background-style / gradient`
3. `ring`
4. `decoration / underline-offset`
5. `shadow`
6. `divide`

原因：

- 这批规则族当前已经有较多综合测试与 blocklist 线索
- 都和颜色、视觉样式或 border 邻近，复用当前模板成本最低
- `background` 是当前最明显的“仓库里重要但未入重写模板”的空缺

### Wave 2: Typography Remaining Families And SVG Color Family

范围：

- `font`
- `text-align`
- `vertical-align`
- `text-decoration`
- `text-indent`
- `text-wrap / text-overflow / text-transform`
- `tab-size`
- `text-stroke`
- `text-shadow`
- `line-clamp`
- `font-variant-numeric`
- `fill`
- `accent`
- `caret`

### Wave 3: Size / Layout / Position Core Families

范围：

- `size / width / height / min / max`
- `aspect-ratio`
- `display`
- `overflow`
- `position / float / z / order / box-sizing`
- `container`
- `columns`
- `table` 剩余主规则族

### Wave 4: Layout Composition And Motion Core Families

范围：

- `flex`
- `grid`
- `justify / align / place`
- `transform`
- `filters / backdrop-filters`
- `animation`

### Wave 5: Remaining Behaviors And Static Utility Families

范围：

- `appearance`
- `will-change`
- `overscroll`
- `scroll-behavior`
- `touch-action`
- `list-style`
- `image-rendering`
- `cursor / pointer-events / resize / user-select`
- `white-space / breaks / hyphens / content-visibility / contents / field-sizing / color-scheme`

## Deliverable Rule

每完成一波，至少要同步更新：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)

## Immediate Next Step

`wave_3` 已完成 `size / width / height / min / max`、`aspect-ratio` 与 `display`。下一步进入 `overflow`，继续沿用完整 spec / plan / log / status + fixture / runtime / parity / utility spec / blocklist migration 模板，并把 full inventory 作为阶段 planning 依据。
