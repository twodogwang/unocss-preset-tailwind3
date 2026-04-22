# Spacing Border Spacing Space Source Rewrite Design

## Goal

把 `spacing` 的最后一个子阶段收敛到 Tailwind CSS 3 正式语法，当前只治理 `border-spacing-*` 与 `space-x/y-*` 主规则族；补上 preset 当前缺失的 `space-x/y` 正式支持，同时明确拒绝 `space-inline-*` / `space-block-*` 等非 Tailwind 3 扩展写法。

## Scope

本次设计只覆盖 `spacing` 的 `border-spacing / space-*` 子阶段。

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

## Current Repo Reality

当前运行时入口分成两部分：

- [src/_rules-wind3/table.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules-wind3/table.ts)
- [src/_rules-wind3/spacing.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules-wind3/spacing.ts)

当前 repo 的真实状态不是“全部已对齐”：

- `border-spacing-*` 已经接入 `src/rules.ts`，并且与 Tailwind 3 的主语法基本一致
- `space-x-*` / `space-y-*` 虽然运行时规则存在于 `src/_rules-wind3/spacing.ts`，但当前并没有接入 [src/rules.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/rules.ts)，所以 preset 现在错误地缺失了 Tailwind 3 正式支持
- `space-inline-*` / `space-block-*` 当前写在 `src/_rules-wind3/spacing.ts`，但 Tailwind 3 不支持这些 logical 扩展，因此它们不能在接线时一起被带进来

这意味着本轮既要建立治理模板，也要补一个真实的 runtime 缺口：

1. 把 `space-x/y` 正式接入 preset
2. 保持 `border-spacing-*` 当前正确行为
3. 不把 `space-inline/block` 扩展带入最终语义

## Design Decision

本轮采用“正式纳管 + 最小必要运行时修正”的方案：

1. 保持 `border-spacing-*` 当前运行时逻辑，只在测试证明有真实偏差时调整
2. 修改 `src/_rules-wind3/spacing.ts`，只保留 `space-x/y-*` 与 `space-x/y-reverse` 主规则族
3. 在 [src/rules.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/rules.ts) 中正式接入 `spaces`
4. 新增 `border-spacing / space-*` 共享 fixture，拆出 `canonical / invalid / semantic`
5. runtime / Tailwind parity / utility spec / blocklist migration 四层同时锁边界
6. 本子阶段完成后，`spacing` 在整体总表里可以从 `in_progress` 切到 `completed`

## Runtime Semantics

合法写法：

- `border-spacing-2`
- `border-spacing-x-4`
- `border-spacing-y-[3px]`
- `space-x-4`
- `space-y-2`
- `space-x-reverse`
- `space-y-reverse`
- `space-x-[5px]`
- `space-y-[var(--gap)]`

非法写法：

- `borderspacing-2`
- `border-spacing-3px`
- `border-spacingx-2`
- `border-spacingy4`
- `spacex-4`
- `spacey2`
- `space-x-5px`
- `space-y-var(--gap)`
- `space-inline-4`
- `space-block-4`
- `space-inline-reverse`
- `space-block-reverse`

语义断言至少锁住：

- `border-spacing-2 -> border-spacing:0.5rem 0.5rem`
- `border-spacing-x-4 -> --un-border-spacing-x:1rem`
- `space-x-4 -> 子选择器 margin-left / margin-right`
- `space-y-2 -> 子选择器 margin-top / margin-bottom`
- `space-x-reverse -> --un-space-x-reverse:1`

## Shared Fixture Shape

`test/fixtures/tailwind-spacing-border-spacing-space-rewrite.ts` 至少包含：

```ts
export const borderSpacingSpaceFixtures = {
  canonical: [
    'border-spacing-2',
    'border-spacing-x-4',
    'border-spacing-y-[3px]',
    'space-x-4',
    'space-y-2',
    'space-x-reverse',
    'space-y-reverse',
    'space-x-[5px]',
    'space-y-[var(--gap)]',
  ],
  invalid: [
    'borderspacing-2',
    'border-spacing-3px',
    'border-spacingx-2',
    'border-spacingy4',
    'spacex-4',
    'spacey2',
    'space-x-5px',
    'space-y-var(--gap)',
    'space-inline-4',
    'space-block-4',
    'space-inline-reverse',
    'space-block-reverse',
  ],
  semantic: [
    'border-spacing-2',
    'border-spacing-x-4',
    'space-x-4',
    'space-y-2',
    'space-x-reverse',
  ],
} as const
```

## Blocklist Migration Scope

高置信度迁移提示应覆盖：

- `borderspacing-2 -> border-spacing-2`
- `border-spacing-3px -> border-spacing-[3px]`
- `border-spacingx-2 -> border-spacing-x-2`
- `border-spacingy4 -> border-spacing-y-4`
- `spacex-4 -> space-x-4`
- `spacey2 -> space-y-2`
- `space-x-5px -> space-x-[5px]`
- `space-y-var(--gap) -> space-y-[var(--gap)]`

不提供迁移提示，只做反向拒绝：

- `space-inline-4`
- `space-block-4`
- `space-inline-reverse`
- `space-block-reverse`

原因：这些 logical 扩展并不是 Tailwind 3 正式主语法，高置信度替换并不总能安全等价。

## Testing Strategy

必须同时覆盖 6 层：

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
   - `docs/2026-04-22-spacing-border-spacing-space-source-rewrite-log.md`
   - `docs/2026-04-22-spacing-border-spacing-space-source-rewrite-status.md`
6. overall entry
   - `docs/2026-04-22-tailwind3-source-rewrite-index.md`
   - `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
   - `test/preset-tailwind3-document-governance.test.ts`

## Risks

1. `space-x/y` 不是普通 declaration，而是带子选择器的 CSS 输出，本轮语义断言必须直接锁住生成的 selector 和 reverse 变量，不能只看 `matched` 集合。
2. 当前 `src/_rules-wind3/spacing.ts` 含有 `space-inline/block` 扩展，如果直接接入会把非 Tailwind 3 语义带进 preset，因此必须先裁掉再挂到 `src/rules.ts`。
3. `spacing` 完成后，整体总表与状态文档需要从 `in_progress` 切到 `completed`，并把下一步统一推进到 `behavior`。
