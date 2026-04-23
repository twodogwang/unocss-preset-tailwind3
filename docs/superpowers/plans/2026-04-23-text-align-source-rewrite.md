# Text Align Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `text-align` 主规则族纳入完整 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec、blocklist migration 子集和过程文档。

**Architecture:** 运行时继续留在 `src/_rules/align.ts`，本轮只治理 `text-align` 主入口，不顺手扩到 `vertical-align`。主工作是把 `text-align` 从当前宽匹配实现中收紧为 Tailwind 3 正式语法，并形成 text-align 专用 fixture、专用测试、专用 blocklist migration 子集和完整文档链路。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

包含：

- `text-left`
- `text-center`
- `text-right`
- `text-justify`
- `text-start`
- `text-end`
- `text-align` utility spec
- `text-align` blocklist migration 子集
- log / status / index / inventory / overall status

不包含：

- `text-align-inherit`
- `vertical-align`
- `align-*`
- `v-*`

## File Structure

### Existing files to modify

- `src/_rules/align.ts`
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

- `test/fixtures/tailwind-text-align-rewrite.ts`
- `docs/superpowers/specs/2026-04-23-text-align-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-23-text-align-source-rewrite.md`
- `docs/2026-04-23-text-align-source-rewrite-log.md`
- `docs/2026-04-23-text-align-source-rewrite-status.md`
