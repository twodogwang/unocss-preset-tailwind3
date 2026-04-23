# Text Wrap Text Overflow Text Transform Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `text-wrap / text-overflow / text-transform` 主规则族纳入完整 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec、blocklist migration 子集和过程文档。

**Architecture:** 运行时继续留在 `src/_rules/static.ts`，本轮只治理 `text-wrap / text-overflow / text-transform` 主入口，不顺手扩到 `white-space / breaks / hyphens` 或 `tab-size / line-clamp`。主工作是把当前 `case-*` / `text-truncate` 的历史别名收敛为 Tailwind 3 正式的 `uppercase / lowercase / capitalize / normal-case` 与 `truncate`，并形成专用 fixture、专用测试、专用 blocklist migration 子集和完整文档链路。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

包含：

- `truncate`
- `text-ellipsis`
- `text-clip`
- `text-wrap`
- `text-nowrap`
- `text-balance`
- `text-pretty`
- `uppercase`
- `lowercase`
- `capitalize`
- `normal-case`
- `text-wrap / text-overflow / text-transform` utility spec
- `text-wrap / text-overflow / text-transform` blocklist migration 子集
- log / status / index / inventory / overall status

不包含：

- `white-space`
- `break-*`
- `hyphens-*`
- `tab-size`
- `line-clamp`

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

### New files to create

- `test/fixtures/tailwind-text-wrap-overflow-transform-rewrite.ts`
- `docs/superpowers/specs/2026-04-23-text-wrap-text-overflow-text-transform-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-23-text-wrap-text-overflow-text-transform-source-rewrite.md`
- `docs/2026-04-23-text-wrap-text-overflow-text-transform-source-rewrite-log.md`
- `docs/2026-04-23-text-wrap-text-overflow-text-transform-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for `text-wrap / text-overflow / text-transform`
- [x] Task 2: tighten runtime to official Tailwind 3 `truncate`, `text-wrap-*`, and `text-transform` semantics
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
