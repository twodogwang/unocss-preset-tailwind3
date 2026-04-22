# Stroke Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `stroke` 主规则族收敛到 Tailwind CSS 3 正式语法，只保留 `stroke-*` 作为颜色和宽度的合法入口，并把历史别名与裸色值写法纳入迁移治理。

**Architecture:** 运行时入口继续留在 `src/_rules/svg.ts`，但 `stroke` 不再接受 `stroke-width-*` 或 `stroke-size-*` 这类旧别名。测试层沿用 `tracking` / `leading` / `text` 模板：共享 fixture、runtime、Tailwind parity、utility spec、blocklist migration、过程文档和整体总表一起推进。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

这份计划只覆盖 `stroke` 主规则族，不扩展到其他 SVG 行为规则。

包含：

- `stroke-<line-width-key>`
- `stroke-[...]`
- `stroke-<color>`
- `stroke-none`
- `stroke` 相关 utility spec
- `stroke` 相关 blocklist migration message
- `stroke` 的过程日志与任务进度

不包含：

- `stroke-dash-*`
- `stroke-offset-*`
- `stroke-cap-*`
- `stroke-join-*`
- `fill-*`
- `accent-*`
- `caret-*`

## Current Repo Reality

- 当前 `stroke` 运行时实现位于 `src/_rules/svg.ts`
- 当前宽度 matcher 为 `^stroke-(?:width-|size-)?(.+)$`
- 当前已知真实 runtime 差异：
  - `stroke-width-2` 被错误接纳
  - `stroke-size-2` 被错误接纳
- 当前应继续保留的正式写法：
  - `stroke-0`
  - `stroke-1`
  - `stroke-2`
  - `stroke-red-500`
  - `stroke-[#fff]`
  - `stroke-[3px]`
  - `stroke-[length:var(--stroke)]`
  - `stroke-none`

## File Structure

### Existing files to modify

- `src/_rules/svg.ts`
  - 当前 `stroke` 运行时入口
- `src/blocklist.ts`
  - `stroke` 高置信度迁移提示
- `test/preset-tailwind3.test.ts`
  - runtime 边界测试
- `test/preset-tailwind3-tailwind-diff.test.ts`
  - Tailwind parity 测试
- `test/tailwind-utility-spec.ts`
  - `stroke` 规则族登记
- `test/preset-tailwind3-utility-spec.test.ts`
  - utility spec 同步断言
- `test/fixtures/blocklist-migration.ts`
  - `stroke` 迁移提示共享样例
- `test/preset-tailwind3-blocklist-messages.test.ts`
  - blocklist message 测试
- `test/preset-tailwind3-blocklist-prefix-audit.test.ts`
  - blocklist 前缀审计
- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
  - 整体任务唯一实时入口
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
  - 整体状态文档

### New files to create

- `test/fixtures/tailwind-stroke-rewrite.ts`
  - `stroke` 的 canonical / invalid / semantic fixture
- `docs/2026-04-22-stroke-source-rewrite-log.md`
  - 过程日志
- `docs/2026-04-22-stroke-source-rewrite-status.md`
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
   - `docs/2026-04-22-stroke-source-rewrite-log.md`
   - `docs/2026-04-22-stroke-source-rewrite-status.md`
6. overall entry
   - `docs/2026-04-22-tailwind3-source-rewrite-index.md`
   - `docs/2026-04-21-tailwind-grammar-debt-task-status.md`

## Shared Fixture Baseline

`test/fixtures/tailwind-stroke-rewrite.ts` 至少包含：

```ts
export const strokeFixtures = {
  canonical: [
    'stroke-0',
    'stroke-1',
    'stroke-2',
    'stroke-red-500',
    'stroke-[#fff]',
    'stroke-[3px]',
    'stroke-[length:var(--stroke)]',
    'stroke-none',
  ],
  invalid: [
    'stroke-width-2',
    'stroke-size-2',
    'stroke-#fff',
    'stroke-red500',
    'stroke-opacity-50',
    'stroke-op50',
  ],
  semantic: [
    'stroke-2',
    'stroke-red-500',
    'stroke-[#fff]',
    'stroke-[3px]',
    'stroke-none',
  ],
} as const
```

## Task 1: Initialize Stroke Fixtures And Process Tracking

**Files:**
- Create: `test/fixtures/tailwind-stroke-rewrite.ts`
- Create: `docs/2026-04-22-stroke-source-rewrite-log.md`
- Create: `docs/2026-04-22-stroke-source-rewrite-status.md`
- Modify: `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- Modify: `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- Modify: `test/preset-tailwind3.test.ts`
- Modify: `test/preset-tailwind3-tailwind-diff.test.ts`

- [ ] **Step 1: Write the failing test**

接入 `strokeFixtures`，并把 `stroke` 在总表里从 `pending` 改为 `in_progress`。这一步必须先把现有混合 svg color 测试切成 dedicated `stroke` 测试入口，保证后续 `-t "stroke"` 命令能稳定命中。

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "stroke"`
Expected: FAIL，至少暴露 `stroke-width-2` 或 `stroke-size-2` 被错误接纳

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "stroke"`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

这里只做 fixture、文档、测试接线，不改运行时逻辑。

- [ ] **Step 4: Run test to verify it still fails for the right reason**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "stroke"`
Expected: FAIL，但失败原因集中在 `stroke` 语义

- [ ] **Step 5: Commit**

```bash
git add docs/2026-04-22-stroke-source-rewrite-log.md docs/2026-04-22-stroke-source-rewrite-status.md docs/2026-04-22-tailwind3-source-rewrite-index.md docs/2026-04-21-tailwind-grammar-debt-task-status.md test/fixtures/tailwind-stroke-rewrite.ts test/preset-tailwind3.test.ts test/preset-tailwind3-tailwind-diff.test.ts
git commit -m "test: initialize stroke rewrite fixtures and tracking"
```

## Task 2: Tighten Stroke Syntax

**Files:**
- Modify: `src/_rules/svg.ts`
- Modify: `docs/2026-04-22-stroke-source-rewrite-log.md`
- Modify: `docs/2026-04-22-stroke-source-rewrite-status.md`

- [ ] **Step 1: Write the failing test**

确保 `strokeFixtures.invalid` 和 `strokeFixtures.semantic` 已被 runtime / parity 消费，至少锁住：

```ts
invalid: ['stroke-width-2', 'stroke-size-2', 'stroke-#fff', 'stroke-red500', 'stroke-opacity-50', 'stroke-op50']
semantic: ['stroke-2', 'stroke-red-500', 'stroke-[#fff]', 'stroke-[3px]', 'stroke-none']
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "stroke"`
Expected: FAIL

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "stroke"`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

把 `stroke` 主规则族收紧到只接受：

- `stroke-<line-width-key>`
- `stroke-[...]`
- `stroke-<color>`
- `stroke-none`

并拒绝：

- `stroke-width-*`
- `stroke-size-*`

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "stroke"`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "stroke"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/_rules/svg.ts docs/2026-04-22-stroke-source-rewrite-log.md docs/2026-04-22-stroke-source-rewrite-status.md
git commit -m "feat: tighten stroke syntax"
```

## Task 3: Register Stroke Spec And Semantic Assertions

**Files:**
- Modify: `test/tailwind-utility-spec.ts`
- Modify: `test/preset-tailwind3-utility-spec.test.ts`
- Modify: `test/preset-tailwind3.test.ts`
- Modify: `docs/2026-04-22-stroke-source-rewrite-log.md`
- Modify: `docs/2026-04-22-stroke-source-rewrite-status.md`

- [ ] **Step 1: Write the failing test**

在 utility spec 里登记 `stroke`，并为 semantic fixture 增加显式 CSS 断言。

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
Expected: FAIL

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "stroke"`
Expected: FAIL 或缺少 semantic 断言

- [ ] **Step 3: Write minimal implementation**

把 `stroke` 加入 `tailwindUtilitySpecs`，并锁住至少这些 CSS：

- `.stroke-2{stroke-width:2;}`
- `.stroke-red-500{--un-stroke-opacity:1;stroke:rgb(239 68 68 / var(--un-stroke-opacity));}`
- `.stroke-\[\#fff\]{--un-stroke-opacity:1;stroke:rgb(255 255 255 / var(--un-stroke-opacity));}`
- `.stroke-\[3px\]{stroke-width:3px;}`
- `.stroke-none{stroke:none;}`

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "stroke"`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add test/tailwind-utility-spec.ts test/preset-tailwind3-utility-spec.test.ts test/preset-tailwind3.test.ts docs/2026-04-22-stroke-source-rewrite-log.md docs/2026-04-22-stroke-source-rewrite-status.md
git commit -m "feat: lock stroke semantics to tailwind rules"
```

## Task 4: Finalize Blocklist Migration Coverage And Overall Tracking

**Files:**
- Modify: `src/blocklist.ts`
- Modify: `test/fixtures/blocklist-migration.ts`
- Modify: `test/preset-tailwind3-blocklist-messages.test.ts`
- Modify: `test/preset-tailwind3-blocklist-prefix-audit.test.ts`
- Modify: `docs/2026-04-22-stroke-source-rewrite-log.md`
- Modify: `docs/2026-04-22-stroke-source-rewrite-status.md`
- Modify: `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- Modify: `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- Modify: `test/preset-tailwind3-document-governance.test.ts`

- [ ] **Step 1: Write the failing test**

把 `stroke-width-2`、`stroke-size-2`、`stroke-#fff` 的迁移提示纳入共享 fixture，并把整体总表里的 `stroke` 从 `in_progress` 改为 `completed`。

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
Expected: FAIL

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-prefix-audit.test.ts`
Expected: FAIL

Run: `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

补充高置信度迁移提示：

- `stroke-width-2 -> stroke-2`
- `stroke-size-2 -> stroke-2`
- `stroke-#fff -> stroke-[#fff]`

并同步整体文档状态。

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-prefix-audit.test.ts`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
Expected: PASS

Run: `pnpm test`
Expected: PASS

Run: `pnpm run typecheck`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/blocklist.ts test/fixtures/blocklist-migration.ts test/preset-tailwind3-blocklist-messages.test.ts test/preset-tailwind3-blocklist-prefix-audit.test.ts docs/2026-04-22-stroke-source-rewrite-log.md docs/2026-04-22-stroke-source-rewrite-status.md docs/2026-04-22-tailwind3-source-rewrite-index.md docs/2026-04-21-tailwind-grammar-debt-task-status.md test/preset-tailwind3-document-governance.test.ts
git commit -m "test: finalize stroke rewrite migration coverage"
```
