# Tracking Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `tracking` 主规则族收敛到 Tailwind CSS 3 正式语法，只保留 `tracking-*` 作为合法入口，并把历史别名与裸长度写法纳入迁移治理。

**Architecture:** 运行时入口继续留在 `src/_rules/typography.ts`，但 `tracking` 不再接受 `font-tracking-*` 或裸长度写法。测试层沿用 `leading` / `text` 模板：共享 fixture、runtime、Tailwind parity、utility spec、blocklist migration、过程文档和整体总表一起推进。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

这份计划只覆盖 `tracking` 主规则族，不扩展到 `text`、`leading`、`word-spacing`、`text-shadow`、`text-stroke`。

包含：

- `tracking-<theme-key>`
- `tracking-[...]`
- `tracking` 相关 utility spec
- `tracking` 相关 blocklist migration message
- `tracking` 的过程日志与任务进度

不包含：

- `text-*` 的重写
- `leading-*`
- `font-tracking-*`
- `letter-spacing-*`
- `word-spacing-*`

## Current Repo Reality

- 当前 `tracking` 运行时实现位于 `src/_rules/typography.ts`
- 当前 matcher 为 `^(?:font-)?tracking-(.+)$`
- 当前已知真实 runtime 差异：
  - `font-tracking-wide` 被错误接纳
  - `tracking-0.2em` 被错误接纳
- 当前应继续保留的正式写法：
  - `tracking-tighter`
  - `tracking-tight`
  - `tracking-normal`
  - `tracking-wide`
  - `tracking-wider`
  - `tracking-widest`
  - `tracking-[0.2em]`
  - `tracking-[calc(1em-1px)]`

## File Structure

### Existing files to modify

- `src/_rules/typography.ts`
  - 当前 `tracking` 运行时入口
- `src/blocklist.ts`
  - `tracking` 高置信度迁移提示
- `test/preset-tailwind3.test.ts`
  - runtime 边界测试
- `test/preset-tailwind3-tailwind-diff.test.ts`
  - Tailwind parity 测试
- `test/tailwind-utility-spec.ts`
  - `tracking` 规则族登记
- `test/preset-tailwind3-utility-spec.test.ts`
  - utility spec 同步断言
- `test/fixtures/blocklist-migration.ts`
  - `tracking` 迁移提示共享样例
- `test/preset-tailwind3-blocklist-messages.test.ts`
  - blocklist message 测试
- `test/preset-tailwind3-blocklist-prefix-audit.test.ts`
  - blocklist 前缀审计
- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
  - 整体任务唯一实时入口
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
  - 整体状态文档

### New files to create

- `test/fixtures/tailwind-tracking-rewrite.ts`
  - `tracking` 的 canonical / invalid / semantic fixture
- `docs/2026-04-22-tracking-source-rewrite-log.md`
  - 过程日志
- `docs/2026-04-22-tracking-source-rewrite-status.md`
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
   - `docs/2026-04-22-tracking-source-rewrite-log.md`
   - `docs/2026-04-22-tracking-source-rewrite-status.md`
6. overall entry
   - `docs/2026-04-22-tailwind3-source-rewrite-index.md`
   - `docs/2026-04-21-tailwind-grammar-debt-task-status.md`

## Shared Fixture Baseline

`test/fixtures/tailwind-tracking-rewrite.ts` 至少包含：

```ts
export const trackingFixtures = {
  canonical: [
    'tracking-tighter',
    'tracking-tight',
    'tracking-normal',
    'tracking-wide',
    'tracking-wider',
    'tracking-widest',
    'tracking-[0.2em]',
    'tracking-[calc(1em-1px)]',
  ],
  invalid: [
    'font-tracking-wide',
    'tracking-0.2em',
    'letter-spacing-wide',
  ],
  semantic: [
    'tracking-tight',
    'tracking-wide',
    'tracking-[0.2em]',
    'tracking-[calc(1em-1px)]',
  ],
} as const
```

## Task 1: Initialize Tracking Fixtures And Process Tracking

**Files:**
- Create: `test/fixtures/tailwind-tracking-rewrite.ts`
- Create: `docs/2026-04-22-tracking-source-rewrite-log.md`
- Create: `docs/2026-04-22-tracking-source-rewrite-status.md`
- Modify: `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- Modify: `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- Modify: `test/preset-tailwind3.test.ts`
- Modify: `test/preset-tailwind3-tailwind-diff.test.ts`

- [ ] **Step 1: Write the failing test**

接入 `trackingFixtures`，并把 `tracking` 在总表里从 `pending` 改为 `in_progress`。这一步必须先把现有混合 typography 测试切成 dedicated `tracking` 测试入口，保证后续 `-t "tracking"` 命令能稳定命中。

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "tracking"`
Expected: FAIL，至少暴露 `font-tracking-wide` 或 `tracking-0.2em` 被错误接纳

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "tracking"`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

这里只做 fixture、文档、测试接线，不改运行时逻辑。

- [ ] **Step 4: Run test to verify it still fails for the right reason**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "tracking"`
Expected: FAIL，但失败原因集中在 `tracking` 语义

- [ ] **Step 5: Commit**

```bash
git add docs/2026-04-22-tracking-source-rewrite-log.md docs/2026-04-22-tracking-source-rewrite-status.md docs/2026-04-22-tailwind3-source-rewrite-index.md docs/2026-04-21-tailwind-grammar-debt-task-status.md test/fixtures/tailwind-tracking-rewrite.ts test/preset-tailwind3.test.ts test/preset-tailwind3-tailwind-diff.test.ts
git commit -m "test: initialize tracking rewrite fixtures and tracking"
```

## Task 2: Tighten Tracking Syntax

**Files:**
- Modify: `src/_rules/typography.ts`
- Modify: `docs/2026-04-22-tracking-source-rewrite-log.md`
- Modify: `docs/2026-04-22-tracking-source-rewrite-status.md`

- [ ] **Step 1: Write the failing test**

确保 `trackingFixtures.invalid` 和 `trackingFixtures.semantic` 已被 runtime / parity 消费，至少锁住：

```ts
invalid: ['font-tracking-wide', 'tracking-0.2em', 'letter-spacing-wide']
semantic: ['tracking-tight', 'tracking-wide', 'tracking-[0.2em]', 'tracking-[calc(1em-1px)]']
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "tracking"`
Expected: FAIL

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "tracking"`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

把 `tracking` matcher 收紧到只接受：

- `tracking-<theme-key>`
- `tracking-[...]`

并拒绝：

- `font-tracking-*`
- 裸长度 `tracking-0.2em`

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "tracking"`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "tracking"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/_rules/typography.ts docs/2026-04-22-tracking-source-rewrite-log.md docs/2026-04-22-tracking-source-rewrite-status.md
git commit -m "feat: tighten tracking syntax"
```

## Task 3: Register Tracking Spec And Semantic Assertions

**Files:**
- Modify: `test/tailwind-utility-spec.ts`
- Modify: `test/preset-tailwind3-utility-spec.test.ts`
- Modify: `test/preset-tailwind3.test.ts`
- Modify: `docs/2026-04-22-tracking-source-rewrite-log.md`
- Modify: `docs/2026-04-22-tracking-source-rewrite-status.md`

- [ ] **Step 1: Write the failing test**

把 `tracking` 纳入 utility spec，并补 semantic 断言：

```ts
expect(css).toContain('.tracking-tight{letter-spacing:-0.025em;}')
expect(css).toContain('.tracking-wide{letter-spacing:0.025em;}')
expect(css).toContain('.tracking-\\[0\\.2em\\]{letter-spacing:0.2em;}')
expect(css).toContain('.tracking-\\[calc\\(1em-1px\\)\\]{letter-spacing:calc(1em - 1px);}')
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

只补充 spec 登记和 semantic 断言，不做额外运行时改造。

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "tracking"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add test/tailwind-utility-spec.ts test/preset-tailwind3-utility-spec.test.ts test/preset-tailwind3.test.ts docs/2026-04-22-tracking-source-rewrite-log.md docs/2026-04-22-tracking-source-rewrite-status.md
git commit -m "feat: lock tracking semantics to tailwind rules"
```

## Task 4: Lock Tracking Blocklist Migration And Final Verification

**Files:**
- Modify: `src/blocklist.ts`
- Modify: `test/fixtures/blocklist-migration.ts`
- Modify: `test/preset-tailwind3-blocklist-messages.test.ts`
- Modify: `test/preset-tailwind3-blocklist-prefix-audit.test.ts`
- Modify: `docs/2026-04-22-tracking-source-rewrite-log.md`
- Modify: `docs/2026-04-22-tracking-source-rewrite-status.md`
- Modify: `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- Modify: `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
- Modify: `test/preset-tailwind3-document-governance.test.ts`

- [ ] **Step 1: Write the failing test**

至少覆盖迁移提示：

```ts
{ input: 'font-tracking-wide', replacement: 'tracking-wide' }
{ input: 'tracking-0.2em', replacement: 'tracking-[0.2em]' }
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

把 `tracking` 迁移提示补进 blocklist 源、共享 fixture 和 prefix audit，同时把整体文档推进到 `tracking: completed`。

- [ ] **Step 4: Run final verification**

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-blocklist-prefix-audit.test.ts`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3.test.ts -t "tracking"`
Expected: PASS

Run: `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts -t "tracking"`
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
git add src/blocklist.ts test/fixtures/blocklist-migration.ts test/preset-tailwind3-blocklist-messages.test.ts test/preset-tailwind3-blocklist-prefix-audit.test.ts docs/2026-04-22-tracking-source-rewrite-log.md docs/2026-04-22-tracking-source-rewrite-status.md docs/2026-04-22-tailwind3-source-rewrite-index.md docs/2026-04-21-tailwind-grammar-debt-task-status.md test/preset-tailwind3-document-governance.test.ts
git commit -m "test: finalize tracking rewrite migration coverage"
```

## Verification Checklist

- [ ] `tracking-*` 是唯一合法的 letter-spacing 主入口
- [ ] `font-tracking-*` 和裸长度 `tracking-0.2em` 不会被 runtime 接纳
- [ ] `tracking-[0.2em]`、`tracking-[calc(1em-1px)]` 持续成立
- [ ] `tracking` 已登记到 utility spec
- [ ] `font-tracking-wide`、`tracking-0.2em` 已有迁移提示
- [ ] `tracking` 的 log / status 与整体总表同步更新
