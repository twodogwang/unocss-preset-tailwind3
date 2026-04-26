# Overscroll Source Rewrite Implementation Plan

**Goal:** 把 `overscroll` 纳入统一 Tailwind 3 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec 与过程文档。

**Architecture:** 运行时保持在 `src/_rules-wind3/behaviors.ts`。本轮核心是把 `overscroll` / `overscroll-x` / `overscroll-y` 收敛到 Tailwind 3 官方的 `auto / contain / none` 静态 utility，并移除当前由 `makeGlobalStaticRules(...)` 带进来的 global keyword shortcut。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4

---

## Scope

包含：

- `overscroll-auto`
- `overscroll-contain`
- `overscroll-none`
- `overscroll-x-*`
- `overscroll-y-*`
- dedicated utility spec
- log / status / index / inventory / overall status

不包含：

- `scroll-behavior`
- `overscroll` migration 子集

## File Structure

### Existing files to modify

- `src/_rules-wind3/behaviors.ts`
- `test/preset-tailwind3.test.ts`
- `test/preset-tailwind3-tailwind-diff.test.ts`
- `test/tailwind-utility-spec.ts`
- `test/rewrite-session-automation.test.ts`
- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- `docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md`

### New files to create

- `test/fixtures/tailwind-overscroll-rewrite.ts`
- `docs/superpowers/specs/2026-04-26-overscroll-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-26-overscroll-source-rewrite.md`
- `docs/2026-04-26-overscroll-source-rewrite-log.md`
- `docs/2026-04-26-overscroll-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for `overscroll`
- [x] Task 2: align `overscroll` runtime with Tailwind 3 official semantics
- [x] Task 3: register utility spec, docs, and rewrite-session automation update

## Verification

- `./node_modules/.bin/vitest --run test/preset-tailwind3.test.ts`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-tailwind-diff.test.ts`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-utility-spec.test.ts`
- `./node_modules/.bin/vitest --run test/rewrite-session-automation.test.ts`
- `./node_modules/.bin/oxlint . --type-aware --type-check -A all`
- `./node_modules/.bin/vitest --run`
