# Justify Align Place Source Rewrite Implementation Plan

**Goal:** 把 `justify / align / place / flexGridJustifiesAlignments` 纳入统一 Tailwind 3 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec、blocklist 治理子集和过程文档。

**Architecture:** 运行时留在 `src/_rules/position.ts`，官方 utility 保持静态白名单，`flexGridJustifiesAlignments` 清空 runtime 暴露面，blocklist 在 `src/blocklist.ts` 收口高置信度 `flex-*` / `grid-*` 前缀复刻。本轮核心是删除 `safe/global/legacy-prefixed` 扩展，不引入新的 runtime 兼容层。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, pnpm

---

## Scope

包含：

- `justify`
- `align-content / align-items / align-self`
- `place-content / place-items / place-self`
- `flexGridJustifiesAlignments`
- dedicated utility spec
- dedicated blocklist migration 子集
- log / status / index / inventory / overall status

不包含：

- `text-align`
- `vertical-align`
- `transform`

## File Structure

### Existing files to modify

- `src/_rules/position.ts`
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

- `test/fixtures/tailwind-justify-align-place-rewrite.ts`
- `docs/superpowers/specs/2026-04-26-justify-align-place-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-26-justify-align-place-source-rewrite.md`
- `docs/2026-04-26-justify-align-place-source-rewrite-log.md`
- `docs/2026-04-26-justify-align-place-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for `justify / align / place`
- [x] Task 2: align `justify / align / place` runtime and legacy prefixed exposure with Tailwind 3 official semantics
- [x] Task 3: register utility spec, blocklist subset, docs, and rewrite-session automation update

## Verification

- `pnpm exec vitest --run test/preset-tailwind3.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-blocklist-prefix-audit.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
- `pnpm exec oxlint . --type-aware --type-check -A all`
- `pnpm exec vitest --run`
