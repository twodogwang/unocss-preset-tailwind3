# Text Shadow Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `text-shadow` 从 preset-tailwind3 runtime 中移除，并补齐 shared fixture、runtime/parity、utility spec、blocklist 治理子集和过程文档。

**Architecture:** 运行时继续留在 `src/_rules/typography.ts`，本轮明确 `text-shadow` 不是 Tailwind 3 原生 utility family，不顺手扩到 `line-clamp`。主工作是移除当前 `text-shadow*` 与 `text-shadow-color*` runtime 匹配、补 `text-shadow` 专用 fixture 与测试，并通过 blocklist 仅为少量可确定旧写法提供 arbitrary property replacement。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

包含：

- `text-shadow`
- `text-shadow-none`
- `text-shadow-sm`
- `text-shadow-md`
- `text-shadow-lg`
- `text-shadow-xl`
- `text-shadow-red-500`
- `text-shadow-[#fff]`
- `text-shadow-[0_0_#000]`
- `text-shadow-[0_0_10px_var(--x)]`
- `text-shadow-color-red-500`
- `text-shadow-color-[#fff]`
- `text-shadow-color-opacity-50`
- `text-shadow-color-op50`
- `text-shadow` utility spec
- `text-shadow` blocklist migration 子集
- log / status / index / inventory / overall status

不包含：

- arbitrary property `[text-shadow:...]`
- `text-stroke`
- `line-clamp`

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

- `test/fixtures/tailwind-text-shadow-rewrite.ts`
- `docs/superpowers/specs/2026-04-23-text-shadow-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-23-text-shadow-source-rewrite.md`
- `docs/2026-04-23-text-shadow-source-rewrite-log.md`
- `docs/2026-04-23-text-shadow-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for `text-shadow`
- [x] Task 2: remove native `text-shadow*` runtime matching and align with Tailwind 3 empty support boundary
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
