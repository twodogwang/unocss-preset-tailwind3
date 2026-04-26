# List-Style Source Rewrite Implementation Plan

**Goal:** 把 `list-style` 纳入统一 Tailwind 3 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec 与过程文档。

**Architecture:** 运行时保持在 `src/_rules-wind3/behaviors.ts`，并补齐 `src/_theme/default.ts` / `src/_theme/misc.ts` / `src/_theme/types.ts` 中的 `listStyleType` / `listStyleImage` 默认 key。本轮核心是把 `list-style` 收敛到 Tailwind 3 官方的 `listStyleType` / `listStylePosition` / `listStyleImage` 三块语义，并移除仓库当前内置的历史 alias、位置后缀组合和 global keyword shortcut。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4

---

## Scope

包含：

- `list-none`
- `list-disc`
- `list-decimal`
- `list-inside`
- `list-outside`
- `list-image-none`
- `list-[...]`
- `list-image-[...]`
- `theme.listStyleType`
- `theme.listStyleImage`
- dedicated utility spec
- log / status / index / inventory / overall status

不包含：

- `image-rendering`
- list-style migration 子集

## File Structure

### Existing files to modify

- `src/_rules-wind3/behaviors.ts`
- `src/_theme/default.ts`
- `src/_theme/misc.ts`
- `src/_theme/types.ts`
- `test/preset-tailwind3.test.ts`
- `test/preset-tailwind3-tailwind-diff.test.ts`
- `test/tailwind-utility-spec.ts`
- `test/rewrite-session-automation.test.ts`
- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- `docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md`

### New files to create

- `test/fixtures/tailwind-list-style-rewrite.ts`
- `docs/superpowers/specs/2026-04-26-list-style-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-26-list-style-source-rewrite.md`
- `docs/2026-04-26-list-style-source-rewrite-log.md`
- `docs/2026-04-26-list-style-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for `list-style`
- [x] Task 2: align `list-style` runtime with Tailwind 3 official semantics
- [x] Task 3: register utility spec, docs, and rewrite-session automation update

## Verification

- `./node_modules/.bin/vitest --run test/preset-tailwind3.test.ts -t "list-style"`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "list-style"`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-utility-spec.test.ts`
- `./node_modules/.bin/oxlint src/_rules-wind3/behaviors.ts src/_theme/default.ts src/_theme/misc.ts src/_theme/types.ts test/preset-tailwind3.test.ts test/preset-tailwind3-tailwind-diff.test.ts test/tailwind-utility-spec.ts`
