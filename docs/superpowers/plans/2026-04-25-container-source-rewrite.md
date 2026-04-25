# Container Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `container` 纳入统一 Tailwind 3 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec 与过程文档。

**Architecture:** 运行时留在 `src/_rules-wind3/container.ts`，shortcut 留在 `src/shortcuts.ts`，theme 类型在 `src/_theme/types.ts` 对齐 `theme.container.screens`。本轮核心是让 `container` 直接生成 Tailwind 风格的 base + media output，而不是依赖历史 breakpoint shortcut 推导。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, pnpm

---

## Scope

包含：

- `container`
- 响应式 `container` 变体
- `theme.container.screens` / `center` / `padding`
- dedicated utility spec
- log / status / index / inventory / overall status

不包含：

- `@container`
- `container queries`
- blocklist migration 子集
- `columns`

## File Structure

### Existing files to modify

- `src/_rules-wind3/container.ts`
- `src/shortcuts.ts`
- `src/_theme/types.ts`
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

- `test/fixtures/tailwind-container-rewrite.ts`
- `docs/superpowers/specs/2026-04-25-container-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-25-container-source-rewrite.md`
- `docs/2026-04-25-container-source-rewrite-log.md`
- `docs/2026-04-25-container-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for `container`
- [x] Task 2: align `container` runtime, shortcut, and theme typing with Tailwind 3 official `screens` / `center` / `padding` semantics
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
