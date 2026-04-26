# Image-Rendering Source Rewrite Implementation Plan

**Goal:** 把 `image-rendering` 纳入统一 Tailwind 3 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec 与过程文档。

**Architecture:** 运行时位于 `src/_rules-wind3/behaviors.ts`。本轮核心是确认 Tailwind 3 默认 preset 没有 `image-rendering` core plugin，因此仓库当前 `image-render-*` 仅属于历史扩展，需要从默认暴露面移除。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4

---

## Scope

包含：

- `image-render-auto`
- `image-render-edge`
- `image-render-pixel`
- dedicated utility spec
- log / status / index / inventory / overall status

不包含：

- `cursor / pointer-events / resize / user-select`
- image-rendering migration 子集

## File Structure

### Existing files to modify

- `src/_rules-wind3/behaviors.ts`
- `test/preset-tailwind3.test.ts`
- `test/preset-tailwind3-tailwind-diff.test.ts`
- `test/tailwind-utility-spec.ts`
- `test/rewrite-session-automation.test.ts`
- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- `docs/superpowers/plans/2026-04-22-tailwind3-full-rewrite-phase2.md`

### New files to create

- `test/fixtures/tailwind-image-rendering-rewrite.ts`
- `docs/superpowers/specs/2026-04-26-image-rendering-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-26-image-rendering-source-rewrite.md`
- `docs/2026-04-26-image-rendering-source-rewrite-log.md`
- `docs/2026-04-26-image-rendering-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for `image-rendering`
- [x] Task 2: align `image-rendering` runtime with Tailwind 3 official semantics
- [x] Task 3: register utility spec, docs, and rewrite-session automation update

## Verification

- `./node_modules/.bin/vitest --run test/preset-tailwind3.test.ts -t "image-rendering"`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "image-rendering"`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-utility-spec.test.ts`
- `./node_modules/.bin/oxlint src/_rules-wind3/behaviors.ts test/preset-tailwind3.test.ts test/preset-tailwind3-tailwind-diff.test.ts test/tailwind-utility-spec.ts`
