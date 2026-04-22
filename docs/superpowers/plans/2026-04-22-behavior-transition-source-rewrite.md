# Behavior Transition Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `behavior` 的最后一轮源头重写收敛到 `transition` 主规则族，补齐 fixture、utility spec、migration 子集与总表文档，并在完成后收口整个源头重写主线。

**Architecture:** 运行时继续由 `src/_rules/transition.ts` 与 `src/_theme/transition.ts` 提供，除非测试暴露真实偏差，否则不主动改逻辑。主工作放在 fixture、runtime/parity 测试、utility spec、blocklist migration 和整体文档同步上。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

这份计划只覆盖 `behavior` 的 `transition` 主规则族。

包含：

- `transition`
- `transition-*`
- `duration-*`
- `delay-*`
- `ease-*`
- 本子阶段相关 utility spec
- 本子阶段相关 blocklist migration message
- 本子阶段的过程日志与任务进度

不包含：

- `outline`
- `appearance-*`
- `will-change-*`
- `scroll-smooth`
- `overscroll-*`
- `touch-*`

## File Structure

### Existing files to modify

- `test/preset-tailwind3.test.ts`
- `test/preset-tailwind3-tailwind-diff.test.ts`
- `test/tailwind-utility-spec.ts`
- `test/preset-tailwind3-utility-spec.test.ts`
- `test/fixtures/blocklist-migration.ts`
- `test/preset-tailwind3-blocklist-messages.test.ts`
- `test/preset-tailwind3-blocklist-prefix-audit.test.ts`
- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- `test/preset-tailwind3-document-governance.test.ts`

### Existing files likely unchanged unless tests prove otherwise

- `src/_rules/transition.ts`
- `src/_theme/transition.ts`
- `src/blocklist.ts`

### New files to create

- `test/fixtures/tailwind-transition-rewrite.ts`
- `docs/2026-04-22-behavior-transition-source-rewrite-log.md`
- `docs/2026-04-22-behavior-transition-source-rewrite-status.md`

## Task 1: Initialize Transition Fixtures And Tracking

**Files:**
- Create: `test/fixtures/tailwind-transition-rewrite.ts`
- Create: `docs/2026-04-22-behavior-transition-source-rewrite-log.md`
- Create: `docs/2026-04-22-behavior-transition-source-rewrite-status.md`
- Modify: `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- Modify: `test/preset-tailwind3.test.ts`
- Modify: `test/preset-tailwind3-tailwind-diff.test.ts`
- Modify: `test/fixtures/blocklist-migration.ts`
- Modify: `test/preset-tailwind3-blocklist-messages.test.ts`

- [ ] **Step 1: Write the failing test**

把 `transition` 从 `outline / transition` 混合段中切到 shared fixture，并增加 transition 专用 blocklist migration subset 测试。

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts -t "transition migration"`
Expected: FAIL，因为 transition 共享子集和专用断言还没建立。

- [ ] **Step 3: Write minimal implementation**

这里只做 fixture、文档和测试入口接线，不改 runtime。

- [ ] **Step 4: Run test to verify it still fails for the right reason**

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts -t "transition migration"`
Expected: FAIL，失败点集中在 migration subset coverage。

- [ ] **Step 5: Commit**

```bash
git add docs/2026-04-22-behavior-transition-source-rewrite-log.md docs/2026-04-22-behavior-transition-source-rewrite-status.md docs/2026-04-22-tailwind3-source-rewrite-index.md test/fixtures/tailwind-transition-rewrite.ts test/fixtures/blocklist-migration.ts test/preset-tailwind3-blocklist-messages.test.ts test/preset-tailwind3.test.ts test/preset-tailwind3-tailwind-diff.test.ts
git commit -m "test: initialize behavior transition rewrite tracking"
```

## Task 2: Lock Transition Utility Spec And Semantic CSS

**Files:**
- Modify: `test/tailwind-utility-spec.ts`
- Modify: `test/preset-tailwind3-utility-spec.test.ts`
- Modify: `test/preset-tailwind3.test.ts`
- Modify: `docs/2026-04-22-behavior-transition-source-rewrite-log.md`
- Modify: `docs/2026-04-22-behavior-transition-source-rewrite-status.md`

- [ ] **Step 1: Write the failing test**

增加 `transition` utility spec 与语义断言。

- [ ] **Step 2: Run test to verify it fails**

Run:
- `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "transition"`

- [ ] **Step 3: Write minimal implementation**

新增 spec 条目，并锁住 transition property / duration / delay / ease 的关键 CSS 输出。

- [ ] **Step 4: Run test to verify green**

Run:
- `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "transition"`
- `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "transition"`

- [ ] **Step 5: Commit**

```bash
git add test/tailwind-utility-spec.ts test/preset-tailwind3-utility-spec.test.ts test/preset-tailwind3.test.ts docs/2026-04-22-behavior-transition-source-rewrite-log.md docs/2026-04-22-behavior-transition-source-rewrite-status.md
git commit -m "feat: lock behavior transition semantics"
```

## Task 3: Finalize Governance And Close Source Rewrite

**Files:**
- Modify: `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- Modify: `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- Modify: `test/preset-tailwind3-document-governance.test.ts`
- Modify: `docs/2026-04-22-behavior-transition-source-rewrite-log.md`
- Modify: `docs/2026-04-22-behavior-transition-source-rewrite-status.md`

- [ ] **Step 1: Write the failing test**

要求整体文档反映：

- `behavior` 已完成
- live manifest 指向当前子阶段文档
- 源头重写主线没有剩余 `pending` utility

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`

- [ ] **Step 3: Write minimal implementation**

更新总表、整体状态与治理测试，完成整个源头重写主线收口。

- [ ] **Step 4: Run full verification**

Run:
- `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
- `pnpm test`
- `pnpm run typecheck`

- [ ] **Step 5: Commit**

```bash
git add docs/2026-04-22-tailwind3-source-rewrite-index.md docs/2026-04-21-tailwind-grammar-debt-task-status.md test/preset-tailwind3-document-governance.test.ts docs/2026-04-22-behavior-transition-source-rewrite-log.md docs/2026-04-22-behavior-transition-source-rewrite-status.md
git commit -m "test: finalize behavior transition governance"
```
