# Fill Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `fill` 主规则族纳入完整 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec、blocklist migration 子集和过程文档。

**Architecture:** 运行时继续留在 `src/_rules/svg.ts`，不顺手扩到 `accent`、`caret` 或 `stroke`。主工作是把 `fill` 从现有 `svg / accent / caret colors` 混合测试中拆出来，形成 fill 专用 fixture、专用测试、专用 blocklist migration 子集和完整文档链路；只有新测试暴露真实偏差时才修改 runtime。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

包含：

- `fill-red-500`
- `fill-[#fff]`
- `fill-none`
- `fill-brand`
- `fill` utility spec
- `fill` blocklist migration 子集
- log / status / index / inventory / overall status

不包含：

- `fill-red500`
- `fill-opacity-50`
- `fill-op50`

## File Structure

### Existing files to modify

- `test/preset-tailwind3.test.ts`
- `test/preset-tailwind3-tailwind-diff.test.ts`
- `test/tailwind-utility-spec.ts`
- `test/preset-tailwind3-utility-spec.test.ts`
- `test/fixtures/blocklist-migration.ts`
- `test/preset-tailwind3-blocklist-messages.test.ts`
- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`

### New files to create

- `test/fixtures/tailwind-fill-rewrite.ts`
- `docs/superpowers/specs/2026-04-23-fill-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-23-fill-source-rewrite.md`
- `docs/2026-04-23-fill-source-rewrite-log.md`
- `docs/2026-04-23-fill-source-rewrite-status.md`

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
   - `test/fixtures/blocklist-migration.ts`
   - `test/preset-tailwind3-blocklist-messages.test.ts`
5. process docs
   - `docs/2026-04-23-fill-source-rewrite-log.md`
   - `docs/2026-04-23-fill-source-rewrite-status.md`
6. overall docs
   - `docs/2026-04-22-tailwind3-source-rewrite-index.md`
   - `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
   - `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
