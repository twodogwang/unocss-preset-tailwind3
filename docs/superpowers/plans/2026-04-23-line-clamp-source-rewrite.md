# Line Clamp Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `line-clamp` 收敛到 Tailwind 3 正式语法，并补齐 shared fixture、runtime/parity、utility spec、blocklist 治理子集和过程文档。

**Architecture:** 运行时继续留在 `src/_rules-wind3/line-clamp.ts`。本轮不移除整族，而是把当前实现从“正整数 + none + globalKeywords”改成“正整数 + none + arbitrary value”，同时用 blocklist 把 `line-clamp-0` 与裸 global keyword 迁到 `line-clamp-[...]`。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

包含：

- `line-clamp-1`
- `line-clamp-3`
- `line-clamp-6`
- `line-clamp-none`
- `line-clamp-[3]`
- `line-clamp-[var(--n)]`
- `line-clamp-[inherit]`
- `line-clamp-[calc(var(--n))]`
- `line-clamp-0`
- `line-clamp-inherit`
- `line-clamp-initial`
- `line-clamp-unset`
- `line-clamp-revert`
- `line-clamp-revert-layer`
- `line-clamp` utility spec
- `line-clamp` blocklist migration 子集
- log / status / index / inventory / overall status

不包含：

- `text-shadow`
- `font-variant-numeric`

## File Structure

### Existing files to modify

- `src/_rules-wind3/line-clamp.ts`
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

### New files to create

- `test/fixtures/tailwind-line-clamp-rewrite.ts`
- `docs/superpowers/specs/2026-04-23-line-clamp-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-23-line-clamp-source-rewrite.md`
- `docs/2026-04-23-line-clamp-source-rewrite-log.md`
- `docs/2026-04-23-line-clamp-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for `line-clamp`
- [x] Task 2: align line-clamp runtime with Tailwind 3 official support boundary
- [x] Task 3: register utility spec, blocklist governance subset, docs, and rewrite-session automation update

## Verification

- `pnpm exec vitest --run test/preset-tailwind3.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-blocklist-prefix-audit.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
- `pnpm run typecheck`
- `pnpm test`
