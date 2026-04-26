# Animation Source Rewrite Implementation Plan

**Goal:** 把 `animation` 纳入统一 Tailwind 3 rewrite 模板，并补齐 shared fixture、runtime/parity、Tailwind-style theme 语义、utility spec 与过程文档。

**Architecture:** 运行时保持在 `src/_rules-wind3/animation.ts`，但把仓库自定义的 `theme.animation.keyframes/durations/timingFns/counts` 结构收敛为 Tailwind 官方的根级 `theme.animation` 与 `theme.keyframes`。本轮核心是让 `animate-*` 只接受官方 theme key、`animate-none` 与 bracket arbitrary value，并在 prefix 模式下同步重写生成的 keyframe 名称。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4

---

## Scope

包含：

- `animate-none`
- `animate-spin`
- `animate-ping`
- `animate-pulse`
- `animate-bounce`
- `animate-[...]`
- root `theme.animation`
- root `theme.keyframes`
- prefix 下的 keyframe 重写
- dedicated utility spec
- log / status / index / inventory / overall status

不包含：

- `appearance`
- `transition` 已完成部分
- 旧 animation alias 的自动 migration replacement

## File Structure

### Existing files to modify

- `src/_rules-wind3/animation.ts`
- `src/theme.ts`
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

- `test/fixtures/tailwind-animation-rewrite.ts`
- `docs/superpowers/specs/2026-04-26-animation-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-26-animation-source-rewrite.md`
- `docs/2026-04-26-animation-source-rewrite-log.md`
- `docs/2026-04-26-animation-source-rewrite-status.md`

## Tasks

- [x] Task 1: create shared fixture and dedicated runtime/parity tests for `animation`
- [x] Task 2: align `animation` runtime and default theme shape with Tailwind 3 official semantics
- [x] Task 3: register utility spec, docs, and rewrite-session automation update

## Verification

- `./node_modules/.bin/vitest --run test/preset-tailwind3.test.ts`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-tailwind-diff.test.ts`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-utility-spec.test.ts`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
- `./node_modules/.bin/vitest --run test/preset-tailwind3-blocklist-prefix-audit.test.ts`
- `./node_modules/.bin/vitest --run test/rewrite-session-automation.test.ts`
- `./node_modules/.bin/oxlint . --type-aware --type-check -A all`
- `./node_modules/.bin/vitest --run`
