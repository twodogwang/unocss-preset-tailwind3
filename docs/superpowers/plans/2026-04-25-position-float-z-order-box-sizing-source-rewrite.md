# Position Float Z Order Box Sizing Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `position / inset leftovers / float / z / order / box-sizing` 纳入统一 Tailwind 3 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec、blocklist 治理子集和过程文档。

**Architecture:** 运行时留在 `src/_rules/position.ts`，默认 `order`/`zIndex` key 放进 theme，blocklist 在 `src/blocklist.ts` 收口历史别名。本轮核心是把 `order` 从裸数字宽接纳收敛到默认 key + arbitrary + theme key，并移除 `float/clear/box` 的 global keyword 误接纳。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, pnpm

---

## Scope

包含：

- `position`
- `order`
- `z-index`
- `float` / `clear`
- `box-sizing`
- dedicated utility spec
- dedicated blocklist migration 子集
- log / status / index / inventory / overall status

不包含：

- `inset` 主体
- `justify / align / place`
- `container`

## File Structure

### Existing files to modify

- `src/_rules/position.ts`
- `src/_theme/misc.ts`
- `src/_theme/default.ts`
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

- `test/fixtures/tailwind-position-float-z-order-box-sizing-rewrite.ts`
- `docs/superpowers/specs/2026-04-25-position-float-z-order-box-sizing-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-25-position-float-z-order-box-sizing-source-rewrite.md`
- `docs/2026-04-25-position-float-z-order-box-sizing-source-rewrite-log.md`
- `docs/2026-04-25-position-float-z-order-box-sizing-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for the position-related family
- [x] Task 2: align runtime, theme, and blocklist with Tailwind 3 official position/order/z/float/box-sizing semantics
- [x] Task 3: register utility spec, docs, and rewrite-session automation update

## Verification

- `pnpm exec vitest --run test/preset-tailwind3.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-blocklist-prefix-audit.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
- `pnpm run typecheck`
- `pnpm test`
