# Tailwind 源头重写背景基线

状态日期：2026-04-22  
适用分支：`codex/tailwind3-source-rewrite`

> 这是一份背景文档，用来说明为什么需要做这条治理主线。  
> 当前实时状态入口请查看：
> [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)

## 背景

这个预设最初并不是从零按 Tailwind CSS 3 正式语法重写出来的，而是在更宽的 UnoCSS / `wind3` 匹配规则基础上逐步收紧。

这带来的长期问题是：

- 一部分官方 Tailwind 3 写法可以工作
- 但一些 Uno / Windi 风格别名、扩展前缀、裸单位值也会误命中
- 如果没有规则族级反向测试，这些偏差只会在后续维护中零散暴露

## 治理原则

当前主线采用的治理原则是：

1. Tailwind 3 是唯一正确性标准
2. `preset-wind3` 只保留为负向样本来源，不再作为实现基线
3. 合法语法由 matcher / value resolver 在源头定义
4. `blocklist` 只负责高置信度迁移提示
5. 每个 utility 都要有正向、反向和 Tailwind parity 约束

## 当前阶段

目前已经从“零散修补历史别名”推进到“按 utility 拆分源头重写任务”的阶段。

当前已完成：

- `border`
- `outline`

后续待推进：

- `text`
- `leading`
- `tracking`
- `stroke`
- `spacing`
- `behavior`

## 文档职责

这份文档只回答两件事：

- 为什么需要这条治理主线
- 当前治理主线采用什么原则

它不负责维护实时进度，也不负责维护 utility 级文档链接。  
这些信息统一由总入口文档维护：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
