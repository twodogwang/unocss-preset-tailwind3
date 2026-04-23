# Divide Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `divide` 主规则族纳入完整 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec、blocklist migration 子集和过程文档。

**Architecture:** 运行时继续留在 `src/_rules-wind3/divide.ts`，主工作是把 `divide` 从现有 `border / divide` 综合测试中拆出来，形成 divide 专用 fixture、专用测试、专用 blocklist migration 子集和完整文档链路；同时移除 `divide-block` / `divide-inline` 这类非 Tailwind 3 扩展入口。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

包含：

- `divide-x`
- `divide-y-2`
- `divide-x-reverse`
- `divide-dashed`
- `divide-red-500`
- `divide-opacity-50`
- `divide-x-[3px]`
- `divide-x-gutter`
- `divide` utility spec
- `divide` blocklist migration 子集
- log / status / index / inventory / overall status

不包含：

- `divide-block`
- `divide-inline`
- `divide-block-reverse`
- `divide-inline-reverse`

## File Structure

### Existing files to modify

- `src/_rules-wind3/divide.ts`
- `src/blocklist.ts`
- `test/preset-tailwind3.test.ts`
- `test/preset-tailwind3-tailwind-diff.test.ts`
- `test/tailwind-utility-spec.ts`
- `test/preset-tailwind3-utility-spec.test.ts`
- `test/fixtures/blocklist-migration.ts`
- `test/preset-tailwind3-blocklist-messages.test.ts`
- `test/preset-tailwind3-blocklist-prefix-audit.test.ts`
- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`

### New files to create

- `test/fixtures/tailwind-divide-rewrite.ts`
- `docs/superpowers/specs/2026-04-23-divide-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-23-divide-source-rewrite.md`
- `docs/2026-04-23-divide-source-rewrite-log.md`
- `docs/2026-04-23-divide-source-rewrite-status.md`

## Testing Strategy

验证层分为 6 层：

1. runtime
   - `test/preset-tailwind3.test.ts`
2. Tailwind parity
   - `test/preset-tailwind3-tailwind-diff.test.ts`
3. utility spec
   - `test/tailwind-utility-spec.ts`
   - `test/preset-tailwind3-utility-spec.test.ts`
4. blocklist migration
   - `src/blocklist.ts`
   - `test/fixtures/blocklist-migration.ts`
   - `test/preset-tailwind3-blocklist-messages.test.ts`
   - `test/preset-tailwind3-blocklist-prefix-audit.test.ts`
5. process docs
   - `docs/2026-04-23-divide-source-rewrite-log.md`
   - `docs/2026-04-23-divide-source-rewrite-status.md`
6. overall docs
   - `docs/2026-04-22-tailwind3-source-rewrite-index.md`
   - `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
   - `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
