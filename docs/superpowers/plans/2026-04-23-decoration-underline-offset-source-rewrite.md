# Decoration And Underline Offset Source Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `decoration / underline-offset` 主规则族纳入完整 rewrite 模板，并补齐 shared fixture、runtime/parity、utility spec、blocklist migration 子集和过程文档。

**Architecture:** 运行时暂时继续留在 `src/_rules/decoration.ts`，不顺手扩到 `ring` 或 `text-decoration` 其他拆分主题。主工作是把 `decoration / underline-offset` 从现有混合测试中拆出来，形成 decoration 专用 fixture、专用测试、专用 blocklist migration 子集和完整文档链路；只有新测试暴露真实偏差时才修改 runtime。

**Tech Stack:** TypeScript, UnoCSS rules, Vitest, Tailwind CSS 3.4, PostCSS, pnpm

---

## Scope

包含：

- `underline`
- `overline`
- `line-through`
- `no-underline`
- `decoration-2`
- `decoration-[3px]`
- `decoration-auto`
- `decoration-from-font`
- `decoration-solid`
- `decoration-dashed`
- `decoration-wavy`
- `decoration-red-500`
- `decoration-[#fff]`
- `underline-offset-4`
- `underline-offset-[3px]`
- `decoration` utility spec
- `decoration` blocklist migration 子集
- log / status / index / inventory / overall status

不包含：

- `decoration-op50`
- `decoration-opacity-50`
- `ring-*`
- `text-decoration` 其他长期拆分主题

## File Structure

### Existing files to modify

- `src/blocklist.ts`
- `test/preset-tailwind3.test.ts`
- `test/preset-tailwind3-tailwind-diff.test.ts`
- `test/tailwind-utility-spec.ts`
- `test/preset-tailwind3-utility-spec.test.ts`
- `test/fixtures/blocklist-migration.ts`
- `test/preset-tailwind3-blocklist-messages.test.ts`
- `test/preset-tailwind3-blocklist-prefix-audit.test.ts`
- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`

### New files to create

- `test/fixtures/tailwind-decoration-rewrite.ts`
- `docs/superpowers/specs/2026-04-23-decoration-underline-offset-source-rewrite-design.md`
- `docs/superpowers/plans/2026-04-23-decoration-underline-offset-source-rewrite.md`
- `docs/2026-04-23-decoration-underline-offset-source-rewrite-log.md`
- `docs/2026-04-23-decoration-underline-offset-source-rewrite-status.md`

## Testing Strategy

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
   - `docs/2026-04-23-decoration-underline-offset-source-rewrite-log.md`
   - `docs/2026-04-23-decoration-underline-offset-source-rewrite-status.md`
6. overall docs
   - `docs/2026-04-22-tailwind3-source-rewrite-index.md`
   - `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
   - `docs/2026-04-21-tailwind-grammar-debt-task-status.md`

## Task 1: Initialize Decoration Fixtures And Dedicated Tests

**Files:**
- Create: `test/fixtures/tailwind-decoration-rewrite.ts`
- Modify: `test/preset-tailwind3.test.ts`
- Modify: `test/preset-tailwind3-tailwind-diff.test.ts`

- [ ] **Step 1: Add shared fixture**

建立 `decorationFixtures`，包含 canonical / invalid / semantic。

- [ ] **Step 2: Add runtime tests**

在 `test/preset-tailwind3.test.ts` 新增 decoration 专用断言：

- 正向：`decorationFixtures.canonical`
- 反向：`decorationFixtures.invalid`
- 语义：`decorationFixtures.semantic`

- [ ] **Step 3: Add parity tests**

在 `test/preset-tailwind3-tailwind-diff.test.ts` 新增：

- `decorationFixtures.canonical`
- `decorationFixtures.invalid`

## Task 2: Register Utility Spec And Blocklist Subset

**Files:**
- Modify: `src/blocklist.ts`
- Modify: `test/tailwind-utility-spec.ts`
- Modify: `test/preset-tailwind3-utility-spec.test.ts`
- Modify: `test/fixtures/blocklist-migration.ts`
- Modify: `test/preset-tailwind3-blocklist-messages.test.ts`
- Modify: `test/preset-tailwind3-blocklist-prefix-audit.test.ts`

- [ ] **Step 1: Register utility spec**

新增 `decoration`：

```ts
{
  id: 'decoration',
  sourceFiles: ['src/_rules/decoration.ts'],
  category: 'typography',
  canonical: [...decorationFixtures.canonical],
  invalid: [...decorationFixtures.invalid],
  supportsPrefix: true,
  supportsVariants: true,
}
```

- [ ] **Step 2: Add blocklist migration subset**

新增：

```ts
export const decorationBlocklistMigrationFixtures = [
  { input: 'decoration-none', replacement: 'no-underline' },
  { input: 'decoration-underline', replacement: 'underline' },
  { input: 'decoration-offset-4', replacement: 'underline-offset-4' },
  { input: 'underline-2', replacement: 'decoration-2' },
  { input: 'underline-[3px]', replacement: 'decoration-[3px]' },
  { input: 'underline-auto', replacement: 'decoration-auto' },
  { input: 'underline-dashed', replacement: 'decoration-dashed' },
  { input: 'underline-wavy', replacement: 'decoration-wavy' },
] as const
```

- [ ] **Step 3: Lock blocklist message and prefix audit tests**

在 `test/preset-tailwind3-blocklist-messages.test.ts` 与 `test/preset-tailwind3-blocklist-prefix-audit.test.ts` 增加 dedicated subset assertion。

## Task 3: Sync Docs And Task Tracking

**Files:**
- Create: `docs/2026-04-23-decoration-underline-offset-source-rewrite-log.md`
- Create: `docs/2026-04-23-decoration-underline-offset-source-rewrite-status.md`
- Modify: `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- Modify: `docs/2026-04-22-tailwind3-full-rule-family-inventory.md`
- Modify: `docs/2026-04-21-tailwind-grammar-debt-task-status.md`

- [ ] **Step 1: Add log and status docs**

status 至少记录：

- `design approved`
- `implementation plan approved`
- `Task 1: decoration fixtures and dedicated tests`
- `Task 2: utility spec and blocklist migration subset`
- `Task 3: docs and overall tracking sync`

- [ ] **Step 2: Sync index/inventory/status**

要求：

- `decoration / underline-offset` 在 full inventory 进入 `completed_template`
- source rewrite index 的第二阶段里程碑补上专用文档链接
- overall status 的第二阶段里程碑补上当前 family，并把下一步推进到 `shadow / divide`

## Verification

- [ ] `pnpm exec vitest --run test/preset-tailwind3.test.ts`
- [ ] `pnpm exec vitest --run test/preset-tailwind3-tailwind-diff.test.ts`
- [ ] `pnpm exec vitest --run test/preset-tailwind3-utility-spec.test.ts`
- [ ] `pnpm exec vitest --run test/preset-tailwind3-blocklist-messages.test.ts`
- [ ] `pnpm exec vitest --run test/preset-tailwind3-blocklist-prefix-audit.test.ts`
- [ ] `pnpm exec vitest --run test/preset-tailwind3-document-governance.test.ts`
- [ ] `pnpm run typecheck`
