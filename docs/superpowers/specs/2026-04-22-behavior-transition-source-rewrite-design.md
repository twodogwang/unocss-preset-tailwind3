# Behavior Transition Source Rewrite Design

## Goal

把 `behavior` 的最后一轮源头重写收敛为 `transition` 主规则族治理：保持当前与 Tailwind CSS 3 已对齐的运行时语义，同时把 `transition / duration / delay / ease` 从现有的混合测试段里独立出来，补齐 shared fixture、utility spec、blocklist migration 子集与过程文档。

## Scope

本次设计只覆盖 `behavior` 的 `transition` 主规则族。

包含：

- `transition`
- `transition-*`
- `duration-*`
- `delay-*`
- `ease-*`
- 本子阶段相关 utility spec
- 本子阶段相关 blocklist migration message
- 本子阶段的过程日志与任务进度

不包含：

- `outline`
- `appearance-*`
- `will-change-*`
- `scroll-smooth`
- `overscroll-*`
- `touch-*`

## Current Repo Reality

当前运行时入口在：

- [src/_rules/transition.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/transition.ts)
- [src/_theme/transition.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_theme/transition.ts)

当前 repo 已经具备以下 Tailwind 3 正式能力：

- `transition`
- `transition-all`
- `transition-colors`
- `transition-opacity`
- `transition-shadow`
- `transition-transform`
- `transition-none`
- `transition-[height]`
- `transition-[height,opacity]`
- `duration-200`
- `delay-75`
- `ease-linear`
- `ease-in`
- `ease-out`
- `ease-in-out`
- `ease-[cubic-bezier(0.4,0,0.2,1)]`

当前 repo 也已经拒绝以下非 Tailwind 3 写法：

- `property-opacity`
- `transition-property-opacity`
- `transition-200`
- `transition-all-200`
- `transition-delay-75`
- `transition-ease-linear`
- `transition-discrete`
- `transition-normal`

blocklist 中已经存在过渡类的迁移提示规则，但它们仍然和其他 utility 混在总表里，没有 transition 专用的共享子集，也没有 utility spec 条目。

所以这轮的关键不在“修一处明显错误的 matcher”，而在把最后剩余的 `behavior` 债务正式纳入治理模板，并让总任务在完成后收口。

## Design Decision

本轮采用“正式纳管、尽量不动 runtime”的方案：

1. 保持 `src/_rules/transition.ts` 当前运行时逻辑不变，除非测试暴露真实偏差
2. 新增 `transition` 共享 fixture，拆出 `canonical / invalid / semantic`
3. 将 `transition` 从当前 `outline / transition` 混合测试中独立出来
4. runtime / Tailwind parity / utility spec / blocklist migration 四层同时锁边界
5. 本轮完成后，`behavior` 在整体总表里切到 `completed`，源头重写主线全部收口

## Runtime Semantics

合法写法：

- `transition`
- `transition-all`
- `transition-colors`
- `transition-opacity`
- `transition-shadow`
- `transition-transform`
- `transition-none`
- `transition-[height]`
- `transition-[height,opacity]`
- `duration-200`
- `delay-75`
- `ease-linear`
- `ease-in`
- `ease-out`
- `ease-in-out`
- `ease-[cubic-bezier(0.4,0,0.2,1)]`

非法写法：

- `property-opacity`
- `transition-property-opacity`
- `transition-200`
- `transition-all-200`
- `transition-delay-75`
- `transition-ease-linear`
- `transition-discrete`
- `transition-normal`

语义断言至少锁住：

- `transition -> transition-property / transition-timing-function / transition-duration`
- `transition-all -> transition-property:all`
- `transition-[height,opacity] -> transition-property:height,opacity`
- `duration-200 -> transition-duration:200ms`
- `delay-75 -> transition-delay:75ms`
- `ease-linear -> transition-timing-function:linear`

## Shared Fixture Shape

`test/fixtures/tailwind-transition-rewrite.ts` 至少包含：

```ts
export const transitionFixtures = {
  canonical: [
    'transition',
    'transition-all',
    'transition-colors',
    'transition-opacity',
    'transition-shadow',
    'transition-transform',
    'transition-none',
    'transition-[height]',
    'transition-[height,opacity]',
    'duration-200',
    'delay-75',
    'ease-linear',
    'ease-in',
    'ease-out',
    'ease-in-out',
    'ease-[cubic-bezier(0.4,0,0.2,1)]',
  ],
  invalid: [
    'property-opacity',
    'transition-property-opacity',
    'transition-200',
    'transition-all-200',
    'transition-delay-75',
    'transition-ease-linear',
    'transition-discrete',
    'transition-normal',
  ],
  semantic: [
    'transition',
    'transition-all',
    'transition-[height,opacity]',
    'duration-200',
    'delay-75',
    'ease-linear',
  ],
} as const
```

## Blocklist Migration Scope

高置信度迁移提示应覆盖：

- `property-opacity -> transition-opacity`
- `transition-property-opacity -> transition-opacity`
- `transition-delay-75 -> delay-75`
- `transition-ease-linear -> ease-linear`

不提供迁移提示，只做反向拒绝：

- `transition-200`
- `transition-all-200`
- `transition-discrete`
- `transition-normal`

原因：这些写法并没有一条稳定、无歧义、可自动推荐的 Tailwind 3 单点替代。

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
   - `docs/2026-04-22-behavior-transition-source-rewrite-log.md`
   - `docs/2026-04-22-behavior-transition-source-rewrite-status.md`
6. overall entry
   - `docs/2026-04-22-tailwind3-source-rewrite-index.md`
   - `docs/2026-04-21-tailwind-grammar-debt-task-status.md`
   - `test/preset-tailwind3-document-governance.test.ts`

## Risks

1. 现有测试把 `outline` 和 `transition` 放在同一个 describe 里，本轮必须拆出独立入口，避免以后继续把两类 debt 混在一起。
2. `transition-[height,opacity]` 这类 arbitrary property 的输出需要锁住原样属性串，不能只断言“包含 transition-property”。
3. 本轮完成后总表将没有 `pending` utility，文档治理测试需要相应更新，不能继续假设还有未完成行处于 `pending`。
