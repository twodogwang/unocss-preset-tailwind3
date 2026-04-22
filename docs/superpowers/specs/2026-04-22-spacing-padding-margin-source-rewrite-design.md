# Spacing Padding Margin Source Rewrite Design

## Goal

把 `spacing` 的第一子阶段收敛到 Tailwind CSS 3 正式语法，当前只治理 `padding` / `margin` 主规则族；运行时保持 Tailwind 3 已对齐语义，同时把高置信度旧写法纳入 blocklist migration 与治理文档。

## Scope

本次设计只覆盖 `spacing` 的 `padding` / `margin` 子阶段，不扩展到其他 spacing 相关规则。

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

当前 `padding` / `margin` 运行时入口位于 [src/_rules/spacing.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/spacing.ts)，核心解析逻辑在 [src/_utils/utilities.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_utils/utilities.ts) 的 `directionThemeSize()` / `resolveTailwindSpacing()`。

当前 repo 与 Tailwind 3 的已知现实是：

- 当前 repo 和 Tailwind 3 都支持：
  - `p-4`
  - `px-2`
  - `ps-4`
  - `m-auto`
  - `-mx-2`
  - `p-[5px]`
  - `mx-[var(--gap)]`
- 当前 repo 和 Tailwind 3 都不支持：
  - `p4`
  - `px2`
  - `pt1`
  - `m4`
  - `mx2`
  - `-mt1`
  - `p-x-4`
  - `-m-y-2`
  - `p-s-4`
  - `m-e-4`
  - `p-5px`
  - `m-2rem`
  - `mx-var(--gap)`

也就是说，这一轮的重点不是修一个明显错误的 runtime matcher，而是把一段已经基本正确的规则正式纳入“共享 fixture + utility spec + blocklist migration + 过程文档”的源头重写模板。

## Design Decision

本轮沿用 `tracking` / `stroke` 的治理模板，但不强行改动已对齐的运行时逻辑：

1. 保持 `src/_rules/spacing.ts` 当前运行时语义不变，除非测试暴露真实偏差
2. 新增 `padding / margin` 共享 fixture，拆出 `canonical / invalid / semantic`
3. runtime / Tailwind parity / utility spec / blocklist migration 四层同时锁边界
4. `spacing` 在整体总表里标为 `in_progress`，当前文档只记录 `padding / margin` 子阶段

## Runtime Semantics

合法写法：

- `p-4`
- `px-2`
- `py-8`
- `pt-1`
- `pr-px`
- `ps-4`
- `pe-6`
- `m-4`
- `mx-auto`
- `-mx-2`
- `m-[2rem]`
- `mx-[var(--gap)]`

非法写法：

- `p4`
- `px2`
- `pt1`
- `m4`
- `mx2`
- `-mt1`
- `p-x-4`
- `-m-y-2`
- `p-s-4`
- `m-e-4`
- `p-5px`
- `m-2rem`
- `mx-var(--gap)`

语义断言至少锁住：

- `p-4 -> padding:1rem`
- `ps-4 -> padding-inline-start:1rem`
- `m-auto -> margin:auto`
- `-mx-2 -> margin-left:-0.5rem; margin-right:-0.5rem`
- `mx-[var(--gap)] -> margin-left:var(--gap); margin-right:var(--gap)`

## Shared Fixture Shape

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

## Blocklist Migration Scope

高置信度迁移提示应覆盖：

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

不纳入迁移提示：

- `p-1/2`
- `m-1/2`
- `p-auto`

这些写法没有足够高置信度的唯一替代写法，只保留为反向样例。

## Documentation And Tracking

需要新增并持续更新：

- `docs/2026-04-22-spacing-padding-margin-source-rewrite-log.md`
- `docs/2026-04-22-spacing-padding-margin-source-rewrite-status.md`

同时更新：

- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`

注意：`spacing` 在整体总表里的状态本轮应保持 `in_progress`，因为 `gap` / `inset` / `scroll-*` / `border-spacing` / `space-*` 还没处理。

## Risks

主要风险有两个：

1. `padding` / `margin` 已经基本和 Tailwind 3 对齐，本轮最容易出错的地方是 blocklist migration 规则写得过宽，误伤 canonical 写法。
2. `spacing` 是大类目，文档层必须明确这是“第一子阶段完成”，不能让总表误报成整个 spacing 完成。

## Success Criteria

完成后必须满足：

- `padding / margin` 的 shared fixture、runtime、parity、utility spec、blocklist migration 已全部落盘
- 高置信度旧写法已有明确迁移提示
- `src/_rules/spacing.ts` 语义仍与 Tailwind 3 保持一致
- `spacing` 在总表中进入 `in_progress`，且文档链接已指向当前子阶段
- 下一步待办明确落到 `gap / inset / scroll-*`
