# Background Color And Bg Opacity Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `background-color / bg-opacity` 作为第二阶段第一个 family 纳入完整 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec、blocklist migration 和过程文档。

**Architecture:** 运行时暂时继续留在 `src/_rules/color.ts`，不提前重构 background-style。主工作是把 `bg-*` 颜色和 `bg-opacity-*` 从现有混合测试中拆出来，形成 background-color 专用 fixture、专用测试、专用迁移子集和完整文档链路；只有新测试暴露真实偏差时才修改 runtime。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

包含：

- `bg-red-500`
- `bg-red-500/50`
- `bg-[#fff]`
- `bg-opacity-*`
- 主题扩展下的 `bg-brand`
- `bg-#fff`
- `bg-op50`
- `bg-op-50`
- `background-color` utility spec
- `background-color` blocklist migration 子集
- log / status / index / inventory / overall status

不包含：

- `bg-cover`
- `bg-center`
- `bg-no-repeat`
- `bg-fixed`
- `bg-clip-*`
- `bg-origin-*`
- `bg-gradient-*`
- `bg-[url(...)]`
- `bg-[length:...]`
- `bg-[position:...]`

## File Structure

### Existing files to modify

- `test/preset-tailwind3.test.ts`
- `test/preset-tailwind3-tailwind-diff.test.ts`
- `test/tailwind-utility-spec.ts`
- `test/preset-tailwind3-utility-spec.test.ts`
- `test/fixtures/blocklist-migration.ts`
- `test/preset-tailwind3-blocklist-messages.test.ts`
- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`

### New files to create

- `test/fixtures/tailwind-background-color-rewrite.ts`
- `docs/superpowers/specs/2026-04-22-background-color-bg-opacity-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-22-background-color-bg-opacity-source-rewrite.md`
- `docs/2026-04-22-background-color-bg-opacity-source-rewrite-log.md`
- `docs/2026-04-22-background-color-bg-opacity-source-rewrite-status.md`

## Testing Strategy

验证层分为 5 层：

1. runtime
   - `test/preset-tailwind3.test.ts`
2. Tailwind parity
   - `test/preset-tailwind3-tailwind-diff.test.ts`
3. utility spec
   - `test/tailwind-utility-spec.ts`
   - `test/preset-tailwind3-utility-spec.test.ts`
4. blocklist migration
   - `test/fixtures/blocklist-migration.ts`
   - `test/preset-tailwind3-blocklist-messages.test.ts`
5. process docs
   - `docs/2026-04-22-background-color-bg-opacity-source-rewrite-log.md`
   - `docs/2026-04-22-background-color-bg-opacity-source-rewrite-status.md`

## Task 1: Initialize Background Color Fixtures And Dedicated Tests

**Files:**
- Create: `test/fixtures/tailwind-background-color-rewrite.ts`
- Modify: `test/preset-tailwind3.test.ts`
- Modify: `test/preset-tailwind3-tailwind-diff.test.ts`

- [ ] **Step 1: Add shared fixture**

建立 `backgroundColorFixtures`，包含：

```ts
canonical: ['bg-red-500', 'bg-red-500/50', 'bg-[#fff]', 'bg-opacity-50']
invalid: ['bg-#fff', 'bg-red500', 'bg-op50', 'bg-op-50', 'bgred500']
semantic: ['bg-red-500', 'bg-red-500/50', 'bg-[#fff]', 'bg-opacity-50', 'bg-brand']
```

- [ ] **Step 2: Add runtime tests**

在 `test/preset-tailwind3.test.ts` 新增 background-color 专用断言：

- 正向：`backgroundColorFixtures.canonical`
- 反向：`backgroundColorFixtures.invalid`
- 语义：`backgroundColorFixtures.semantic` + 自定义 `theme.colors.brand`

- [ ] **Step 3: Add parity tests**

在 `test/preset-tailwind3-tailwind-diff.test.ts` 新增：

- `backgroundColorFixtures.canonical`
- `backgroundColorFixtures.invalid`
- `bg-brand` 的 Tailwind/Uno 主题扩展对照

## Task 2: Register Utility Spec And Blocklist Subset

**Files:**
- Modify: `test/tailwind-utility-spec.ts`
- Modify: `test/preset-tailwind3-utility-spec.test.ts`
- Modify: `test/fixtures/blocklist-migration.ts`
- Modify: `test/preset-tailwind3-blocklist-messages.test.ts`

- [ ] **Step 1: Register utility spec**

新增 `background-color`：

```ts
{
  id: 'background-color',
  sourceFiles: ['src/_rules/color.ts'],
  category: 'color',
  canonical: [...backgroundColorFixtures.canonical],
  invalid: [...backgroundColorFixtures.invalid],
  supportsPrefix: true,
  supportsVariants: true,
}
```

- [ ] **Step 2: Add blocklist migration subset**

新增：

```ts
export const backgroundColorBlocklistMigrationFixtures = [
  { input: 'bg-#fff', replacement: 'bg-[#fff]' },
  { input: 'bg-op50', replacement: 'bg-opacity-50' },
  { input: 'bg-op-50', replacement: 'bg-opacity-50' },
] as const
```

- [ ] **Step 3: Lock blocklist message test**

在 `test/preset-tailwind3-blocklist-messages.test.ts` 增加 dedicated subset assertion。

## Task 3: Sync Docs And Task Tracking

**Files:**
- Create: `docs/2026-04-22-background-color-bg-opacity-source-rewrite-log.md`
- Create: `docs/2026-04-22-background-color-bg-opacity-source-rewrite-status.md`
- Modify: `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- Modify: `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
- Modify: `docs/2026-04-21-tailwind-grammar-debt-task-status.md`

- [ ] **Step 1: Add log and status docs**

log 初始内容记录 task 初始化、fixture/test 落盘、总表同步和验证完成。

status 至少记录：

- `design approved`
- `implementation plan approved`
- `Task 1: background color fixtures and dedicated tests`
- `Task 2: utility spec and blocklist migration subset`
- `Task 3: docs and overall tracking sync`

- [ ] **Step 2: Sync index/inventory/status**

要求：

- `background-color / bg-opacity` 在 full inventory 进入 `completed_template`
- source rewrite index 补上专用文档链接
- overall status 明确第二阶段第一个 family 已完成，下一步切到 `background-style / gradient`

## Verification

- [ ] `pnpm exec vitest --run test/preset-tailwind3.test.ts`
- [ ] `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts`
- [ ] `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
- [ ] `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
- [ ] `pnpm run typecheck`
