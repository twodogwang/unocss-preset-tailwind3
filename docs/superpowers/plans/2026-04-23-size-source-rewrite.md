# Size Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `size / width / height / min / max` 纳入统一 Tailwind 3 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec、blocklist 治理子集和过程文档。

**Architecture:** 运行时继续留在 `src/_rules/size.ts`，默认尺寸 token 拆在 `src/_theme/size.ts`。本轮收紧不同 size core plugin 的默认 key 边界，并把高置信度旧写法迁移到 Tailwind 3 canonical 或 arbitrary value。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, pnpm

---

## Scope

包含：

- `w-*` / `h-*`
- `min-w-*` / `min-h-*`
- `max-w-*` / `max-h-*`
- `size-*`
- viewport key: `w-svw` / `w-lvw` / `w-dvw` / `h-svh` / `h-lvh` / `h-dvh`
- min/max height viewport key
- `max-w-screen-*`
- `size` utility spec
- `size` blocklist migration 子集
- log / status / index / inventory / overall status

不包含：

- `aspect-ratio`
- `display`
- layout / position 其余 wave_3 family

## File Structure

### Existing files to modify

- `src/_rules/size.ts`
- `src/_theme/size.ts`
- `src/_theme/default.ts`
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

- `test/fixtures/tailwind-size-rewrite.ts`
- `docs/superpowers/specs/2026-04-23-size-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-23-size-source-rewrite.md`
- `docs/2026-04-23-size-source-rewrite-log.md`
- `docs/2026-04-23-size-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for `size`
- [x] Task 2: align size runtime and default theme with Tailwind 3 official support boundary
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
