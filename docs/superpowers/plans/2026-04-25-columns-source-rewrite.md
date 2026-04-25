# Columns Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `columns` 纳入统一 Tailwind 3 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec、blocklist 治理子集和过程文档。

**Architecture:** 运行时留在 `src/_rules-wind3/columns.ts`，默认 `columns` key 放进 theme，blocklist 在 `src/blocklist.ts` 收口高置信度紧凑旧别名。本轮核心是把 `columns` 从 `theme.containers` 纠正为 `theme.columns`，补齐默认 columns key，并移除 `break-*` 的 global keyword 误接纳。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, pnpm

---

## Scope

包含：

- `columns`
- `break-before`
- `break-inside`
- `break-after`
- dedicated utility spec
- dedicated blocklist migration 子集
- log / status / index / inventory / overall status

不包含：

- `table display / caption / collapse`
- `grid-cols-*`

## File Structure

### Existing files to modify

- `src/_rules-wind3/columns.ts`
- `src/_theme/size.ts`
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

- `test/fixtures/tailwind-columns-rewrite.ts`
- `docs/superpowers/specs/2026-04-25-columns-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-25-columns-source-rewrite.md`
- `docs/2026-04-25-columns-source-rewrite-log.md`
- `docs/2026-04-25-columns-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for `columns`
- [x] Task 2: align `columns` runtime, theme typing, and `break-*` strictness with Tailwind 3 official semantics
- [x] Task 3: register utility spec, blocklist subset, docs, and rewrite-session automation update

## Verification

- `pnpm exec vitest --run test/preset-tailwind3.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-blocklist-prefix-audit.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
- `pnpm run typecheck`
- `pnpm test`
