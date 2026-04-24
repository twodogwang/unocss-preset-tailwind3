# Display Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `display` 纳入统一 Tailwind 3 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec、blocklist 治理子集和过程文档。

**Architecture:** 运行时留在 `src/_rules/static.ts`，blocklist 在 `src/blocklist.ts` 收口历史别名。本轮核心是移除 `display-(.+)` 宽匹配，只保留 Tailwind 3 官方静态 display utilities。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, pnpm

---

## Scope

包含：

- `block`
- `inline`
- `inline-block`
- `contents`
- `flow-root`
- `list-item`
- `hidden`
- `display` utility spec
- `display` blocklist migration 子集
- log / status / index / inventory / overall status

不包含：

- `flex`
- `grid`
- `table display / caption / collapse`
- `overflow`

## File Structure

### Existing files to modify

- `src/_rules/static.ts`
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

- `test/fixtures/tailwind-display-rewrite.ts`
- `docs/superpowers/specs/2026-04-24-display-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-24-display-source-rewrite.md`
- `docs/2026-04-24-display-source-rewrite-log.md`
- `docs/2026-04-24-display-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for `display`
- [x] Task 2: align display runtime and blocklist with Tailwind 3 official static display semantics
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
