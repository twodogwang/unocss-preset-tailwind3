# Text Stroke Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `text-stroke` 从 preset-tailwind3 runtime 中移除，并补齐 shared fixture、runtime/parity、utility spec、blocklist 治理子集和过程文档。

**Architecture:** 运行时继续留在 `src/_rules/typography.ts`，本轮明确 `text-stroke` 不是 Tailwind 3 原生 utility family，不顺手扩到 `text-shadow`。主工作是移除当前 `text-stroke*` runtime 匹配、补 `text-stroke` 专用 fixture 与测试，并通过 blocklist 只为高置信度旧写法提供 arbitrary property replacement。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

包含：

- `text-stroke`
- `text-stroke-0`
- `text-stroke-1`
- `text-stroke-2`
- `text-stroke-none`
- `text-stroke-sm`
- `text-stroke-md`
- `text-stroke-lg`
- `text-stroke-red-500`
- `text-stroke-[#fff]`
- `text-stroke-[3px]`
- `text-stroke-[length:var(--stroke)]`
- `text-stroke-opacity-50`
- `text-stroke-op50`
- `text-stroke` utility spec
- `text-stroke` blocklist migration 子集
- log / status / index / inventory / overall status

不包含：

- arbitrary property `[-webkit-text-stroke-width:...]`
- arbitrary property `[-webkit-text-stroke-color:...]`
- `text-shadow`

## File Structure

### Existing files to modify

- `src/_rules/typography.ts`
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

- `test/fixtures/tailwind-text-stroke-rewrite.ts`
- `docs/superpowers/specs/2026-04-23-text-stroke-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-23-text-stroke-source-rewrite.md`
- `docs/2026-04-23-text-stroke-source-rewrite-log.md`
- `docs/2026-04-23-text-stroke-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for `text-stroke`
- [x] Task 2: remove native `text-stroke*` runtime matching and align with Tailwind 3 empty support boundary
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
