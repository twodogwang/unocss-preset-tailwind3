# Spacing Gap Inset Scroll Source Rewrite Design

## Goal

把 `spacing` 的第二子阶段收敛到 Tailwind CSS 3 正式语法，当前只治理 `gap` / `inset` / `scroll-m*` / `scroll-p*` 主规则族；运行时保持 Tailwind 3 已对齐语义，同时把高置信度旧写法纳入 blocklist migration 与治理文档。

## Scope

本次设计只覆盖 `spacing` 的 `gap / inset / scroll-*` 子阶段，不扩展到其他 spacing 相关规则。

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

当前运行时入口分散在三个文件：

- [src/_rules/gap.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/gap.ts)
- [src/_rules/position.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/position.ts)
- [src/_rules-wind3/scrolls.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules-wind3/scrolls.ts)

当前 repo 与 Tailwind 3 的已知现实是：

- 当前 repo 和 Tailwind 3 都支持：
  - `gap-[3px]`
  - `inset-[5px]`
  - `scroll-m-[2rem]`
  - `scroll-px-[var(--gap)]`
  - `gap-x-2`
  - `start-4`
  - `end-6`
- 当前 repo 和 Tailwind 3 都不支持：
  - `gap4`
  - `gap-3px`
  - `gap-x2`
  - `gap-row-4`
  - `gap-col-4`
  - `inset-inline-4`
  - `inset-bs-4`
  - `inset-r-4`
  - `inset-s-4`
  - `scroll-m4`
  - `scroll-p4`
  - `scroll-mx2`
  - `scroll-px2`
  - `scroll-m-auto`
  - `scroll-p-auto`
  - `scroll-ma-4`
  - `scroll-pa-4`
  - `scroll-m-s-4`
  - `scroll-p-e-4`

也就是说，这一轮和 `padding / margin` 一样，重点不是修一个明显错误的 runtime matcher，而是把一段已经基本正确的规则正式纳入“共享 fixture + utility spec + blocklist migration + 过程文档”的源头重写模板。

## Design Decision

本轮沿用 `padding / margin` 的治理模板，但不强行改动已对齐的运行时逻辑：

1. 保持 `src/_rules/gap.ts`、`src/_rules/position.ts`、`src/_rules-wind3/scrolls.ts` 当前运行时语义不变，除非测试暴露真实偏差
2. 新增 `gap / inset / scroll-*` 共享 fixture，拆出 `canonical / invalid / semantic`
3. runtime / Tailwind parity / utility spec / blocklist migration 四层同时锁边界
4. `spacing` 在整体总表里继续标为 `in_progress`，当前文档只记录第二子阶段

## Runtime Semantics

合法写法：

- `gap-4`
- `gap-x-2`
- `gap-y-8`
- `inset-0`
- `inset-x-4`
- `inset-y-2`
- `-inset-4`
- `start-4`
- `end-6`
- `top-1`
- `gap-[3px]`
- `inset-[5px]`
- `scroll-m-4`
- `scroll-mx-2`
- `scroll-ms-4`
- `scroll-p-4`
- `scroll-px-2`
- `scroll-pe-6`
- `scroll-m-[2rem]`
- `scroll-px-[var(--gap)]`

非法写法：

- `gap4`
- `gap-3px`
- `gapx-2`
- `gap-x2`
- `gap-row-4`
- `gap-col-4`
- `insetx-4`
- `insety2`
- `inset-inline-4`
- `inset-bs-4`
- `inset-r-4`
- `inset-s-4`
- `top1`
- `right2`
- `scrollm-4`
- `scroll-m4`
- `scrollmx-2`
- `scroll-mx2`
- `scrollpy8`
- `scroll-p4`
- `scroll-m-auto`
- `scroll-p-auto`
- `scroll-ma-4`
- `scroll-pa-4`
- `scroll-m-s-4`
- `scroll-p-e-4`
- `scroll-m-2rem`

语义断言至少锁住：

- `gap-4 -> gap:1rem`
- `gap-x-2 -> column-gap:0.5rem`
- `inset-[5px] -> inset:5px`
- `start-4 -> inset-inline-start:1rem`
- `scroll-mx-2 -> scroll-margin-left:0.5rem; scroll-margin-right:0.5rem`
- `scroll-px-[var(--gap)] -> scroll-padding-left:var(--gap); scroll-padding-right:var(--gap)`

## Shared Fixture Shape

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

## Blocklist Migration Scope

高置信度迁移提示应覆盖：

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

不纳入迁移提示：

- `inset-inline-4`
- `inset-bs-4`
- `scroll-m-auto`
- `scroll-p-auto`

这些写法没有足够高置信度的唯一 canonical 替代写法，保留为反向样例。

## Documentation And Tracking

需要新增并持续更新：

- `docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-log.md`
- `docs/2026-04-22-spacing-gap-inset-scroll-source-rewrite-status.md`

同时更新：

- `docs/2026-04-22-tailwind3-source-rewrite-index.md`
- `docs/2026-04-21-tailwind-grammar-debt-task-status.md`

注意：`spacing` 在整体总表里的状态本轮仍应保持 `in_progress`，因为 `border-spacing` / `space-*` 还没处理。

## Risks

主要风险有两个：

1. `gap` / `inset` / `scroll-*` 分散在三个运行时文件里，本轮不能顺手把 `translate-*`、`border-spacing-*` 或 `space-*` 一并混入。
2. 旧写法的 migration rule 很容易写得过宽，尤其 `inset-*` 和 `scroll-*` 有多种方向缩写，必须让 descriptor 只匹配高置信度旧入口。

## Success Criteria

完成后必须满足：

- `gap / inset / scroll-*` 的 shared fixture、runtime、parity、utility spec、blocklist migration 已全部落盘
- 高置信度旧写法已有明确迁移提示
- 当前运行时语义仍与 Tailwind 3 保持一致
- `spacing` 在总表中继续保持 `in_progress`
- 下一步明确落到 `border-spacing / space-*`
