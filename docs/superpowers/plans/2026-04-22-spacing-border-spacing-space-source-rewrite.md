# Spacing Border Spacing Space Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `spacing` 的最后一个子阶段 `border-spacing / space-*` 纳入 Tailwind CSS 3 源头重写治理模板，补上 `space-x/y` 的正式支持，拒绝 `space-inline/block` 扩展，并收口整体文档状态。

**Architecture:** `border-spacing-*` 继续由 `src/_rules-wind3/table.ts` 提供；`space-*` 继续由 `src/_rules-wind3/spacing.ts` 提供，但只保留 `space-x/y-*` 与 `space-x/y-reverse` 主规则族，并在 `src/rules.ts` 中正式接入。主工作仍放在 fixture、runtime/parity、utility spec、blocklist migration 和整体文档同步上。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

这份计划只覆盖 `spacing` 的 `border-spacing / space-*` 子阶段。

包含：

- `border-spacing-*`
- `border-spacing-x-*`
- `border-spacing-y-*`
- `space-x-*`
- `space-y-*`
- `space-x-reverse`
- `space-y-reverse`
- 本子阶段相关 utility spec
- 本子阶段相关 blocklist migration message
- 本子阶段的过程日志与任务进度

不包含：

- `padding / margin`
- `gap / inset / scroll-*`
- `space-inline-*`
- `space-block-*`
- `behavior`

## File Structure

### Existing files to modify

- `src/_rules-wind3/spacing.ts`
  - 收敛到 `space-x/y-*` 与 reverse
- `src/rules.ts`
  - 正式接入 `spaces`
- `src/blocklist.ts`
  - `border-spacing / space-*` 高置信度迁移提示
- `test/preset-tailwind3.test.ts`
  - runtime 边界和语义测试
- `test/preset-tailwind3-tailwind-diff.test.ts`
  - Tailwind parity 测试
- `test/tailwind-utility-spec.ts`
  - 本子阶段 utility spec 登记
- `test/preset-tailwind3-utility-spec.test.ts`
  - utility spec 同步断言
- `test/fixtures/blocklist-migration.ts`
  - 本子阶段迁移提示共享样例
- `test/preset-tailwind3-blocklist-messages.test.ts`
  - blocklist message 测试
- `test/preset-tailwind3-blocklist-prefix-audit.test.ts`
  - blocklist 前缀审计
- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
  - 整体任务唯一实时入口
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
  - 整体状态文档
- `test/preset-tailwind3-document-governance.test.ts`
  - 文档治理测试

### Existing files likely unchanged unless tests prove otherwise

- `src/_rules-wind3/table.ts`

### New files to create

- `test/fixtures/tailwind-spacing-border-spacing-space-rewrite.ts`
- `docs/2026-04-22-spacing-border-spacing-space-source-rewrite-log.md`
- `docs/2026-04-22-spacing-border-spacing-space-source-rewrite-status.md`

## Task 1: Initialize Border Spacing Space Fixtures And Tracking

**Files:**
- Create: `test/fixtures/tailwind-spacing-border-spacing-space-rewrite.ts`
- Create: `docs/2026-04-22-spacing-border-spacing-space-source-rewrite-log.md`
- Create: `docs/2026-04-22-spacing-border-spacing-space-source-rewrite-status.md`
- Modify: `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- Modify: `test/preset-tailwind3.test.ts`
- Modify: `test/preset-tailwind3-tailwind-diff.test.ts`
- Modify: `test/fixtures/blocklist-migration.ts`
- Modify: `test/preset-tailwind3-blocklist-messages.test.ts`

- [ ] **Step 1: Write the failing test**

把 `border-spacing / space-*` 从综合测试中拆到 shared fixture，并增加 blocklist migration subset 测试。

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts -t "border spacing space"`
Expected: FAIL，因为迁移提示和 fixture 还没建好。

- [ ] **Step 3: Write minimal implementation**

这里只做 fixture、文档和 dedicated 测试入口接线，不改 runtime。

- [ ] **Step 4: Run test to verify it still fails for the right reason**

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts -t "border spacing space"`
Expected: FAIL，失败点集中在 migration coverage。

- [ ] **Step 5: Commit**

```bash
git add docs/2026-04-22-spacing-border-spacing-space-source-rewrite-log.md docs/2026-04-22-spacing-border-spacing-space-source-rewrite-status.md docs/2026-04-22-tailwind3-source-rewrite-index.md test/fixtures/tailwind-spacing-border-spacing-space-rewrite.ts test/fixtures/blocklist-migration.ts test/preset-tailwind3-blocklist-messages.test.ts test/preset-tailwind3.test.ts test/preset-tailwind3-tailwind-diff.test.ts
git commit -m "test: initialize spacing border spacing space rewrite tracking"
```

## Task 2: Add Border Spacing Space Runtime Support And Migration Hints

**Files:**
- Modify: `src/_rules-wind3/spacing.ts`
- Modify: `src/rules.ts`
- Modify: `src/blocklist.ts`
- Modify: `test/preset-tailwind3-blocklist-prefix-audit.test.ts`
- Modify: `docs/2026-04-22-spacing-border-spacing-space-source-rewrite-log.md`
- Modify: `docs/2026-04-22-spacing-border-spacing-space-source-rewrite-status.md`

- [ ] **Step 1: Write the failing test**

用 runtime / parity / blocklist 证明：

- `space-x-4`、`space-y-2`、`space-x-reverse` 当前缺失
- `space-inline-*` / `space-block-*` 不能被正式接入
- `borderspacing-2`、`spacex-4` 等旧写法需要迁移提示

- [ ] **Step 2: Run test to verify it fails**

Run:
- `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "border-spacing / space"`
- `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "border-spacing / space"`
- `pnpm exec vitest --run test/preset-tailwind3-blocklist-prefix-audit.test.ts`

Expected:
- `space-x/y` 正向用例 FAIL
- blocklist 审计 FAIL

- [ ] **Step 3: Write minimal implementation**

- 在 `src/_rules-wind3/spacing.ts` 中删掉 `space-inline/block` 扩展
- 在 `src/rules.ts` 中接入 `spaces`
- 在 `src/blocklist.ts` 中添加高置信度迁移提示

- [ ] **Step 4: Run test to verify green**

Run:
- `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "border-spacing / space"`
- `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "border-spacing / space"`
- `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts -t "border spacing space"`
- `pnpm exec vitest --run test/preset-tailwind3-blocklist-prefix-audit.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/_rules-wind3/spacing.ts src/rules.ts src/blocklist.ts test/preset-tailwind3-blocklist-prefix-audit.test.ts docs/2026-04-22-spacing-border-spacing-space-source-rewrite-log.md docs/2026-04-22-spacing-border-spacing-space-source-rewrite-status.md
git commit -m "feat: add spacing border spacing space semantics"
```

## Task 3: Lock Utility Spec And Semantic CSS

**Files:**
- Modify: `test/tailwind-utility-spec.ts`
- Modify: `test/preset-tailwind3-utility-spec.test.ts`
- Modify: `test/preset-tailwind3.test.ts`
- Modify: `docs/2026-04-22-spacing-border-spacing-space-source-rewrite-log.md`
- Modify: `docs/2026-04-22-spacing-border-spacing-space-source-rewrite-status.md`

- [ ] **Step 1: Write the failing test**

增加 `border-spacing / space-*` utility spec 与语义断言。

- [ ] **Step 2: Run test to verify it fails**

Run:
- `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "border-spacing / space"`

- [ ] **Step 3: Write minimal implementation**

新增 spec 条目，并锁住 selector / reverse variable 级别的 CSS 输出。

- [ ] **Step 4: Run test to verify green**

Run:
- `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
- `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "border-spacing / space"`

- [ ] **Step 5: Commit**

```bash
git add test/tailwind-utility-spec.ts test/preset-tailwind3-utility-spec.test.ts test/preset-tailwind3.test.ts docs/2026-04-22-spacing-border-spacing-space-source-rewrite-log.md docs/2026-04-22-spacing-border-spacing-space-source-rewrite-status.md
git commit -m "feat: lock spacing border spacing space semantics"
```

## Task 4: Finalize Governance And Mark Spacing Complete

**Files:**
- Modify: `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- Modify: `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- Modify: `test/preset-tailwind3-document-governance.test.ts`
- Modify: `docs/2026-04-22-spacing-border-spacing-space-source-rewrite-log.md`
- Modify: `docs/2026-04-22-spacing-border-spacing-space-source-rewrite-status.md`

- [ ] **Step 1: Write the failing test**

要求整体文档反映：

- `spacing` 已完成
- live manifest 指向当前子阶段文档
- 下一步统一推进到 `behavior`

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`

- [ ] **Step 3: Write minimal implementation**

更新总表、整体状态与治理测试，完成 `spacing` 收口。

- [ ] **Step 4: Run full verification**

Run:
- `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
- `pnpm test`
- `pnpm run typecheck`

- [ ] **Step 5: Commit**

```bash
git add docs/2026-04-22-tailwind3-source-rewrite-index.md docs/2026-04-21-tailwind-grammar-debt-task-status.md test/preset-tailwind3-document-governance.test.ts docs/2026-04-22-spacing-border-spacing-space-source-rewrite-log.md docs/2026-04-22-spacing-border-spacing-space-source-rewrite-status.md
git commit -m "test: finalize spacing border spacing space governance"
```
