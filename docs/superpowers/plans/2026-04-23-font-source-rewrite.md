# Font Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `font` 主规则族纳入完整 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec、blocklist migration 子集和过程文档。

**Architecture:** 运行时继续留在 `src/_rules/typography.ts`，本轮只治理 `font family / font weight` 主入口，不顺手扩到 `text-align`、`font-stretch` 或 `font-synthesis`。主工作是把 `font` 从现有混合测试中拆出来，形成 font 专用 fixture、专用测试、专用 blocklist migration 子集和完整文档链路；只有新测试暴露真实偏差时才修改 runtime。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

包含：

- `font-sans`
- `font-mono`
- `font-bold`
- `font-[650]`
- `font-brand`
- `font` utility spec
- `font` blocklist migration 子集
- log / status / index / inventory / overall status

不包含：

- `fontbold`
- `font-style-*`
- `font-stretch-*`
- `font-synthesis-*`
- `word-spacing-*`

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
- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- `test/rewrite-session-automation.test.ts`

### New files to create

- `test/fixtures/tailwind-font-rewrite.ts`
- `docs/superpowers/specs/2026-04-23-font-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-23-font-source-rewrite.md`
- `docs/2026-04-23-font-source-rewrite-log.md`
- `docs/2026-04-23-font-source-rewrite-status.md`
