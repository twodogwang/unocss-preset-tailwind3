# Transform Source Rewrite Implementation Plan

**Goal:** 把 `transform` 纳入统一 Tailwind 3 rewrite 模板，并补齐 shared fixture、runtime/parity、theme key、utility spec、blocklist 治理子集和过程文档。

**Architecture:** 运行时保持在 `src/_rules/transform.ts`，同时把 Tailwind 3 默认 `translate`、`rotate`、`scale`、`skew`、`transformOrigin` key 补回 `src/_theme/default.ts` / `src/_theme/misc.ts` / `src/_theme/types.ts`。本轮核心是把 transform 从宽松 parser 收口到 “theme key 或 bracket arbitrary” 两条合法路径。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4

---

## Scope

包含：

- `origin-*`
- `translate-x/y-*`
- `rotate-*`
- `skew-x/y-*`
- `scale*`
- `transform / transform-cpu / transform-gpu / transform-none`
- dedicated utility spec
- dedicated blocklist migration 子集
- log / status / index / inventory / overall status

不包含：

- `filters / backdrop-filters`
- `animation`
- `perspective / preserve-3d` 非 Tailwind 3 扩展

## File Structure

### Existing files to modify

- `src/_rules/transform.ts`
- `src/_theme/default.ts`
- `src/_theme/misc.ts`
- `src/_theme/types.ts`
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

- `test/fixtures/tailwind-transform-rewrite.ts`
- `docs/superpowers/specs/2026-04-26-transform-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-26-transform-source-rewrite.md`
- `docs/2026-04-26-transform-source-rewrite-log.md`
- `docs/2026-04-26-transform-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for `transform`
- [x] Task 2: align `transform` runtime and default theme keys with Tailwind 3 official semantics
- [x] Task 3: register utility spec, blocklist subset, docs, and rewrite-session automation update

## Verification

- `./node_modules/.bin/vitest --run test/preset-tailwind3.test.ts`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-tailwind-diff.test.ts`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-utility-spec.test.ts`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-blocklist-prefix-audit.test.ts`
- `./node_modules/.bin/vitest --run test/rewrite-session-automation.test.ts`
- `./node_modules/.bin/oxlint . --type-aware --type-check -A all`
- `./node_modules/.bin/vitest --run`
