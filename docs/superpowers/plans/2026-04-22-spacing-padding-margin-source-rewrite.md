# Spacing Padding Margin Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `spacing` 的第一子阶段 `padding / margin` 纳入 Tailwind CSS 3 源头重写治理模板，保持已对齐的 runtime 语义，并补齐 fixture、utility spec、migration 和文档追踪。

**Architecture:** 运行时入口继续留在 `src/_rules/spacing.ts`，只在测试证明有真实偏差时才改动逻辑。主工作放在 shared fixtures、runtime/parity 测试、utility spec、blocklist migration 和整体任务文档同步上。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

这份计划只覆盖 `spacing` 的 `padding / margin` 子阶段。

包含：

- `p-*`
- `m-*`
- `padding / margin` 相关 utility spec
- `padding / margin` 相关 blocklist migration message
- `spacing` 当前子阶段的过程日志与任务进度

不包含：

- `gap-*`
- `inset-*`
- `scroll-m*`
- `scroll-p*`
- `border-spacing-*`
- `space-*`

## Current Repo Reality

- 当前 runtime 入口位于 `src/_rules/spacing.ts`
- 解析核心位于 `src/_utils/utilities.ts`
- 当前已知现实：
  - runtime 与 Tailwind 3 对 `p-*` / `m-*` 的主语法已经基本对齐
  - 当前缺口主要在治理层，而不是 matcher 本身
  - blocklist 目前只拦截 compact / legacy spacing 语法，但没有给出 `padding / margin` 的高置信度迁移提示

## File Structure

### Existing files to modify

- `src/blocklist.ts`
  - `padding / margin` 高置信度迁移提示
- `test/preset-tailwind3.test.ts`
  - runtime 边界和语义测试
- `test/preset-tailwind3-tailwind-diff.test.ts`
  - Tailwind parity 测试
- `test/tailwind-utility-spec.ts`
  - `padding / margin` 规则族登记
- `test/preset-tailwind3-utility-spec.test.ts`
  - utility spec 同步断言
- `test/fixtures/blocklist-migration.ts`
  - `padding / margin` 迁移提示共享样例
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

- `src/_rules/spacing.ts`
  - 当前 `padding / margin` 运行时入口
- `src/_utils/utilities.ts`
  - spacing 解析核心

### New files to create

- `test/fixtures/tailwind-spacing-padding-margin-rewrite.ts`
  - `padding / margin` 的 canonical / invalid / semantic fixture
- `docs/2026-04-22-spacing-padding-margin-source-rewrite-log.md`
  - 过程日志
- `docs/2026-04-22-spacing-padding-margin-source-rewrite-status.md`
  - 任务进度

## Testing Strategy

必须遵循 @superpowers:test-driven-development 和 @superpowers:verification-before-completion。

验证层分为 6 层：

1. runtime
   - `test/preset-tailwind3.test.ts`
2. Tailwind parity
   - `test/preset-tailwind3-tailwind-diff.test.ts`
3. utility spec
   - `test/tailwind-utility-spec.ts`
   - `test/preset-tailwind3-utility-spec.test.ts`
4. blocklist migration
   - `src/blocklist.ts`
   - `test/fixtures/blocklist-migration.ts`
   - `test/preset-tailwind3-blocklist-messages.test.ts`
   - `test/preset-tailwind3-blocklist-prefix-audit.test.ts`
5. process docs
   - `docs/2026-04-22-spacing-padding-margin-source-rewrite-log.md`
   - `docs/2026-04-22-spacing-padding-margin-source-rewrite-status.md`
6. overall entry
   - `docs/2026-04-22-tailwind3-source-rewrite-index.md`
   - `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
   - `test/preset-tailwind3-document-governance.test.ts`

## Shared Fixture Baseline

`test/fixtures/tailwind-spacing-padding-margin-rewrite.ts` 至少包含：

```ts
export const paddingMarginFixtures = {
  canonical: [
    'p-4',
    'px-2',
    'py-8',
    'pt-1',
    'pr-px',
    'ps-4',
    'pe-6',
    'm-4',
    'mx-auto',
    'my-6',
    '-mx-2',
    'm-[2rem]',
    'mx-[var(--gap)]',
  ],
  invalid: [
    'p4',
    'px2',
    'pt1',
    'm4',
    'mx2',
    '-mt1',
    'p-x-4',
    '-m-y-2',
    'p-s-4',
    'm-e-4',
    'p-5px',
    'm-2rem',
    'mx-var(--gap)',
  ],
  semantic: [
    'p-4',
    'ps-4',
    'm-auto',
    '-mx-2',
    'mx-[var(--gap)]',
  ],
} as const
```

## Task 1: Initialize Padding Margin Fixtures And Process Tracking

**Files:**
- Create: `test/fixtures/tailwind-spacing-padding-margin-rewrite.ts`
- Create: `docs/2026-04-22-spacing-padding-margin-source-rewrite-log.md`
- Create: `docs/2026-04-22-spacing-padding-margin-source-rewrite-status.md`
- Modify: `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- Modify: `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- Modify: `test/preset-tailwind3.test.ts`
- Modify: `test/preset-tailwind3-tailwind-diff.test.ts`

- [ ] **Step 1: Write the failing test**

把 `padding / margin` 从当前内联数组切到 shared fixture，并把整体总表里的 `spacing` 从 `pending` 改为 `in_progress`。

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts -t "padding"`
Expected: FAIL，因为高置信度迁移提示还不存在

- [ ] **Step 3: Write minimal implementation**

这里只做 fixture、文档和 dedicated 测试入口接线，不改运行时。

- [ ] **Step 4: Run test to verify it still fails for the right reason**

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts -t "padding"`
Expected: FAIL，失败点集中在 migration coverage

- [ ] **Step 5: Commit**

```bash
git add docs/2026-04-22-spacing-padding-margin-source-rewrite-log.md docs/2026-04-22-spacing-padding-margin-source-rewrite-status.md docs/2026-04-22-tailwind3-source-rewrite-index.md docs/2026-04-21-tailwind-grammar-debt-task-status.md test/fixtures/tailwind-spacing-padding-margin-rewrite.ts test/preset-tailwind3.test.ts test/preset-tailwind3-tailwind-diff.test.ts
git commit -m "test: initialize spacing padding margin rewrite tracking"
```

## Task 2: Add High-Confidence Padding Margin Migration Hints

**Files:**
- Modify: `src/blocklist.ts`
- Modify: `test/fixtures/blocklist-migration.ts`
- Modify: `test/preset-tailwind3-blocklist-messages.test.ts`
- Modify: `test/preset-tailwind3-blocklist-prefix-audit.test.ts`
- Modify: `docs/2026-04-22-spacing-padding-margin-source-rewrite-log.md`
- Modify: `docs/2026-04-22-spacing-padding-margin-source-rewrite-status.md`

- [ ] **Step 1: Write the failing test**

新增以下迁移样例的断言：

- `p4 -> p-4`
- `px2 -> px-2`
- `pt1 -> pt-1`
- `m4 -> m-4`
- `mx2 -> mx-2`
- `-mt1 -> -mt-1`
- `p-x-4 -> px-4`
- `-m-y-2 -> -my-2`
- `p-s-4 -> ps-4`
- `m-e-4 -> me-4`
- `p-5px -> p-[5px]`
- `m-2rem -> m-[2rem]`
- `mx-var(--gap) -> mx-[var(--gap)]`

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
Expected: FAIL

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-prefix-audit.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

只补高置信度 migration descriptors，不改 `src/_rules/spacing.ts`。

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-prefix-audit.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/blocklist.ts test/fixtures/blocklist-migration.ts test/preset-tailwind3-blocklist-messages.test.ts test/preset-tailwind3-blocklist-prefix-audit.test.ts docs/2026-04-22-spacing-padding-margin-source-rewrite-log.md docs/2026-04-22-spacing-padding-margin-source-rewrite-status.md
git commit -m "feat: add spacing padding margin migration hints"
```

## Task 3: Register Utility Spec And Semantic Assertions

**Files:**
- Modify: `test/tailwind-utility-spec.ts`
- Modify: `test/preset-tailwind3-utility-spec.test.ts`
- Modify: `test/preset-tailwind3.test.ts`
- Modify: `docs/2026-04-22-spacing-padding-margin-source-rewrite-log.md`
- Modify: `docs/2026-04-22-spacing-padding-margin-source-rewrite-status.md`

- [ ] **Step 1: Write the failing test**

在 utility spec 中登记 `padding-margin`，并给 `semantic` fixture 增加显式 CSS 断言。

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
Expected: FAIL

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "padding / margin"`
Expected: FAIL 或缺少 semantic 断言

- [ ] **Step 3: Write minimal implementation**

把 `padding-margin` 加入 `tailwindUtilitySpecs`，并锁住至少这些 CSS：

- `.p-4{padding:1rem;}`
- `.ps-4{padding-inline-start:1rem;}`
- `.m-auto{margin:auto;}`
- `.\\-mx-2{margin-left:-0.5rem;margin-right:-0.5rem;}`
- `.mx-\\[var\\(--gap\\)\\]{margin-left:var(--gap);margin-right:var(--gap);}`

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "padding / margin"`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add test/tailwind-utility-spec.ts test/preset-tailwind3-utility-spec.test.ts test/preset-tailwind3.test.ts docs/2026-04-22-spacing-padding-margin-source-rewrite-log.md docs/2026-04-22-spacing-padding-margin-source-rewrite-status.md
git commit -m "feat: lock spacing padding margin semantics"
```

## Task 4: Sync Governance Docs And Final Verification

**Files:**
- Modify: `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- Modify: `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- Modify: `test/preset-tailwind3-document-governance.test.ts`
- Modify: `docs/2026-04-22-spacing-padding-margin-source-rewrite-log.md`
- Modify: `docs/2026-04-22-spacing-padding-margin-source-rewrite-status.md`

- [ ] **Step 1: Write the failing test**

让整体总表和治理测试认识到：

- `spacing` 现在是 `in_progress`
- spec / plan / log / status 链接已经存在
- 已完成 utility 列表仍不包含 `spacing`

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

同步文档状态，让它反映“spacing 的 padding / margin 子阶段已完成，但整体 spacing 仍在进行中”。

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
Expected: PASS

Run: `pnpm test`
Expected: PASS

Run: `pnpm run typecheck`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add docs/2026-04-22-tailwind3-source-rewrite-index.md docs/2026-04-21-tailwind-grammar-debt-task-status.md test/preset-tailwind3-document-governance.test.ts docs/2026-04-22-spacing-padding-margin-source-rewrite-log.md docs/2026-04-22-spacing-padding-margin-source-rewrite-status.md
git commit -m "test: finalize spacing padding margin governance"
```
