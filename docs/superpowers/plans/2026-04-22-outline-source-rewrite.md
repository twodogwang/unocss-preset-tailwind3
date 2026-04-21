# Outline Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `outline` 规则族重写为只接受 Tailwind CSS 3 正式语法的实现，并把本轮过程日志与任务进度记录纳入版本控制和分步 git 提交。

**Architecture:** 运行时入口继续保留在 `src/_rules/behaviors.ts`，但 `outline` 的宽松分发逻辑需要被显式的 width / style / color / offset 语义约束替代。测试沿用当前仓库已建立的五层结构：共享 fixture、runtime、Tailwind parity、utility spec、blocklist migration；同时新增过程日志和任务进度文件，并要求每完成一个可验证子步骤都更新并提交。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

这份计划只覆盖 `outline` 规则族，不扩展到 `transition`、`appearance`、`will-change` 或其他 `behavior` 子项。

包含：

- `outline`
- `outline-none`
- `outline-<width>`
- `outline-<style>`
- `outline-<color>`
- `outline-offset-<value>`
- `outline` 相关 utility spec
- `outline` 相关 blocklist migration message
- 过程日志与任务进度记录

不包含：

- `transition` 重写
- 全仓日志框架重构
- `utility spec` 的通用架构升级

## Current Repo Reality

- 当前 `outline` 运行时实现位于 `src/_rules/behaviors.ts`，由一个宽 matcher `/^outline-(.+)$/` 把 style / width / color 混在同一个 handler 里。
- 当前 `outline-offset-(.+)` 直接走 `theme.lineWidth` 或 `px` 兜底，仍然是宽匹配思路。
- 现有正反向测试分别位于：
  - `test/preset-tailwind3.test.ts` 的 `outline / transition`
  - `test/preset-tailwind3-tailwind-diff.test.ts` 的 `outline and transition`
- blocklist 已经存在 outline 的迁移提示规则：
  - `outline-color-* -> outline-*`
  - `outline-width-* -> outline-*`
  - `outline-style-* -> outline-*`
- blocklist 迁移 fixture 当前位于 `test/fixtures/blocklist-migration.ts`
- utility spec 入口当前位于 `test/tailwind-utility-spec.ts`

本地基线核查结果：

- 当前预设会错误接受：
  - `outline-3px`
  - `outline-offset-3px`
  - `outline-offset-none`
- 本地 Tailwind 3 不接受这些写法
- 当前预设与 Tailwind 3 一致接受：
  - `outline`
  - `outline-none`
  - `outline-0`
  - `outline-offset-0`
  - `outline-[calc(100%-1px)]`
  - `outline-offset-[calc(100%-1px)]`
  - `outline-transparent`

因此本轮真正的 red case 应建立在 `outline-3px`、`outline-offset-3px`、`outline-offset-none` 上，而不是假设整段 `outline` 测试天然会失败。

## File Structure

### Existing files to modify

- `src/_rules/behaviors.ts`
  - 当前 `outline` 运行时实现入口
- `test/preset-tailwind3.test.ts`
  - runtime 边界测试
- `test/preset-tailwind3-tailwind-diff.test.ts`
  - Tailwind parity 边界测试
- `test/tailwind-utility-spec.ts`
  - 规则族规范清单
- `test/preset-tailwind3-utility-spec.test.ts`
  - 规格层同步断言
- `test/fixtures/blocklist-migration.ts`
  - blocklist 迁移 fixture
- `test/preset-tailwind3-blocklist-messages.test.ts`
  - blocklist message 测试

### New files to create

- `test/fixtures/tailwind-outline-rewrite.ts`
  - `outline` 的 canonical / invalid / semantic fixture
- `docs/2026-04-22-outline-source-rewrite-log.md`
  - 过程日志
- `docs/2026-04-22-outline-source-rewrite-status.md`
  - 任务进度

### Responsibility boundaries

- `src/_rules/behaviors.ts` 只负责 `outline` 的匹配与 CSS 生成
- `test/fixtures/tailwind-outline-rewrite.ts` 只负责 `outline` 的共享样例
- `test/tailwind-utility-spec.ts` 只负责规范登记
- `test/fixtures/blocklist-migration.ts` 只负责迁移提示样例
- `docs/*outline-source-rewrite-*.md` 只负责过程记录，不承载运行时逻辑

## Testing Strategy

必须遵循 @superpowers:test-driven-development 和 @superpowers:verification-before-completion。

验证层分为 5 层：

1. runtime:
   - `test/preset-tailwind3.test.ts`
2. Tailwind parity:
   - `test/preset-tailwind3-tailwind-diff.test.ts`
3. utility spec:
   - `test/tailwind-utility-spec.ts`
   - `test/preset-tailwind3-utility-spec.test.ts`
4. blocklist migration:
   - `test/fixtures/blocklist-migration.ts`
   - `test/preset-tailwind3-blocklist-messages.test.ts`
5. process docs:
   - `docs/2026-04-22-outline-source-rewrite-log.md`
   - `docs/2026-04-22-outline-source-rewrite-status.md`

每个任务完成时都必须：

1. 更新日志文档
2. 更新进度文档
3. 跑对应验证命令
4. 单独提交 git

## Shared Fixture Baseline

`test/fixtures/tailwind-outline-rewrite.ts` 至少包含如下样例：

```ts
export const outlineFixtures = {
  canonical: [
    'outline',
    'outline-none',
    'outline-0',
    'outline-2',
    'outline-[3px]',
    'outline-[calc(100%-1px)]',
    'outline-red-500',
    'outline-[#fff]',
    'outline-transparent',
    'outline-dashed',
    'outline-dotted',
    'outline-double',
    'outline-inherit',
    'outline-offset-0',
    'outline-offset-2',
    'outline-offset-[3px]',
    'outline-offset-[calc(100%-1px)]',
  ],
  invalid: [
    'outline-3px',
    'outline-offset-3px',
    'outline-offset-none',
    'outline-hidden',
    'outline-initial',
    'outline-color-red-500',
    'outline-width-2',
    'outline-style-dashed',
    'outline-op50',
    'outline-opacity-50',
  ],
  semantic: [
    'outline-none',
    'outline-2',
    'outline-offset-2',
  ],
} as const
```

## Task 1: Initialize Outline Fixtures And Progress Tracking

**Files:**
- Create: `test/fixtures/tailwind-outline-rewrite.ts`
- Create: `docs/2026-04-22-outline-source-rewrite-log.md`
- Create: `docs/2026-04-22-outline-source-rewrite-status.md`
- Modify: `test/preset-tailwind3.test.ts:622-649`
- Modify: `test/preset-tailwind3-tailwind-diff.test.ts:326-367`

- [ ] **Step 1: Write the failing test**

先写共享 fixture、日志文件、进度文件，并把 runtime/parity 测试改为直接消费 `outlineFixtures`。

日志文件初始内容至少包含：

```md
# Outline Source Rewrite Log

- 2026-04-22: initialized outline rewrite task
- current focus: create failing tests and tracking docs
```

进度文件初始内容至少包含：

```md
# Outline Source Rewrite Status

- phase: red
- completed:
  - design approved
- in_progress:
  - initialize fixtures, logs, and failing tests
- pending:
  - strict width/offset
  - strict style/color
  - final verification
```

在 `test/preset-tailwind3.test.ts` 增加失败用例，要求至少包含：

```ts
await expectNonTargets(outlineFixtures.invalid)
await expectTargets(outlineFixtures.canonical)
```

在 `test/preset-tailwind3-tailwind-diff.test.ts` 增加：

```ts
await expectTailwindParity(outlineFixtures.canonical)
await expectTailwindParity(outlineFixtures.invalid)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "outline / transition"`
Expected: FAIL，至少应暴露 `outline-3px`、`outline-offset-3px` 或 `outline-offset-none` 被当前实现错误接纳

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "outline and transition"`
Expected: FAIL，说明当前 `outline` 宽匹配仍与 Tailwind 3 在真实差异样例上不一致

- [ ] **Step 3: Write minimal implementation**

这里只做测试与文档接线，不改运行时逻辑。

- [ ] **Step 4: Run test to verify it passes or still fails for the right reason**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "outline / transition"`
Expected: 仍可能 FAIL，但失败原因应集中到运行时 `outline` 语义，而不是测试结构或类型错误

- [ ] **Step 5: Update docs and commit**

```bash
git add -f docs/2026-04-22-outline-source-rewrite-log.md docs/2026-04-22-outline-source-rewrite-status.md test/fixtures/tailwind-outline-rewrite.ts test/preset-tailwind3.test.ts test/preset-tailwind3-tailwind-diff.test.ts
git commit -m "test: initialize outline rewrite fixtures and tracking"
```

## Task 2: Lock Outline Width And Offset Strictness

**Files:**
- Modify: `src/_rules/behaviors.ts`
- Modify: `test/fixtures/tailwind-outline-rewrite.ts`
- Modify: `test/preset-tailwind3.test.ts`
- Modify: `test/preset-tailwind3-tailwind-diff.test.ts`
- Modify: `docs/2026-04-22-outline-source-rewrite-log.md`
- Modify: `docs/2026-04-22-outline-source-rewrite-status.md`

- [ ] **Step 1: Write the failing test**

把 width / offset 的正反向样例写死，至少覆盖：

```ts
canonical: ['outline-0', 'outline-2', 'outline-[3px]', 'outline-[calc(100%-1px)]', 'outline-offset-0', 'outline-offset-2', 'outline-offset-[3px]', 'outline-offset-[calc(100%-1px)]']
invalid: ['outline-3px', 'outline-offset-3px', 'outline-offset-none', 'outline-width-2']
```

补一小组 CSS 语义断言：

```ts
const css = await expectTargets(['outline-2', 'outline-offset-2'])
expect(css).toContain('.outline-2{outline-width:2px;}')
expect(css).toContain('.outline-offset-2{outline-offset:2px;}')
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "outline / transition"`
Expected: FAIL，表明当前实现仍然宽接收 `outline-3px` / `outline-offset-3px` / `outline-offset-none`

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "outline and transition"`
Expected: FAIL，matched 集合中应暴露与 Tailwind 3 的真实差异

- [ ] **Step 3: Write minimal implementation**

把 `outline-width` 与 `outline-offset` 收紧到：

- 默认 theme key
- 合法数字刻度
- bracket arbitrary

不要继续让任何非 Tailwind 3 裸单位宽匹配直通。

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "outline / transition"`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "outline and transition"`
Expected: PASS

- [ ] **Step 5: Update docs and commit**

```bash
git add -f docs/2026-04-22-outline-source-rewrite-log.md docs/2026-04-22-outline-source-rewrite-status.md src/_rules/behaviors.ts test/fixtures/tailwind-outline-rewrite.ts test/preset-tailwind3.test.ts test/preset-tailwind3-tailwind-diff.test.ts
git commit -m "feat: tighten outline width and offset syntax"
```

## Task 3: Lock Outline Style, Color, None, And Spec Template

**Files:**
- Modify: `src/_rules/behaviors.ts`
- Modify: `test/fixtures/tailwind-outline-rewrite.ts`
- Modify: `test/tailwind-utility-spec.ts`
- Modify: `test/preset-tailwind3-utility-spec.test.ts`
- Modify: `test/preset-tailwind3.test.ts`
- Modify: `test/preset-tailwind3-tailwind-diff.test.ts`
- Modify: `docs/2026-04-22-outline-source-rewrite-log.md`
- Modify: `docs/2026-04-22-outline-source-rewrite-status.md`

- [ ] **Step 1: Write the failing test**

把 style / color / none / inherit 的语义写死：

```ts
canonical: ['outline', 'outline-none', 'outline-red-500', 'outline-[#fff]', 'outline-dashed', 'outline-dotted', 'outline-double', 'outline-inherit']
invalid: ['outline-hidden', 'outline-initial', 'outline-style-dashed', 'outline-op50', 'outline-opacity-50']
```

补 runtime CSS 语义断言：

```ts
const css = await expectTargets(['outline-none', 'outline-dashed'])
expect(css).toContain('.outline-none{outline:2px solid transparent;outline-offset:2px;}')
expect(css).toContain('.outline-dashed{outline-style:dashed;}')
```

同时把 `outline` 纳入 `test/tailwind-utility-spec.ts`，新增一条例如：

```ts
{
  id: 'outline',
  sourceFiles: ['src/_rules/behaviors.ts'],
  category: 'behavior',
  canonical: [...outlineFixtures.canonical],
  invalid: [...outlineFixtures.invalid],
  supportsPrefix: true,
  supportsVariants: true,
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "outline / transition"`
Expected: FAIL

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "outline and transition"`
Expected: FAIL

Run: `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
Expected: FAIL，说明 spec 尚未同步 outline 模板

- [ ] **Step 3: Write minimal implementation**

在 `src/_rules/behaviors.ts` 中把 `outline` 行为收紧为显式合法分支，不再依赖“先 style、再 width、最后 color”的宽松兜底顺序去承载所有语义。

要求：

- `outline-none` 继续保持 Tailwind 3 特殊语义
- `outline-inherit` 继续允许
- `outline-hidden`、`outline-initial` 继续拒绝
- `outline-color-*`、`outline-width-*`、`outline-style-*` 仍然只走 blocklist migration，不得被 runtime 接纳

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "outline / transition"`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "outline and transition"`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
Expected: PASS

- [ ] **Step 5: Update docs and commit**

```bash
git add -f docs/2026-04-22-outline-source-rewrite-log.md docs/2026-04-22-outline-source-rewrite-status.md src/_rules/behaviors.ts test/fixtures/tailwind-outline-rewrite.ts test/tailwind-utility-spec.ts test/preset-tailwind3-utility-spec.test.ts test/preset-tailwind3.test.ts test/preset-tailwind3-tailwind-diff.test.ts
git commit -m "feat: rewrite outline semantics to tailwind rules"
```

## Task 4: Lock Blocklist Migration And Final Verification

**Files:**
- Modify: `test/fixtures/blocklist-migration.ts`
- Modify: `test/preset-tailwind3-blocklist-messages.test.ts`
- Modify: `docs/2026-04-22-outline-source-rewrite-log.md`
- Modify: `docs/2026-04-22-outline-source-rewrite-status.md`

- [ ] **Step 1: Write the failing test**

确保 `outline` 迁移提示通过共享 fixture 而不是手写样例保护，至少显式覆盖：

```ts
{ input: 'outline-color-red-500', replacement: 'outline-red-500' }
{ input: 'outline-width-2', replacement: 'outline-2' }
{ input: 'outline-style-dashed', replacement: 'outline-dashed' }
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
Expected: FAIL，若 outline 迁移 fixture 尚未正确纳入或 message 未同步

- [ ] **Step 3: Write minimal implementation**

只在 blocklist migration fixture / test 层补齐 outline 样例，不把迁移 message 文本混入 utility spec 或运行时 fixture。

- [ ] **Step 4: Run final verification**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "outline / transition"`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "outline and transition"`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
Expected: PASS

Run: `pnpm test`
Expected: PASS

Run: `pnpm run typecheck`
Expected: PASS

- [ ] **Step 5: Update docs and commit**

```bash
git add -f docs/2026-04-22-outline-source-rewrite-log.md docs/2026-04-22-outline-source-rewrite-status.md test/fixtures/blocklist-migration.ts test/preset-tailwind3-blocklist-messages.test.ts
git commit -m "test: finalize outline rewrite migration coverage"
```

## Verification Checklist

- [ ] `outline-hidden`、`outline-initial` 不会被 runtime 接纳
- [ ] `outline-width-2`、`outline-style-dashed`、`outline-color-red-500` 只通过 blocklist migration 提示暴露，不会误匹配为合法 utility
- [ ] `outline-none` 保持 Tailwind 3 特殊语义
- [ ] `outline-[3px]`、`outline-[#fff]`、`outline-inherit`、`outline-offset-[3px]` 仍可正常匹配
- [ ] `test/tailwind-utility-spec.ts` 已登记 outline 模板
- [ ] 日志与进度文件在每个步骤结束后都被更新并提交

## Execution Assumption

用户已经明确要求“继续，直到完成任务”，因此本计划写完后不等待额外执行选择，默认继续在当前线程按该计划推进，并优先使用 `superpowers:subagent-driven-development` 的逐任务执行与复审方式。
