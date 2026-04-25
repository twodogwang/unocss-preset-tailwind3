# Table Display Caption Collapse Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `table display / caption / collapse` 纳入统一 Tailwind 3 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec 与过程文档。

**Architecture:** 运行时继续留在 `src/_rules-wind3/table.ts`。本轮核心是从现有实现中移除非官方 `table-empty-cells-*` 扩展，只保留 Tailwind 3 默认包支持的 table display、layout、caption 与 collapse 语义。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, pnpm

---

## Scope

包含：

- `table` display utilities
- `table-layout`
- `caption-side`
- `border-collapse`
- dedicated utility spec
- log / status / index / inventory / overall status

不包含：

- `border-spacing`
- blocklist migration 子集

## File Structure

### Existing files to modify

- `src/_rules-wind3/table.ts`
- `test/preset-tailwind3.test.ts`
- `test/preset-tailwind3-tailwind-diff.test.ts`
- `test/tailwind-utility-spec.ts`
- `test/preset-tailwind3-utility-spec.test.ts`
- `test/rewrite-session-automation.test.ts`
- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- `docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md`

### New files to create

- `test/fixtures/tailwind-table-rewrite.ts`
- `docs/superpowers/specs/2026-04-25-table-display-caption-collapse-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-25-table-display-caption-collapse-source-rewrite.md`
- `docs/2026-04-25-table-display-caption-collapse-source-rewrite-log.md`
- `docs/2026-04-25-table-display-caption-collapse-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for the table family
- [x] Task 2: remove non-tailwind table extensions and align runtime with official table semantics
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
