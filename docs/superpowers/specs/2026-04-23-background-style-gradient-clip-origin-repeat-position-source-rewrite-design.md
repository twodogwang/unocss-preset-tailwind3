# Background Style Gradient Clip Origin Repeat Position Source Rewrite Design

状态日期：2026-04-23  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `background-style / gradient / clip / origin / repeat / position` 从当前 `background` 混合测试段中拆出，纳入已经验证过的 source rewrite 模板：shared fixture、runtime、Tailwind parity、utility spec、blocklist subset、过程日志和任务状态都单独落盘。

本轮目标不是回头修改 `background-color / bg-opacity`，也不是把整个 `background` 所有 arbitrary 分支一起改掉，而是只完成：

- `bg-none`
- `bg-auto / bg-cover / bg-contain`
- `bg-fixed / bg-local / bg-scroll`
- `bg-clip-*`
- `bg-origin-*`
- `bg-repeat*`
- `bg-center` 等 background position 关键字
- `bg-gradient-to-*`
- `from-* / via-* / to-*`
- `from-10% / via-30% / to-90%`
- `bg-gradient-*` / `shape-*` 旧扩展的 blocklist strictness 子集
- 过程文档与总表同步

## 范围

包含：

- `bg-none`
- `bg-auto`
- `bg-cover`
- `bg-contain`
- `bg-fixed`
- `bg-local`
- `bg-scroll`
- `bg-clip-border`
- `bg-clip-content`
- `bg-clip-padding`
- `bg-clip-text`
- `bg-origin-border`
- `bg-origin-content`
- `bg-origin-padding`
- `bg-repeat`
- `bg-repeat-round`
- `bg-repeat-space`
- `bg-repeat-x`
- `bg-repeat-y`
- `bg-center`
- `bg-left-top`
- `bg-gradient-to-r`
- `from-blue-500`
- `via-cyan-500`
- `to-emerald-500`
- `from-10%`
- `via-30%`
- `to-90%`

不包含：

- `bg-red-500`
- `bg-red-500/50`
- `bg-[#fff]`
- `bg-opacity-*`
- `bg-brand`
- `bg-[url(...)]`
- `bg-[length:...]`
- `bg-[position:...]`
- `box-decoration-*`

这些分别留给已完成的 `background-color / bg-opacity` family 或后续是否单独治理的 background arbitrary / box-decoration 路径。

## 当前现状

当前实现位于 [src/_rules-wind3/background.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules-wind3/background.ts)：

- size / attachment / clip / origin / repeat / position / gradient 全都集中在一个 rules 文件里
- runtime 与 parity 当前仍主要依赖 `background` 混合测试段
- `bg-gradient-*` 与 `shape-*` 旧扩展已被 blocklist raw rules 拦截，但还没有 background-style 专用模板和专用共享 fixture

当前已知正式写法包括：

- `bg-none`
- `bg-cover`
- `bg-fixed`
- `bg-clip-text`
- `bg-origin-border`
- `bg-repeat-x`
- `bg-center`
- `bg-gradient-to-r`
- `from-blue-500`
- `from-10%`
- `via-cyan-500`
- `via-30%`
- `to-emerald-500`
- `to-90%`

当前已知必须拒绝的旧写法包括：

- `bg-gradient-linear`
- `bg-gradient-from-red-500`
- `bg-gradient-via-cyan-500`
- `bg-gradient-to-emerald-500`
- `bg-gradient-shape-r`
- `bg-gradient-stops-3`
- `bg-clip-inherit`
- `bg-clip-initial`
- `bg-origin-inherit`
- `bg-origin-initial`
- `bg-repeat-inherit`
- `bg-repeat-initial`
- `shape-r`

## 设计原则

### 1. 不回头混入 background-color

这一轮的 fixture、spec、log、status 都只服务 `background-style / gradient / clip / origin / repeat / position`，不把 `bg-red-500` 或 `bg-opacity-*` 再混回来。

### 2. 只有真实偏差才改 runtime

当前 `src/_rules-wind3/background.ts` 的主体实现已经基本对齐 Tailwind 3。  
本轮主工作仍然是模板化治理：把这组从混合测试里拆成共享 fixture、独立 runtime/parity、utility spec 和 blocklist strictness 子集。只有新测试打出真实偏差时，才修改运行时实现。

### 3. blocklist 以 strictness 子集为主，而不是强造迁移提示

这组 legacy 写法里，高置信度自动 replacement 很少，当前仓库也已经用 raw blocklist 方式收口。  
因此本轮不新增迁移 message 规则，而是把 `bg-gradient-*` / `shape-*` 的 strictness 子集明确落到 background-style 的共享 fixture 和 blocklist 测试里。

## 目标结构

### 1. shared fixture

新增：

- [test/fixtures/tailwind-background-style-rewrite.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/fixtures/tailwind-background-style-rewrite.ts)

至少包含：

- `canonical`
- `invalid`
- `semantic`
- `blocklisted`

### 2. runtime / parity

新增 background-style 专用测试入口：

- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)

要求：

- 正向样例直接消费 `backgroundStyleFixtures.canonical`
- 反向样例直接消费 `backgroundStyleFixtures.invalid`
- 语义样例要直接断言 `background-image`、`background-repeat`、`background-origin`、`background-position`、gradient 变量等关键 CSS 输出

### 3. utility spec

在以下文件登记 `background-style` family：

- [test/tailwind-utility-spec.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-utility-spec.ts)
- [test/preset-tailwind3-utility-spec.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-utility-spec.test.ts)

建议 id 使用 `background-style`，notes 明确覆盖 gradient / clip / origin / repeat / position。

### 4. blocklist subset

本轮不新增 migration replacement，而是新增 dedicated strictness subset 断言，覆盖：

- `bg-gradient-linear`
- `bg-gradient-from-red-500`
- `bg-gradient-via-cyan-500`
- `bg-gradient-to-emerald-500`
- `bg-gradient-shape-r`
- `bg-gradient-stops-3`
- `shape-r`

测试文件仍使用：

- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)

但断言方式是 `expectBlocked`，不强行要求 replacement message。

## 文档与总表

需要新增并持续更新：

- [docs/2026-04-23-background-style-gradient-clip-origin-repeat-position-source-rewrite-log.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-background-style-gradient-clip-origin-repeat-position-source-rewrite-log.md)
- [docs/2026-04-23-background-style-gradient-clip-origin-repeat-position-source-rewrite-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-23-background-style-gradient-clip-origin-repeat-position-source-rewrite-status.md)

同时同步：

- [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)
- [docs/2026-04-22-tailwind3-full-rule-family-inventory.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-full-rule-family-inventory.md)
- [docs/2026-04-21-tailwind-grammar-debt-task-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-tailwind-grammar-debt-task-status.md)

## 风险与边界

- `src/_rules-wind3/background.ts` 里还有 `box-decoration-*` 和 bracket gradient helper，这一轮不要顺手扩 scope
- `bg-([-\w]{3,})` 的 position matcher 很宽，实施时必须靠 canonical / invalid fixtures 明确锁边界
- 这组如果不把 strictness-only blocklist 单独落盘，后续仍会退回到“只有混合测试知道它存在”的状态
