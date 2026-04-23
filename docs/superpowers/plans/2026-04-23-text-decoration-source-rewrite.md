# Text Decoration Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `text-decoration` 主规则族纳入完整 rewrite 模板，并从 `decoration / underline-offset` 中拆出独立的 shared fixture、runtime/parity、utility spec、blocklist migration 子集和过程文档。

**Architecture:** 运行时继续留在 `src/_rules/decoration.ts`，本轮只治理 `text-decoration-line` 主入口，不顺手扩到 `text-indent` 或 `decoration` 的厚度/样式/颜色/offset 语义。主工作是把 `underline / overline / line-through / no-underline` 形成独立模板，并把 `decoration-*` 历史 line 别名收敛到 blocklist migration。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

包含：

- `underline`
- `overline`
- `line-through`
- `no-underline`
- `text-decoration` utility spec
- `text-decoration` blocklist migration 子集
- log / status / index / inventory / overall status

不包含：

- `decoration-<thickness>`
- `decoration-<style>`
- `decoration-<color>`
- `underline-offset-*`
- `text-indent`

## File Structure

### Existing files to modify

- `src/blocklist.ts`
- `test/fixtures/tailwind-decoration-rewrite.ts`
- `test/fixtures/blocklist-migration.ts`
- `test/preset-tailwind3.test.ts`
- `test/preset-tailwind3-tailwind-diff.test.ts`
- `test/tailwind-utility-spec.ts`
- `test/preset-tailwind3-utility-spec.test.ts`
- `test/preset-tailwind3-blocklist-messages.test.ts`
- `test/preset-tailwind3-blocklist-prefix-audit.test.ts`
- `test/rewrite-session-automation.test.ts`
- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`

### New files to create

- `test/fixtures/tailwind-text-decoration-rewrite.ts`
- `docs/superpowers/specs/2026-04-23-text-decoration-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-23-text-decoration-source-rewrite.md`
- `docs/2026-04-23-text-decoration-source-rewrite-log.md`
- `docs/2026-04-23-text-decoration-source-rewrite-status.md`

## Tasks

- [x] Task 1: split shared fixtures and dedicated runtime/parity tests for `text-decoration`
- [x] Task 2: register `text-decoration` in utility spec and extract its blocklist migration subset
- [x] Task 3: sync spec / plan / log / status and overall tracking docs, then update rewrite automation next-family expectation

## Verification

- `pnpm exec vitest --run test/preset-tailwind3.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-blocklist-prefix-audit.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
- `pnpm run typecheck`
- `pnpm test`
