# Static Leftovers Source Rewrite Implementation Plan

**Goal:** 把 `white-space / breaks / hyphens / content-visibility / contents / field-sizing / color-scheme` 纳入统一 Tailwind 3 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec 与过程文档。

**Architecture:** 运行时主要位于 `src/_rules/static.ts` 和 `src/_rules/color.ts`，并补齐 `src/_theme/default.ts` / `src/_theme/misc.ts` / `src/_theme/types.ts` 中的 `content` 默认 key。本轮核心是收口静态 leftovers，只保留 Tailwind 3 官方仍默认暴露的部分。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4

---

## Scope

包含：

- `whitespace-*`
- `break-normal`
- `break-words`
- `break-all`
- `break-keep`
- `hyphens-none`
- `hyphens-manual`
- `hyphens-auto`
- `theme.content`
- `content-[...]`
- dedicated utility spec
- log / status / index / inventory / overall status

不包含：

- 额外 migration 子集

## File Structure

### Existing files to modify

- `src/_rules/static.ts`
- `src/_rules/color.ts`
- `src/_theme/default.ts`
- `src/_theme/misc.ts`
- `src/_theme/types.ts`
- `test/preset-tailwind3.test.ts`
- `test/preset-tailwind3-tailwind-diff.test.ts`
- `test/tailwind-utility-spec.ts`
- `test/rewrite-session-automation.test.ts`
- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- `docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md`

### New files to create

- `test/fixtures/tailwind-static-leftovers-rewrite.ts`
- `docs/superpowers/specs/2026-04-26-static-leftovers-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-26-static-leftovers-source-rewrite.md`
- `docs/2026-04-26-static-leftovers-source-rewrite-log.md`
- `docs/2026-04-26-static-leftovers-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for static leftovers
- [x] Task 2: align static leftovers runtime with Tailwind 3 official semantics
- [x] Task 3: register utility spec, docs, and rewrite-session automation update

## Verification

- `./node_modules/.bin/vitest --run test/preset-tailwind3.test.ts -t "white-space / breaks / hyphens / content-visibility / contents / field-sizing / color-scheme"`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "static leftover"`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "content keys"`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-utility-spec.test.ts`
- `./node_modules/.bin/oxlint src/_rules/static.ts src/_rules/color.ts src/_theme/default.ts src/_theme/misc.ts src/_theme/types.ts test/preset-tailwind3.test.ts test/preset-tailwind3-tailwind-diff.test.ts test/tailwind-utility-spec.ts`
