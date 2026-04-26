# Appearance Source Rewrite Implementation Plan

**Goal:** 把 `appearance` 纳入统一 Tailwind 3 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec 与过程文档。

**Architecture:** 运行时保持在 `src/_rules/behaviors.ts`。本轮重点不是重写实现，而是验证当前 runtime 已经收敛到 Tailwind 3 官方的 `appearance-auto` / `appearance-none` 两个静态 utility，并补上 shared fixture、utility spec 与文档治理。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4

---

## Scope

包含：

- `appearance-auto`
- `appearance-none`
- dedicated utility spec
- log / status / index / inventory / overall status

不包含：

- `will-change`
- `overscroll`
- 任何 appearance 扩展 alias 的自动 migration replacement

## File Structure

### Existing files to modify

- `test/preset-tailwind3.test.ts`
- `test/preset-tailwind3-tailwind-diff.test.ts`
- `test/tailwind-utility-spec.ts`
- `test/rewrite-session-automation.test.ts`
- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- `docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md`

### New files to create

- `test/fixtures/tailwind-appearance-rewrite.ts`
- `docs/superpowers/specs/2026-04-26-appearance-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-26-appearance-source-rewrite.md`
- `docs/2026-04-26-appearance-source-rewrite-log.md`
- `docs/2026-04-26-appearance-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for `appearance`
- [x] Task 2: confirm current `appearance` runtime already matches Tailwind 3 official semantics
- [x] Task 3: register utility spec, docs, and rewrite-session automation update

## Verification

- `./node_modules/.bin/vitest --run test/preset-tailwind3.test.ts`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-tailwind-diff.test.ts`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-utility-spec.test.ts`
- `./node_modules/.bin/vitest --run test/rewrite-session-automation.test.ts`
- `./node_modules/.bin/oxlint . --type-aware --type-check -A all`
- `./node_modules/.bin/vitest --run`
