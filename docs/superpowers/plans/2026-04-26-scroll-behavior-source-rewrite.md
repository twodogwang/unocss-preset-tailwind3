# Scroll-Behavior Source Rewrite Implementation Plan

**Goal:** 把 `scroll-behavior` 纳入统一 Tailwind 3 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec 与过程文档。

**Architecture:** 运行时保持在 `src/_rules-wind3/behaviors.ts`。本轮核心是把 `scroll-behavior` 收敛到 Tailwind 3 官方的 `scroll-auto` / `scroll-smooth` 两个静态 utility，并移除当前由 `makeGlobalStaticRules('scroll', ...)` 带进来的 global keyword shortcut。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4

---

## Scope

包含：

- `scroll-auto`
- `scroll-smooth`
- dedicated utility spec
- log / status / index / inventory / overall status

不包含：

- `touch-action`
- scroll-behavior migration 子集

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

- `test/fixtures/tailwind-scroll-behavior-rewrite.ts`
- `docs/superpowers/specs/2026-04-26-scroll-behavior-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-26-scroll-behavior-source-rewrite.md`
- `docs/2026-04-26-scroll-behavior-source-rewrite-log.md`
- `docs/2026-04-26-scroll-behavior-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for `scroll-behavior`
- [x] Task 2: align `scroll-behavior` runtime with Tailwind 3 official semantics
- [x] Task 3: register utility spec, docs, and rewrite-session automation update

## Verification

- `./node_modules/.bin/vitest --run test/preset-tailwind3.test.ts`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-tailwind-diff.test.ts`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-utility-spec.test.ts`
- `./node_modules/.bin/vitest --run test/rewrite-session-automation.test.ts`
- `./node_modules/.bin/oxlint . --type-aware --type-check -A all`
- `./node_modules/.bin/vitest --run`
