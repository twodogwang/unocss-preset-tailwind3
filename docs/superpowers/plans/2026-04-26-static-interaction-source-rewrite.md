# Static Interaction Source Rewrite Implementation Plan

**Goal:** 把 `cursor / pointer-events / resize / user-select` 纳入统一 Tailwind 3 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec 与过程文档。

**Architecture:** 运行时位于 `src/_rules/static.ts`，并补齐 `src/_theme/default.ts` / `src/_theme/misc.ts` / `src/_theme/types.ts` 中的 `cursor` 默认 key。本轮核心是按 Tailwind 3 官方语义收口 `cursor`、`pointer-events`、`resize`、`user-select` 四个静态族。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4

---

## Scope

包含：

- `theme.cursor`
- `cursor-[...]`
- `pointer-events-auto`
- `pointer-events-none`
- `resize`
- `resize-x`
- `resize-y`
- `resize-none`
- `select-auto`
- `select-all`
- `select-text`
- `select-none`
- dedicated utility spec
- log / status / index / inventory / overall status

不包含：

- `white-space / breaks / hyphens / content-visibility / contents / field-sizing / color-scheme`
- static interaction migration 子集

## File Structure

### Existing files to modify

- `src/_rules/static.ts`
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

- `test/fixtures/tailwind-static-interaction-rewrite.ts`
- `docs/superpowers/specs/2026-04-26-static-interaction-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-26-static-interaction-source-rewrite.md`
- `docs/2026-04-26-static-interaction-source-rewrite-log.md`
- `docs/2026-04-26-static-interaction-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for static interaction utilities
- [x] Task 2: align static interaction runtime with Tailwind 3 official semantics
- [x] Task 3: register utility spec, docs, and rewrite-session automation update

## Verification

- `./node_modules/.bin/vitest --run test/preset-tailwind3.test.ts -t "cursor / pointer-events / resize / user-select"`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "static interaction"`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "cursor keys"`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-utility-spec.test.ts`
- `./node_modules/.bin/oxlint src/_rules/static.ts src/_theme/default.ts src/_theme/misc.ts src/_theme/types.ts test/preset-tailwind3.test.ts test/preset-tailwind3-tailwind-diff.test.ts test/tailwind-utility-spec.ts`
