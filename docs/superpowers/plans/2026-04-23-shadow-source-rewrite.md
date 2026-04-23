# Shadow Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `shadow` 主规则族纳入完整 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec、blocklist migration 子集和过程文档。

**Architecture:** 运行时暂时继续留在 `src/_rules/shadow.ts`，不顺手扩到 `drop-shadow` 或 filters。主工作是把 `shadow` 从现有 `effects / filters / transform` 混合测试中拆出来，形成 shadow 专用 fixture、专用测试、专用 blocklist migration 子集和完整文档链路；只有新测试暴露真实偏差时才修改 runtime。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

包含：

- `shadow`
- `shadow-md`
- `shadow-inner`
- `shadow-none`
- `shadow-red-500`
- `shadow-[#000]`
- `shadow-[0_0_10px_rgba(0,0,0,0.35)]`
- `shadow` utility spec
- `shadow` blocklist migration 子集
- log / status / index / inventory / overall status

不包含：

- `shadow-op50`
- `shadow-opacity-50`
- `drop-shadow-*`
- `filter-*`
- `backdrop-*`

## File Structure

### Existing files to modify

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

- `test/fixtures/tailwind-shadow-rewrite.ts`
- `docs/superpowers/specs/2026-04-23-shadow-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-23-shadow-source-rewrite.md`
- `docs/2026-04-23-shadow-source-rewrite-log.md`
- `docs/2026-04-23-shadow-source-rewrite-status.md`

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
   - `docs/2026-04-23-shadow-source-rewrite-log.md`
   - `docs/2026-04-23-shadow-source-rewrite-status.md`
6. overall docs
   - `docs/2026-04-22-tailwind3-source-rewrite-index.md`
   - `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
   - `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
