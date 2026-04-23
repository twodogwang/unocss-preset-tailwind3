# Tab Size Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `tab-size` 从 preset-tailwind3 runtime 中移除，并补齐 shared fixture、runtime/parity、utility spec、blocklist migration 子集和过程文档。

**Architecture:** 运行时继续留在 `src/_rules/typography.ts`，本轮明确 `tab-size` 不是 Tailwind 3 原生 utility family，不顺手扩到 `text-stroke`。主工作是把当前 `tab-*` 宽匹配实现清空，只保留 blocklist migration 到 arbitrary property `[tab-size:...]`，并形成专用 fixture、专用测试、专用 blocklist migration 子集和完整文档链路。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

包含：

- `tab`
- `tab-1`
- `tab-4`
- `tab-8`
- `tab-[3]`
- `tab-[8]`
- `tab-[var(--n)]`
- `-tab-4`
- `tab-size-4`
- `tab-1/2`
- `tab-size` utility spec
- `tab-size` blocklist migration 子集
- log / status / index / inventory / overall status

不包含：

- arbitrary property `[tab-size:...]`
- `text-stroke`
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

- `test/fixtures/tailwind-tab-size-rewrite.ts`
- `docs/superpowers/specs/2026-04-23-tab-size-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-23-tab-size-source-rewrite.md`
- `docs/2026-04-23-tab-size-source-rewrite-log.md`
- `docs/2026-04-23-tab-size-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for `tab-size`
- [x] Task 2: remove native `tab-*` runtime matching and keep only high-confidence arbitrary-property migration
- [x] Task 3: register utility spec, blocklist migration subset, docs, and rewrite-session automation

## Verification

- `pnpm exec vitest --run test/preset-tailwind3.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-blocklist-prefix-audit.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
- `pnpm run typecheck`
- `pnpm test`
