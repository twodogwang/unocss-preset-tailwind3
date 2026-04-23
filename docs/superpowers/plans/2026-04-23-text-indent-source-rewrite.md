# Text Indent Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `text-indent` 主规则族纳入完整 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec、blocklist migration 子集和过程文档。

**Architecture:** 运行时继续留在 `src/_rules/typography.ts`，本轮只治理 `text-indent` 主入口，不顺手扩到 `tab-size` 或 `text-wrap / text-overflow / text-transform`。主工作是把当前 `indent` 的宽匹配实现收敛为 Tailwind 3 正式的 spacing/theme/arbitrary 语法，并形成 text-indent 专用 fixture、专用测试、专用 blocklist migration 子集和完整文档链路。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

包含：

- `indent-0`
- `indent-px`
- `indent-<spacing>`
- `indent-[...]`
- `-indent-<spacing>`
- `-indent-[...]`
- `indent-<theme key>`
- `text-indent` utility spec
- `text-indent` blocklist migration 子集
- log / status / index / inventory / overall status

不包含：

- `indent`
- `indent-1/2`
- `-indent-1/2`
- `indent-full`
- `tab-size`
- `text-wrap / text-overflow / text-transform`

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

- `test/fixtures/tailwind-text-indent-rewrite.ts`
- `docs/superpowers/specs/2026-04-23-text-indent-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-23-text-indent-source-rewrite.md`
- `docs/2026-04-23-text-indent-source-rewrite-log.md`
- `docs/2026-04-23-text-indent-source-rewrite-status.md`

## Tasks

- [x] Task 1: create text-indent shared fixture and dedicated runtime/parity tests
- [x] Task 2: tighten runtime to official Tailwind 3 spacing/theme/arbitrary semantics
- [x] Task 3: register text-indent in utility spec, blocklist migration subset, docs, and rewrite-session automation

## Verification

- `pnpm exec vitest --run test/preset-tailwind3.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-blocklist-prefix-audit.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
- `pnpm run typecheck`
- `pnpm test`
