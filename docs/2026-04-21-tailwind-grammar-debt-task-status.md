# Tailwind 源头重写整体状态

状态日期：2026-04-22  
当前分支：`codex/tailwind3-source-rewrite`

> 这份文档用于说明整体推进状态，不是唯一实时入口。  
> 当前实时状态入口请查看：
> [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)

## 当前任务目标

当前主线任务不是继续零散修补个别类名，而是把 Tailwind 3 源头重写推进成可持续维护的规则族治理流程：

- 每个 utility 以 Tailwind 3 正式语法为唯一标准
- 非 Tailwind 3 写法通过运行时拒绝或 blocklist 迁移提示收口
- utility 级文档与整体任务状态同步更新

## 当前源头重写状态

### 已完成 utility

- `border`
- `outline`
- `text`

### 待处理 utility

- `leading`
- `tracking`
- `stroke`
- `spacing`
- `behavior`

## 已完成的配套治理

- 总需求文档已进入 git
- `outline` 与 `text` 的 spec / plan / log / status 已进入 git
- `border` 当前已有的计划文档已进入 git
- 已建立整体任务总入口，用统一 manifest 表维护 utility 状态与文档链接

## 下一步

按当前总入口的顺序，下一步优先继续：

1. `leading`
2. `tracking`
3. `stroke`
4. `spacing`
5. `behavior`

## 文档职责

- 原始总需求文档：
  [internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/internal-docs/tailwind3-source-rewrite/2026-04-21-tailwind3-source-rewrite-plan.md)
- 当前唯一实时入口：
  [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- 背景基线文档：
  [docs/2026-04-21-tailwind-grammar-debt-baseline.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-baseline.md)
