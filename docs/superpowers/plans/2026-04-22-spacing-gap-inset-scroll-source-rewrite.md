# Spacing Gap Inset Scroll Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `spacing` 的第二子阶段 `gap / inset / scroll-*` 纳入 Tailwind CSS 3 源头重写治理模板，保持已对齐的 runtime 语义，并补齐 fixture、utility spec、migration 和文档追踪。

**Architecture:** 运行时入口继续分布在 `src/_rules/gap.ts`、`src/_rules/position.ts`、`src/_rules-wind3/scrolls.ts`，只在测试证明有真实偏差时才改动逻辑。主工作放在 shared fixtures、runtime/parity 测试、utility spec、blocklist migration 和整体任务文档同步上。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

这份计划只覆盖 `spacing` 的 `gap / inset / scroll-*` 子阶段。

包含：

- `gap-*`
- `inset-*`
- `start-*`
- `end-*`
- `top-*`
- `right-*`
- `bottom-*`
- `left-*`
- `scroll-m*`
- `scroll-p*`
- 本子阶段相关 utility spec
- 本子阶段相关 blocklist migration message
- 本子阶段的过程日志与任务进度

不包含：

- `padding / margin`
- `translate-*`
- `border-spacing-*`
- `space-*`

## Current Repo Reality

- 当前 runtime 入口位于 `src/_rules/gap.ts`、`src/_rules/position.ts` 与 `src/_rules-wind3/scrolls.ts`
- 当前已知现实：
  - runtime 与 Tailwind 3 对 `gap / inset / scroll-*` 的主语法已经基本对齐
  - 当前缺口主要在治理层，而不是 matcher 本身
  - blocklist 目前只拦截 compact / legacy spacing 语法，但没有给出这一子阶段的高置信度迁移提示

## File Structure

### Existing files to modify

- `src/blocklist.ts`
  - `gap / inset / scroll-*` 高置信度迁移提示
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

- `src/_rules/gap.ts`
- `src/_rules/position.ts`
- `src/_rules-wind3/scrolls.ts`

### New files to create

- `test/fixtures/tailwind-spacing-gap-inset-scroll-rewrite.ts`
  - `gap / inset / scroll-*` 的 canonical / invalid / semantic fixture
- `docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-log.md`
  - 过程日志
- `docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-status.md`
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
   - `docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-log.md`
   - `docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-status.md`
6. overall entry
   - `docs/2026-04-22-tailwind3-source-rewrite-index.md`
   - `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
   - `test/preset-tailwind3-document-governance.test.ts`

## Shared Fixture Baseline

`test/fixtures/tailwind-spacing-gap-inset-scroll-rewrite.ts` 至少包含：

```ts
export const gapInsetScrollFixtures = {
  canonical: [
    'gap-4',
    'gap-x-2',
    'gap-y-8',
    'inset-0',
    'inset-x-4',
    'inset-y-2',
    '-inset-4',
    'start-4',
    'end-6',
    'top-1',
    'gap-[3px]',
    'inset-[5px]',
    'scroll-m-4',
    'scroll-mx-2',
    'scroll-ms-4',
    'scroll-p-4',
    'scroll-px-2',
    'scroll-pe-6',
    'scroll-m-[2rem]',
    'scroll-px-[var(--gap)]',
  ],
  invalid: [
    'gap4',
    'gap-3px',
    'gapx-2',
    'gap-x2',
    'gap-row-4',
    'gap-col-4',
    'insetx-4',
    'insety2',
    'inset-inline-4',
    'inset-bs-4',
    'inset-r-4',
    'inset-s-4',
    'top1',
    'right2',
    'scrollm-4',
    'scroll-m4',
    'scrollmx-2',
    'scroll-mx2',
    'scrollpy8',
    'scroll-p4',
    'scroll-m-auto',
    'scroll-p-auto',
    'scroll-ma-4',
    'scroll-pa-4',
    'scroll-m-s-4',
    'scroll-p-e-4',
    'scroll-m-2rem',
  ],
  semantic: [
    'gap-4',
    'gap-x-2',
    'inset-[5px]',
    'start-4',
    'scroll-mx-2',
    'scroll-px-[var(--gap)]',
  ],
} as const
```

## Task 1: Initialize Gap Inset Scroll Fixtures And Process Tracking

**Files:**
- Create: `test/fixtures/tailwind-spacing-gap-inset-scroll-rewrite.ts`
- Create: `docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-log.md`
- Create: `docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-status.md`
- Modify: `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- Modify: `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- Modify: `test/preset-tailwind3.test.ts`
- Modify: `test/preset-tailwind3-tailwind-diff.test.ts`

- [ ] **Step 1: Write the failing test**

把 `gap / inset / scroll-*` 从当前内联数组切到 shared fixture，并把整体总表里的 `spacing` 入口切到当前子阶段文档。

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts -t "gap inset scroll"`
Expected: FAIL，因为高置信度迁移提示还不存在

- [ ] **Step 3: Write minimal implementation**

这里只做 fixture、文档和 dedicated 测试入口接线，不改运行时。

- [ ] **Step 4: Run test to verify it still fails for the right reason**

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts -t "gap inset scroll"`
Expected: FAIL，失败点集中在 migration coverage

- [ ] **Step 5: Commit**

```bash
git add docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-log.md docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-status.md docs/2026-04-22-tailwind3-source-rewrite-index.md docs/2026-04-21-tailwind-grammar-debt-task-status.md test/fixtures/tailwind-spacing-gap-inset-scroll-rewrite.ts test/preset-tailwind3.test.ts test/preset-tailwind3-tailwind-diff.test.ts
git commit -m "test: initialize spacing gap inset scroll rewrite tracking"
```

## Task 2: Add High-Confidence Gap Inset Scroll Migration Hints

**Files:**
- Modify: `src/blocklist.ts`
- Modify: `test/fixtures/blocklist-migration.ts`
- Modify: `test/preset-tailwind3-blocklist-messages.test.ts`
- Modify: `test/preset-tailwind3-blocklist-prefix-audit.test.ts`
- Modify: `docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-log.md`
- Modify: `docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-status.md`

- [ ] **Step 1: Write the failing test**

新增以下迁移样例的断言：

- `gap4 -> gap-4`
- `gapx2 -> gap-x-2`
- `gapx-2 -> gap-x-2`
- `gap-row-4 -> gap-y-4`
- `gap-col-4 -> gap-x-4`
- `gap-3px -> gap-[3px]`
- `insetx-4 -> inset-x-4`
- `insety2 -> inset-y-2`
- `inset-r-4 -> right-4`
- `inset-s-4 -> start-4`
- `top1 -> top-1`
- `right2 -> right-2`
- `scrollm-4 -> scroll-m-4`
- `scroll-m4 -> scroll-m-4`
- `scrollmx-2 -> scroll-mx-2`
- `scrollpy8 -> scroll-py-8`
- `scroll-p4 -> scroll-p-4`
- `scroll-ma-4 -> scroll-m-4`
- `scroll-pa-4 -> scroll-p-4`
- `scroll-m-s-4 -> scroll-ms-4`
- `scroll-p-e-4 -> scroll-pe-4`
- `scroll-m-2rem -> scroll-m-[2rem]`

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
Expected: FAIL

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-prefix-audit.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

只补高置信度 migration descriptors，不改运行时。

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-prefix-audit.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/blocklist.ts test/fixtures/blocklist-migration.ts test/preset-tailwind3-blocklist-messages.test.ts test/preset-tailwind3-blocklist-prefix-audit.test.ts docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-log.md docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-status.md
git commit -m "feat: add spacing gap inset scroll migration hints"
```

## Task 3: Register Utility Spec And Semantic Assertions

**Files:**
- Modify: `test/tailwind-utility-spec.ts`
- Modify: `test/preset-tailwind3-utility-spec.test.ts`
- Modify: `test/preset-tailwind3.test.ts`
- Modify: `docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-log.md`
- Modify: `docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-status.md`

- [ ] **Step 1: Write the failing test**

在 utility spec 中登记本子阶段，并给 `semantic` fixture 增加显式 CSS 断言。

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
Expected: FAIL

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "gap / inset / scroll"`
Expected: FAIL 或缺少 semantic 断言

- [ ] **Step 3: Write minimal implementation**

把这一子阶段加入 `tailwindUtilitySpecs`，并锁住至少这些 CSS：

- `.gap-4{gap:1rem;}`
- `.gap-x-2{column-gap:0.5rem;}`
- `.inset-\\[5px\\]{inset:5px;}`
- `.start-4{inset-inline-start:1rem;}`
- `.scroll-mx-2{scroll-margin-left:0.5rem;scroll-margin-right:0.5rem;}`
- `.scroll-px-\\[var\\(--gap\\)\\]{scroll-padding-left:var(--gap);scroll-padding-right:var(--gap);}`

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "gap / inset / scroll"`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add test/tailwind-utility-spec.ts test/preset-tailwind3-utility-spec.test.ts test/preset-tailwind3.test.ts docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-log.md docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-status.md
git commit -m "feat: lock spacing gap inset scroll semantics"
```

## Task 4: Sync Governance Docs And Final Verification

**Files:**
- Modify: `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- Modify: `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- Modify: `test/preset-tailwind3-document-governance.test.ts`
- Modify: `docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-log.md`
- Modify: `docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-status.md`

- [ ] **Step 1: Write the failing test**

让整体总表和治理测试认识到：

- `spacing` 现在仍是 `in_progress`
- live 文档入口已切到 `gap / inset / scroll-*` 子阶段
- `spacing` 仍不在已完成 utility 列表里

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

同步文档状态，让它反映“spacing 的第二子阶段已完成，但整体 spacing 仍在进行中”。

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
Expected: PASS

Run: `pnpm test`
Expected: PASS

Run: `pnpm run typecheck`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add docs/2026-04-22-tailwind3-source-rewrite-index.md docs/2026-04-21-tailwind-grammar-debt-task-status.md test/preset-tailwind3-document-governance.test.ts docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-log.md docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-status.md
git commit -m "test: finalize spacing gap inset scroll governance"
```
