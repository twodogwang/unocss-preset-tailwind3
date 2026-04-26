# Will-Change Source Rewrite Implementation Plan

**Goal:** 把 `will-change` 纳入统一 Tailwind 3 rewrite 模板，并补齐 shared fixture、runtime/parity、Tailwind-style theme 语义、utility spec 与过程文档。

**Architecture:** 运行时保持在 `src/_rules/behaviors.ts`，同时把 Tailwind 3 默认 `willChange` key 补回 `src/_theme/default.ts` / `src/_theme/misc.ts` / `src/_theme/types.ts`。本轮核心是让 `will-change-*` 只接受官方 theme key 与 bracket arbitrary value，并移除 `inherit / initial / revert` 这类 global keyword 与未命中的裸 property shortcut。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4

---

## Scope

包含：

- `will-change-auto`
- `will-change-scroll`
- `will-change-contents`
- `will-change-transform`
- `will-change-[...]`
- root `theme.willChange`
- dedicated utility spec
- log / status / index / inventory / overall status

不包含：

- `overscroll`
- `scroll-behavior`
- `will-change-*` 旧写法 migration replacement

## File Structure

### Existing files to modify

- `src/_rules/behaviors.ts`
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

- `test/fixtures/tailwind-will-change-rewrite.ts`
- `docs/superpowers/specs/2026-04-26-will-change-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-26-will-change-source-rewrite.md`
- `docs/2026-04-26-will-change-source-rewrite-log.md`
- `docs/2026-04-26-will-change-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for `will-change`
- [x] Task 2: align `will-change` runtime and default theme keys with Tailwind 3 official semantics
- [x] Task 3: register utility spec, docs, and rewrite-session automation update

## Verification

- `./node_modules/.bin/vitest --run test/preset-tailwind3.test.ts`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-tailwind-diff.test.ts`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-utility-spec.test.ts`
- `./node_modules/.bin/vitest --run test/rewrite-session-automation.test.ts`
- `./node_modules/.bin/oxlint . --type-aware --type-check -A all`
- `./node_modules/.bin/vitest --run`
