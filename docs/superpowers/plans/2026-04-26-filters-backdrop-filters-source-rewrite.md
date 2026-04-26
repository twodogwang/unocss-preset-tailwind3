# Filters Backdrop-Filters Source Rewrite Implementation Plan

**Goal:** 把 `filters / backdrop-filters` 纳入统一 Tailwind 3 rewrite 模板，并补齐 shared fixture、runtime/parity、theme key、utility spec、blocklist 治理子集和过程文档。

**Architecture:** 运行时保持在 `src/_rules-wind3/filters.ts`，同时把 Tailwind 3 默认 `brightness`、`contrast`、`grayscale`、`hueRotate`、`invert`、`opacity`、`saturate`、`sepia` key 补回 `src/_theme/default.ts` / `src/_theme/filters.ts` / `src/_theme/types.ts`。本轮核心是把 filters 从宽松 parser 收口到 “theme key 或 bracket arbitrary” 两条合法路径，并把 `filter-*` / `backdrop-op-*` 从 raw blocklist 提升为 migration rule。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4

---

## Scope

包含：

- `blur-*`
- `brightness-*`
- `contrast-*`
- `drop-shadow*`
- `grayscale*`
- `hue-rotate-*`
- `invert*`
- `saturate-*`
- `sepia*`
- `backdrop-*` filter utilities
- `filter / filter-none`
- `backdrop-filter / backdrop-filter-none`
- dedicated utility spec
- dedicated blocklist migration 子集
- log / status / index / inventory / overall status

不包含：

- `animation`
- `opacity` 主规则族的全面重写
- `drop-shadow-color-*` 非官方扩展恢复

## File Structure

### Existing files to modify

- `src/_rules-wind3/filters.ts`
- `src/_theme/default.ts`
- `src/_theme/filters.ts`
- `src/_theme/types.ts`
- `src/blocklist.ts`
- `test/preset-tailwind3.test.ts`
- `test/preset-tailwind3-tailwind-diff.test.ts`
- `test/tailwind-utility-spec.ts`
- `test/preset-tailwind3-utility-spec.test.ts`
- `test/fixtures/blocklist-migration.ts`
- `test/preset-tailwind3-blocklist-messages.test.ts`
- `test/preset-tailwind3-blocklist-prefix-audit.test.ts`
- `test/rewrite-session-automation.test.ts`
- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- `docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md`

### New files to create

- `test/fixtures/tailwind-filters-rewrite.ts`
- `docs/superpowers/specs/2026-04-26-filters-backdrop-filters-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-26-filters-backdrop-filters-source-rewrite.md`
- `docs/2026-04-26-filters-backdrop-filters-source-rewrite-log.md`
- `docs/2026-04-26-filters-backdrop-filters-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for `filters / backdrop-filters`
- [x] Task 2: align `filters / backdrop-filters` runtime and default theme keys with Tailwind 3 official semantics
- [x] Task 3: register utility spec, blocklist subset, docs, and rewrite-session automation update

## Verification

- `./node_modules/.bin/vitest --run test/preset-tailwind3.test.ts`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-tailwind-diff.test.ts`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-utility-spec.test.ts`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-blocklist-prefix-audit.test.ts`
- `./node_modules/.bin/vitest --run test/rewrite-session-automation.test.ts`
- `./node_modules/.bin/oxlint . --type-aware --type-check -A all`
- `./node_modules/.bin/vitest --run`
