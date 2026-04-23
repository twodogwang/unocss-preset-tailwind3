# Font Variant Numeric Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `font-variant-numeric` 纳入统一的 Tailwind 3 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec、blocklist 治理子集和过程文档。

**Architecture:** 运行时继续留在 `src/_rules-wind3/typography.ts`。本轮预期不改 runtime 行为，主工作是把这组官方 numeric feature utilities 模板化，并用 blocklist 收口一组高置信度旧别名。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, pnpm

---

## Scope

包含：

- `normal-nums`
- `ordinal`
- `slashed-zero`
- `lining-nums`
- `oldstyle-nums`
- `proportional-nums`
- `tabular-nums`
- `diagonal-fractions`
- `stacked-fractions`
- `nums-normal`
- `numeric-ordinal`
- `numeric-slashed-zero`
- `numeric-lining`
- `numeric-oldstyle`
- `numeric-proportional`
- `numeric-tabular`
- `fractions-diagonal`
- `fractions-stacked`
- `font-variant-numeric` utility spec
- `font-variant-numeric` blocklist migration 子集
- log / status / index / inventory / overall status

不包含：

- `numeric-[...]`
- `size / width / height / min / max`

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
- `test/rewrite-session-automation.test.ts`
- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`

### New files to create

- `test/fixtures/tailwind-font-variant-numeric-rewrite.ts`
- `docs/superpowers/specs/2026-04-23-font-variant-numeric-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-23-font-variant-numeric-source-rewrite.md`
- `docs/2026-04-23-font-variant-numeric-source-rewrite-log.md`
- `docs/2026-04-23-font-variant-numeric-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for `font-variant-numeric`
- [x] Task 2: confirm runtime parity and avoid unnecessary implementation drift
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
