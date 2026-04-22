# Leading Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `leading` 主规则族收敛到 Tailwind CSS 3 正式语法，只保留 `leading-*` 作为合法入口，并把历史别名与裸长度写法纳入迁移治理。

**Architecture:** 运行时入口继续留在 `src/_rules/typography.ts`，但 `leading` 不再接受 `lh-*`、`line-height-*`、`font-leading-*` 或裸长度写法。测试层沿用 `outline` / `text` 模板：共享 fixture、runtime、Tailwind parity、utility spec、blocklist migration、过程文档和整体总表一起推进。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

这份计划只覆盖 `leading` 主规则族，不扩展到 `text`、`tracking`、`word-spacing`、`text-shadow`、`text-stroke`。

包含：

- `leading-<theme-key>`
- `leading-<numeric-scale>`
- `leading-[...]`
- `leading` 相关 utility spec
- `leading` 相关 blocklist migration message
- `leading` 的过程日志与任务进度

不包含：

- `text-<size>/<line-height>` shorthand 的重写
- `tracking-*`
- `lh-*`
- `line-height-*`
- `font-leading-*`

## Current Repo Reality

- 当前 `leading` 运行时实现位于 `src/_rules/typography.ts`
- 当前 matcher 为 `^(?:font-)?(?:leading|lh|line-height)-(.+)$`
- 当前已知真实 runtime 差异：
  - `lh-6` 被错误接纳
  - `line-height-6` 被错误接纳
  - `font-leading-6` 被错误接纳
  - `leading-20px` 被错误接纳
- 当前应继续保留的正式写法：
  - `leading-none`
  - `leading-tight`
  - `leading-6`
  - `leading-[20px]`
  - `leading-[calc(100%-1px)]`

## File Structure

### Existing files to modify

- `src/_rules/typography.ts`
  - 当前 `leading` 运行时入口
- `src/blocklist.ts`
  - `leading` 高置信度迁移提示
- `test/preset-tailwind3.test.ts`
  - runtime 边界测试
- `test/preset-tailwind3-tailwind-diff.test.ts`
  - Tailwind parity 测试
- `test/tailwind-utility-spec.ts`
  - `leading` 规则族登记
- `test/preset-tailwind3-utility-spec.test.ts`
  - utility spec 同步断言
- `test/fixtures/blocklist-migration.ts`
  - `leading` 迁移提示共享样例
- `test/preset-tailwind3-blocklist-messages.test.ts`
  - blocklist message 测试
- `test/preset-tailwind3-blocklist-prefix-audit.test.ts`
  - blocklist 前缀审计
- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
  - 整体任务唯一实时入口
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
  - 整体状态文档

### New files to create

- `test/fixtures/tailwind-leading-rewrite.ts`
  - `leading` 的 canonical / invalid / semantic fixture
- `docs/2026-04-22-leading-source-rewrite-log.md`
  - 过程日志
- `docs/2026-04-22-leading-source-rewrite-status.md`
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
   - `docs/2026-04-22-leading-source-rewrite-log.md`
   - `docs/2026-04-22-leading-source-rewrite-status.md`
6. overall entry
   - `docs/2026-04-22-tailwind3-source-rewrite-index.md`
   - `docs/2026-04-21-tailwind-grammar-debt-task-status.md`

## Shared Fixture Baseline

`test/fixtures/tailwind-leading-rewrite.ts` 至少包含：

```ts
export const leadingFixtures = {
  canonical: [
    'leading-none',
    'leading-tight',
    'leading-snug',
    'leading-normal',
    'leading-relaxed',
    'leading-loose',
    'leading-6',
    'leading-[20px]',
    'leading-[calc(100%-1px)]',
  ],
  invalid: [
    'lh-6',
    'line-height-6',
    'font-leading-6',
    'leading-20px',
  ],
  semantic: [
    'leading-none',
    'leading-6',
    'leading-[20px]',
    'leading-[calc(100%-1px)]',
  ],
} as const
```

并增加一组 `text` shorthand 回归保护样例：

```ts
export const leadingTextShorthandRegressionFixtures = [
  'text-lg/7',
  'text-[14px]/[20px]',
] as const
```

## Task 1: Initialize Leading Fixtures And Process Tracking

**Files:**
- Create: `test/fixtures/tailwind-leading-rewrite.ts`
- Create: `docs/2026-04-22-leading-source-rewrite-log.md`
- Create: `docs/2026-04-22-leading-source-rewrite-status.md`
- Modify: `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- Modify: `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- Modify: `test/preset-tailwind3.test.ts`
- Modify: `test/preset-tailwind3-tailwind-diff.test.ts`

- [ ] **Step 1: Write the failing test**

接入 `leadingFixtures`，并把 `leading` 在总表里从 `pending` 改为 `in_progress`。
同时在 runtime / parity 测试中增加 `leadingTextShorthandRegressionFixtures` 的保护性断言。

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "leading"`
Expected: FAIL，至少暴露 `lh-6`、`line-height-6`、`font-leading-6` 或 `leading-20px` 被错误接纳

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "leading"`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

这里只做 fixture、文档、测试接线，不改运行时逻辑。

- [ ] **Step 4: Run test to verify it still fails for the right reason**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "leading"`
Expected: FAIL，但失败原因集中在 `leading` 语义

- [ ] **Step 5: Commit**

```bash
git add docs/2026-04-22-leading-source-rewrite-log.md docs/2026-04-22-leading-source-rewrite-status.md docs/2026-04-22-tailwind3-source-rewrite-index.md docs/2026-04-21-tailwind-grammar-debt-task-status.md test/fixtures/tailwind-leading-rewrite.ts test/preset-tailwind3.test.ts test/preset-tailwind3-tailwind-diff.test.ts
git commit -m "test: initialize leading rewrite fixtures and tracking"
```

## Task 2: Tighten Leading Syntax

**Files:**
- Modify: `src/_rules/typography.ts`
- Modify: `docs/2026-04-22-leading-source-rewrite-log.md`
- Modify: `docs/2026-04-22-leading-source-rewrite-status.md`

- [ ] **Step 1: Write the failing test**

确保 `leadingFixtures.invalid` 和 `leadingFixtures.semantic` 已被 runtime / parity 消费，至少锁住：

```ts
invalid: ['lh-6', 'line-height-6', 'font-leading-6', 'leading-20px']
semantic: ['leading-none', 'leading-6', 'leading-[20px]', 'leading-[calc(100%-1px)]']
text regression: ['text-lg/7', 'text-[14px]/[20px]']
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "leading"`
Expected: FAIL

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "leading"`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

把 `leading` matcher 收紧到只接受：

- `leading-<theme-key>`
- `leading-<numeric-scale>`
- `leading-[...]`

并拒绝：

- `lh-*`
- `line-height-*`
- `font-leading-*`
- `leading-20px`

同时不能误伤：

- `leading-none`
- `leading-tight`
- `leading-snug`
- `leading-normal`
- `leading-relaxed`
- `leading-loose`
- `leading-6`
- `leading-[20px]`
- `leading-[calc(100%-1px)]`
- `text-lg/7`
- `text-[14px]/[20px]`

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "leading"`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "leading"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/_rules/typography.ts docs/2026-04-22-leading-source-rewrite-log.md docs/2026-04-22-leading-source-rewrite-status.md
git commit -m "feat: tighten leading syntax"
```

## Task 3: Register Leading Spec And Semantic Assertions

**Files:**
- Modify: `test/tailwind-utility-spec.ts`
- Modify: `test/preset-tailwind3-utility-spec.test.ts`
- Modify: `test/preset-tailwind3.test.ts`
- Modify: `docs/2026-04-22-leading-source-rewrite-log.md`
- Modify: `docs/2026-04-22-leading-source-rewrite-status.md`

- [ ] **Step 1: Write the failing test**

把 `leading` 纳入 utility spec，并补 semantic 断言：

```ts
expect(css).toContain('.leading-none{line-height:1;}')
expect(css).toContain('.leading-6{line-height:1.5rem;}')
expect(css).toContain('.leading-\\[20px\\]{line-height:20px;}')
expect(css).toContain('.leading-\\[calc\\(100\\%-1px\\)\\]{line-height:calc(100% - 1px);}')
expect(textCss).toContain('.text-lg\\/7{font-size:1.125rem;line-height:1.75rem;}')
expect(textCss).toContain('.text-\\[14px\\]\\/\\[20px\\]{font-size:14px;line-height:20px;}')
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

只补充 spec 登记和 semantic 断言，不做额外运行时改造。

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "leading"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add test/tailwind-utility-spec.ts test/preset-tailwind3-utility-spec.test.ts test/preset-tailwind3.test.ts docs/2026-04-22-leading-source-rewrite-log.md docs/2026-04-22-leading-source-rewrite-status.md
git commit -m "feat: lock leading semantics to tailwind rules"
```

## Task 4: Lock Leading Blocklist Migration And Final Verification

**Files:**
- Modify: `src/blocklist.ts`
- Modify: `test/fixtures/blocklist-migration.ts`
- Modify: `test/preset-tailwind3-blocklist-messages.test.ts`
- Modify: `test/preset-tailwind3-blocklist-prefix-audit.test.ts`
- Modify: `docs/2026-04-22-leading-source-rewrite-log.md`
- Modify: `docs/2026-04-22-leading-source-rewrite-status.md`
- Modify: `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- Modify: `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- Modify: `test/preset-tailwind3-document-governance.test.ts`

- [ ] **Step 1: Write the failing test**

至少覆盖迁移提示：

```ts
{ input: 'lh-6', replacement: 'leading-6' }
{ input: 'line-height-6', replacement: 'leading-6' }
{ input: 'font-leading-6', replacement: 'leading-6' }
{ input: 'leading-20px', replacement: 'leading-[20px]' }
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

把 `leading` 迁移提示补进 blocklist 源、共享 fixture 和 prefix audit，同时把整体文档推进到 `leading: completed`。

- [ ] **Step 4: Run final verification**

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-prefix-audit.test.ts`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "leading"`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "leading"`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
Expected: PASS

Run: `pnpm test`
Expected: PASS

Run: `pnpm run typecheck`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/blocklist.ts test/fixtures/blocklist-migration.ts test/preset-tailwind3-blocklist-messages.test.ts test/preset-tailwind3-blocklist-prefix-audit.test.ts docs/2026-04-22-leading-source-rewrite-log.md docs/2026-04-22-leading-source-rewrite-status.md docs/2026-04-22-tailwind3-source-rewrite-index.md docs/2026-04-21-tailwind-grammar-debt-task-status.md test/preset-tailwind3-document-governance.test.ts
git commit -m "test: finalize leading rewrite migration coverage"
```

## Verification Checklist

- [ ] `leading-*` 是唯一合法的 line-height 主入口
- [ ] `lh-*`、`line-height-*`、`font-leading-*` 不会被 runtime 接纳
- [ ] `leading-20px` 不会被 runtime 接纳
- [ ] `leading-none`、`leading-tight`、`leading-snug`、`leading-normal`、`leading-relaxed`、`leading-loose`、`leading-6`、`leading-[20px]`、`leading-[calc(100%-1px)]` 继续成立
- [ ] `text-lg/7`、`text-[14px]/[20px]` 未被误伤
- [ ] `leading` 已登记到 utility spec
- [ ] `lh-6`、`line-height-6`、`font-leading-6`、`leading-20px` 已有迁移提示
- [ ] `leading` 的 log / status 与整体总表同步更新
