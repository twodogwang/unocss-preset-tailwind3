# Text Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `text` 主规则族重写为只接受 Tailwind CSS 3 正式语法的实现，并把本轮过程日志与任务进度记录纳入版本控制和分步 git 提交。

**Architecture:** 运行时入口继续保留在 `src/_rules/typography.ts`，但 `text` 的 size / color / opacity 语义不再依赖宽回退混合分发，而是由共享 fixture、runtime、Tailwind parity、utility spec、blocklist migration 共同锁定边界。文档层沿用 `outline` 模板：每个任务都更新 `text` 自己的 log/status，并在总入口文档中同步状态。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

这份计划只覆盖 `text` 主规则族，不扩展到 `leading`、`tracking`、`text-shadow`、`text-stroke`。

包含：

- `text-<size>`
- `text-<size>/<line-height>`
- `text-<color>`
- `text-[...]`
- `text-[...]/[...]`
- `text-red-500/50`
- `text-opacity-*`
- `text` 相关 utility spec
- `text` 相关 blocklist migration message
- 过程日志与任务进度记录

不包含：

- `leading-*`
- `tracking-*`
- `text-shadow-*`
- `text-stroke-*`
- `indent-*`

## Current Repo Reality

- 当前 `text` 运行时实现位于 `src/_rules/typography.ts`
- 当前存在两个关键入口重叠：
  - `^text-(.+)$` 同时承担 size / color
  - `^(?:text|font)-size-(.+)$` 仍然放行历史别名
- 当前已知真实 runtime 差异：
  - `text-10px` 被错误接纳
  - `text-2rem` 被错误接纳
  - `text-size-sm` 被错误接纳
  - `font-size-sm` 被错误接纳
- 当前应继续保留的正式写法：
  - `text-sm`
  - `text-lg/7`
  - `text-[14px]`
  - `text-[14px]/[20px]`
  - `text-white`
  - `text-red-500/50`
  - `text-[#fff]`
  - `text-opacity-50`
- 当前已有非法写法测试但尚未形成 `text` 专用模板：
  - `text-#fff`
  - `text-red500`
  - `text-color-red-500`
- 当前 blocklist 只有 `text-#fff -> text-[#fff]` 相关迁移，没有 `text-size-*` / `font-size-*` / 裸长度值的 `text` 迁移提示

## File Structure

### Existing files to modify

- `src/_rules/typography.ts`
  - 当前 `text` 主规则族运行时入口
- `src/blocklist.ts`
  - `text` 高置信度迁移提示
- `test/preset-tailwind3.test.ts`
  - runtime 边界测试
- `test/preset-tailwind3-tailwind-diff.test.ts`
  - Tailwind parity 边界测试
- `test/tailwind-utility-spec.ts`
  - 规则族规范清单
- `test/preset-tailwind3-utility-spec.test.ts`
  - 规格层同步断言
- `test/fixtures/blocklist-migration.ts`
  - `text` 迁移提示 fixture
- `test/preset-tailwind3-blocklist-messages.test.ts`
  - blocklist message 测试
- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
  - 整体任务唯一实时入口

### New files to create

- `test/fixtures/tailwind-text-rewrite.ts`
  - `text` 的 canonical / invalid / semantic fixture
- `docs/2026-04-22-text-source-rewrite-log.md`
  - 过程日志
- `docs/2026-04-22-text-source-rewrite-status.md`
  - 任务进度

### Responsibility boundaries

- `src/_rules/typography.ts` 只负责 `text` 的匹配与 CSS 生成
- `src/blocklist.ts` 只负责 `text` 的高置信度迁移提示
- `test/fixtures/tailwind-text-rewrite.ts` 只负责 `text` 共享样例
- `test/tailwind-utility-spec.ts` 只负责规则族规范登记
- `test/fixtures/blocklist-migration.ts` 只负责迁移提示共享样例
- `docs/2026-04-22-text-source-rewrite-*.md` 只负责过程记录

## Testing Strategy

必须遵循 @superpowers:test-driven-development 和 @superpowers:verification-before-completion。

验证层分为 6 层：

1. runtime:
   - `test/preset-tailwind3.test.ts`
2. Tailwind parity:
   - `test/preset-tailwind3-tailwind-diff.test.ts`
3. utility spec:
   - `test/tailwind-utility-spec.ts`
   - `test/preset-tailwind3-utility-spec.test.ts`
4. blocklist migration:
   - `src/blocklist.ts`
   - `test/fixtures/blocklist-migration.ts`
   - `test/preset-tailwind3-blocklist-messages.test.ts`
5. process docs:
   - `docs/2026-04-22-text-source-rewrite-log.md`
   - `docs/2026-04-22-text-source-rewrite-status.md`
6. overall entry:
   - `docs/2026-04-22-tailwind3-source-rewrite-index.md`

每个任务完成时都必须：

1. 更新 `text` 的日志文档
2. 更新 `text` 的进度文档
3. 必要时更新总入口文档
4. 跑对应验证命令
5. 单独提交 git

## Shared Fixture Baseline

`test/fixtures/tailwind-text-rewrite.ts` 至少包含如下样例：

```ts
export const textFixtures = {
  canonical: [
    'text-sm',
    'text-lg/7',
    'text-[14px]',
    'text-[14px]/[20px]',
    'text-white',
    'text-red-500/50',
    'text-[#fff]',
    'text-opacity-50',
  ],
  invalid: [
    'text-10px',
    'text-2rem',
    'text-size-sm',
    'font-size-sm',
    'text-#fff',
    'text-red500',
    'text-color-red-500',
  ],
  semantic: [
    'text-sm',
    'text-lg/7',
    'text-[14px]',
    'text-[14px]/[20px]',
    'text-white',
    'text-opacity-50',
  ],
} as const
```

## Task 1: Initialize Text Fixtures And Process Tracking

**Files:**
- Create: `test/fixtures/tailwind-text-rewrite.ts`
- Create: `docs/2026-04-22-text-source-rewrite-log.md`
- Create: `docs/2026-04-22-text-source-rewrite-status.md`
- Modify: `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- Modify: `test/preset-tailwind3.test.ts`
- Modify: `test/preset-tailwind3-tailwind-diff.test.ts`

- [ ] **Step 1: Write the failing test**

先写共享 fixture、日志文件、进度文件，并把 runtime/parity 测试改为直接消费 `textFixtures`。

日志文件初始内容至少包含：

```md
# Text Source Rewrite Log

- 2026-04-22: initialized text rewrite task
- current focus: create failing tests and tracking docs
```

进度文件初始内容至少包含：

```md
# Text Source Rewrite Status

- phase: red
- completed:
  - design approved
- in_progress:
  - initialize fixtures, logs, and failing tests
- pending:
  - strict size syntax
  - lock color and opacity semantics
  - blocklist migration and final verification
```

总入口文档把 `text` 状态从 `pending` 改为 `in_progress`。

在 runtime/parity 里至少接入：

```ts
await expectTargets(textFixtures.canonical)
await expectNonTargets(textFixtures.invalid)
await expectTailwindParity(textFixtures.canonical)
await expectTailwindParity(textFixtures.invalid)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "text"`
Expected: FAIL，至少应暴露 `text-10px`、`text-2rem`、`text-size-sm` 或 `font-size-sm` 被错误接纳

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "text"`
Expected: FAIL，说明当前 `text` 宽分发仍与 Tailwind 3 在真实差异样例上不一致

- [ ] **Step 3: Write minimal implementation**

这里只做测试与文档接线，不改运行时逻辑。

- [ ] **Step 4: Run test to verify it still fails for the right reason**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "text"`
Expected: FAIL，但失败原因应集中在 `text` 语义而不是测试结构或类型错误

- [ ] **Step 5: Commit**

```bash
git add docs/2026-04-22-text-source-rewrite-log.md docs/2026-04-22-text-source-rewrite-status.md docs/2026-04-22-tailwind3-source-rewrite-index.md test/fixtures/tailwind-text-rewrite.ts test/preset-tailwind3.test.ts test/preset-tailwind3-tailwind-diff.test.ts
git commit -m "test: initialize text rewrite fixtures and tracking"
```

## Task 2: Lock Text Size Syntax

**Files:**
- Modify: `src/_rules/typography.ts`
- Modify: `test/fixtures/tailwind-text-rewrite.ts`
- Modify: `test/preset-tailwind3.test.ts`
- Modify: `test/preset-tailwind3-tailwind-diff.test.ts`
- Modify: `docs/2026-04-22-text-source-rewrite-log.md`
- Modify: `docs/2026-04-22-text-source-rewrite-status.md`

- [ ] **Step 1: Write the failing test**

把 size 相关样例和 semantic 断言写死，至少覆盖：

```ts
canonical: [
  'text-sm',
  'text-lg/7',
  'text-[14px]',
  'text-[14px]/[20px]',
]
invalid: [
  'text-10px',
  'text-2rem',
  'text-size-sm',
  'font-size-sm',
]
```

补 runtime CSS 语义断言：

```ts
const css = await expectTargets(['text-sm', 'text-lg/7', 'text-[14px]', 'text-[14px]/[20px]'])
expect(css).toContain('.text-sm{font-size:')
expect(css).toContain('.text-lg\\/7{font-size:')
expect(css).toContain('line-height:')
expect(css).toContain('.text-\\[14px\\]{font-size:14px;}')
expect(css).toContain('.text-\\[14px\\]\\/\\[20px\\]{font-size:14px;line-height:20px;}')
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "text"`
Expected: FAIL，表明当前实现仍然宽接收 `text-10px` / `text-2rem` / `text-size-sm` / `font-size-sm`

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "text"`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

把 `text` size 语义收紧到：

- 正式 theme key
- 正式 shorthand：`text-<size>/<line-height>`
- bracket arbitrary：`text-[...]` 与 `text-[...]/[...]`

同时移除 `text-size-*` / `font-size-*` 的 runtime 放行。

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "text"`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "text"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/_rules/typography.ts test/fixtures/tailwind-text-rewrite.ts test/preset-tailwind3.test.ts test/preset-tailwind3-tailwind-diff.test.ts docs/2026-04-22-text-source-rewrite-log.md docs/2026-04-22-text-source-rewrite-status.md
git commit -m "feat: tighten text size syntax"
```

## Task 3: Lock Text Color And Opacity Semantics And Register The Spec

**Files:**
- Modify: `src/_rules/typography.ts`
- Modify: `test/fixtures/tailwind-text-rewrite.ts`
- Modify: `test/tailwind-utility-spec.ts`
- Modify: `test/preset-tailwind3-utility-spec.test.ts`
- Modify: `test/preset-tailwind3.test.ts`
- Modify: `test/preset-tailwind3-tailwind-diff.test.ts`
- Modify: `docs/2026-04-22-text-source-rewrite-log.md`
- Modify: `docs/2026-04-22-text-source-rewrite-status.md`

- [ ] **Step 1: Write the failing test**

把 color / opacity / semantic 断言写死，至少覆盖：

```ts
canonical: [
  'text-white',
  'text-red-500/50',
  'text-[#fff]',
  'text-opacity-50',
]
invalid: [
  'text-#fff',
  'text-red500',
  'text-color-red-500',
]
```

补 runtime CSS 语义断言：

```ts
const css = await expectTargets(['text-white', 'text-red-500/50', 'text-opacity-50'])
expect(css).toContain('color:')
expect(css).toContain('--un-text-opacity')
```

同时把 `text` 纳入 `test/tailwind-utility-spec.ts`。

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "text"`
Expected: FAIL

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "text"`
Expected: FAIL

Run: `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

收紧 `text` color / opacity 行为，要求：

- `text-white`、`text-red-500/50`、`text-[#fff]`、`text-opacity-50` 继续成立
- `text-#fff`、`text-red500`、`text-color-red-500` 不被 runtime 接纳
- `text` 规则族正式登记到 utility spec

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "text"`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "text"`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/_rules/typography.ts test/fixtures/tailwind-text-rewrite.ts test/tailwind-utility-spec.ts test/preset-tailwind3-utility-spec.test.ts test/preset-tailwind3.test.ts test/preset-tailwind3-tailwind-diff.test.ts docs/2026-04-22-text-source-rewrite-log.md docs/2026-04-22-text-source-rewrite-status.md
git commit -m "feat: rewrite text semantics to tailwind rules"
```

## Task 4: Lock Text Blocklist Migration And Final Verification

**Files:**
- Modify: `src/blocklist.ts`
- Modify: `test/fixtures/blocklist-migration.ts`
- Modify: `test/preset-tailwind3-blocklist-messages.test.ts`
- Modify: `docs/2026-04-22-text-source-rewrite-log.md`
- Modify: `docs/2026-04-22-text-source-rewrite-status.md`
- Modify: `docs/2026-04-22-tailwind3-source-rewrite-index.md`

- [ ] **Step 1: Write the failing test**

确保 `text` 迁移提示通过共享 fixture 而不是手写样例保护，至少显式覆盖：

```ts
{ input: 'text-#fff', replacement: 'text-[#fff]' }
{ input: 'text-size-sm', replacement: 'text-sm' }
{ input: 'font-size-sm', replacement: 'text-sm' }
{ input: 'text-10px', replacement: 'text-[10px]' }
{ input: 'text-2rem', replacement: 'text-[2rem]' }
{ input: 'text-color-red-500', replacement: 'text-red-500' }
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
Expected: FAIL，说明 `text` 迁移 fixture 或 source blocklist 尚未同步

- [ ] **Step 3: Write minimal implementation**

只在 blocklist migration fixture / source blocklist / message test 层补齐 `text` 样例，同时把总入口中 `text` 的状态推进到 `completed` 并补齐对应文档链接。

- [ ] **Step 4: Run final verification**

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "text"`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "text"`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
Expected: PASS

Run: `pnpm test`
Expected: PASS

Run: `pnpm run typecheck`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/blocklist.ts test/fixtures/blocklist-migration.ts test/preset-tailwind3-blocklist-messages.test.ts docs/2026-04-22-text-source-rewrite-log.md docs/2026-04-22-text-source-rewrite-status.md docs/2026-04-22-tailwind3-source-rewrite-index.md
git commit -m "test: finalize text rewrite migration coverage"
```

## Verification Checklist

- [ ] `text-10px`、`text-2rem` 不会被 runtime 接纳
- [ ] `text-size-sm`、`font-size-sm` 不会被 runtime 接纳
- [ ] `text-sm`、`text-lg/7`、`text-[14px]`、`text-[14px]/[20px]` 继续成立
- [ ] `text-white`、`text-red-500/50`、`text-[#fff]`、`text-opacity-50` 继续成立
- [ ] `text-#fff`、`text-size-sm`、`font-size-sm`、`text-10px`、`text-2rem`、`text-color-red-500` 通过共享 fixture 获得迁移提示
- [ ] `text` 已登记到 utility spec
- [ ] `text` 的 log / status 与总入口同步更新
