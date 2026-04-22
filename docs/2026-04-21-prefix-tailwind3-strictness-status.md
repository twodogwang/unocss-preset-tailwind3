# `prefix` 严格语法治理状态

状态日期：2026-04-21  
分支：`codex/prefix-tailwind3-strictness`

## 任务目标

本轮任务的目标不是单纯补 `prefix` 用例，而是确保：

- 当预设配置了 `prefix`，项目仍然只接受 Tailwind 3 的正式写法
- 非 Tailwind 3 写法不会因为 `prefix` 绕过约束
- `prefix` 不会污染后续无 `prefix` 的预设实例

## 根因总结

### 1. 语法约束分成了两层

原先一部分规则的“严格 Tailwind 3 写法”不是由规则本身决定，而是：

- 宽松规则先匹配
- `blocklist` 再额外拦截非法写法

这会导致：

- 无 `prefix` 时：`blocklist` 看得到原始类名，能拦住
- 有 `prefix` 时：Uno 动态规则会先去掉 `prefix` 再匹配，但 `blocklist` 仍看原始类名

结果就是一部分非法写法在 `prefix` 下重新被放行。

### 2. 预设实例之间存在共享状态污染

Uno 在解析带 `prefix` 的预设时，会把 `meta.prefix` 写回规则或快捷方式元组。

本仓库原先直接复用了模块级共享的 `rules` 和 `shortcuts`，所以：

- 先创建一个 `prefix: 'tw-'` 的预设
- 后面再创建无 `prefix` 的预设

后者也会被污染，表现为无 `prefix` 实例无法正常匹配普通类名。

## 已完成内容

### 第一批：收紧高风险长度类规则

已从“靠 `blocklist` 兜底”改成“规则和辅助函数正向限制”：

- `size`
- `gap`
- `inset`
- `translate`

处理结果：

- 允许：`tw-w-[10px]`、`tw-gap-[3px]`、`tw-inset-[5px]`、`tw-translate-x-[12px]`
- 拒绝：`tw-w-100px`、`tw-h-2rem`、`tw-gap-3px`、`tw-inset-5px`、`tw-translate-x-12px`

相关文件：

- [src/_utils/utilities.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_utils/utilities.ts)
- [src/_rules/size.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/size.ts)
- [src/_rules/gap.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/gap.ts)
- [src/_rules/position.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/position.ts)
- [src/_rules/transform.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/transform.ts)

### 第二批：去掉会在 `prefix` 下漏放的旧匹配入口

已直接从匹配层移除或收紧这类旧写法入口：

- `fw-*`、`fontbold`
- `pos-*`
- `of-*`
- `z10`
- `flex-inline`
- `flex-basis-*`
- `auto-flow-*`
- `rows-*`、`cols-*`
- `filter-*`
- `drop-shadow-color-*`
- `transform-*`
- `perspective-*`
- `preserve-*`
- `keyframes-*`
- `animate-duration-*`、`animate-delay-*`、`animate-ease-*` 等扩展
- `bg-gradient-from-*`、`bg-gradient-via-*`、`bg-gradient-shape-*`
- `shape-*`

保留的正式写法例如：

- `tw-font-bold`
- `tw-absolute`
- `tw-overflow-hidden`
- `tw-z-10`
- `tw-inline-flex`
- `tw-grid-flow-row`
- `tw-grid-rows-2`
- `tw-grid-cols-2`
- `tw-blur-sm`
- `tw-origin-top-right`
- `tw-animate-spin`
- `tw-bg-gradient-to-r`
- `tw-from-red-500`

### 第三批：补掉剩余缩写漏口

本轮继续收紧：

- `op50`，只允许 `opacity-50`
- `dividex`、`dividey2`、`divide-op50`，只允许 `divide-x`、`divide-y-2`、`divide-opacity-50`

相关文件：

- [src/_rules/color.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules/color.ts)
- [src/_rules-wind3/divide.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_rules-wind3/divide.ts)

### 负值 `prefix` 写法修复

修复了合法 Tailwind 3 带 `prefix` 负值写法的匹配问题：

- `tw--mt-4`
- `sm:tw--mt-4`
- `tw--translate-y-1`
- `tw--rotate-45`

相关文件：

- [src/_variants/negative.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/_variants/negative.ts)
- [src/variants.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/variants.ts)

### 预设实例污染修复

已在预设工厂中为 `rules` 和 `shortcuts` 返回独立副本，避免 `meta.prefix` 写回共享元组后污染其他实例。

相关文件：

- [src/index.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/index.ts)

### 感知 `prefix` 的迁移提示修复

已为迁移规则这一层补上感知 `prefix` 的 `blocklist` 生成逻辑。

现在这类带 `prefix` 的旧写法会继续返回迁移提示，而不是单纯“不匹配也不提示”：

- `tw-b-2` -> `tw-border-2`
- `tw-rd-md` -> `tw-rounded-md`
- `tw-bg-op50` -> `tw-bg-opacity-50`
- `tw-transition-ease-linear` -> `tw-ease-linear`
- `tw-color-#fff` -> `tw-[color:#fff]`

相关文件：

- [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts)
- [src/index.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/index.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)

### 迁移提示收紧与中文化入口

已把两类过宽提示收紧为“只保留高置信度映射”：

- `pos-*` 只对 `relative | absolute | fixed | sticky | static` 保留提示
- `property-*` / `transition-property-*` 只对 `none | all | colors | opacity | shadow | transform` 保留提示

例如：

- `pos-absolute` 仍会提示 `absolute`
- `pos-inherit` 不再给误导性提示
- `property-opacity` 仍会提示 `transition-opacity`
- `property-height` 不再给误导性提示

另外，`blocklist` 提示现在支持通过 `locale` 切换语言，当前内置：

- `zh-CN`
- `en`

配置入口：

- [src/index.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/index.ts) 中的 `locale`

相关文件：

- [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts)
- [src/index.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/index.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)

### 感知 `prefix` 的 `rawBlocklist` 修复

已为“纯拒绝型、无迁移提示的 `rawBlocklist` 正则”补上感知 `prefix` 的克隆逻辑。

这意味着这类写法现在不只是“不生成 CSS”，还会被 `uno.getBlocked(...)` 明确标记为已拦截，例如：

- `tw-w4`
- `tw-p4`
- `tw-keyframes-spin`
- `tw-bg-gradient-linear`
- `tw-fontbold`
- `tw-w-100px`
- `tw-gap-3px`

相关文件：

- [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts)
- [test/preset-tailwind3-blocklist-messages.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-messages.test.ts)

### `blocklist` 的 `prefix` 穷举审计完成

已按条目级用例方式完成 [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts) 的 `prefix` 审计。

审计结果：

- `migrationDescriptors` 19 条规则全部覆盖
- `rawBlocklist` 44 条规则全部覆盖
- 用例集合与基础 `blocklist` 规则集合做了精确对齐断言
- 全部迁移类用例都验证了无 `prefix` / `prefix: 'tw-'` 下的 `zh-CN` 提示
- 补了代表性的 `en` 样例，确认语言切换入口可用
- 审计完成后，未发现新的 `prefix` 漏项或误伤

新增测试文件：

- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)

## 测试与验证

已新增或扩展以下测试：

- [test/preset-tailwind3-prefix.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-prefix.test.ts)
  - `prefix` 严格语法回归
  - 带 `prefix` 的负值写法回归
  - 旧别名与扩展写法拒绝回归
  - `prefix` 实例隔离回归
- [test/preset-tailwind3-tailwind-diff.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-tailwind-diff.test.ts)
  - 与 Tailwind 3 `prefix: 'tw-'` 的高风险行为对照
- [test/preset-tailwind3.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3.test.ts)
  - 同步更新自动补全断言
- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)
  - `blocklist.ts` 19 个迁移条目和 44 个原始条目的条目级 `prefix` 审计

最近一次验证结果：

- `pnpm test` 通过
- `pnpm run typecheck:tsc` 通过

## `blocklist` 审计后的分类

### 1. 建议长期保留的迁移提示型条目

这类条目满足“旧写法 -> 新写法”一对一、确定、不易误导，继续保留在 `blocklist` 里价值较高：

- 十六进制颜色旧写法：
  `color-*`、`c-*`、`text|bg|fill|stroke|accent|caret-*`
- 常见缩写别名：
  `b-*`、`rd-*`、`fw-*`
- 高置信度属性前缀：
  `op*`、`bg-op*`、`border-op*`、`ring-op*`
- `ring` / `border` / `outline` 的旧前缀：
  `ring-width|size-*`、`border-color-*`、`outline-color|width|style-*`
- 已收紧后的 `transition` 旧别名：
  `property|transition-property-(none|all|colors|opacity|shadow|transform)`
  `transition-delay-*`
  `transition-ease-*`

### 2. 建议继续保留为显式拒绝层的条目

这类条目不是迁移提示主入口，而是防止旧扩展写法、紧凑写法或裸值写法在语法之外静默漏过：

- 紧凑缩写：
  `w4`、`p4`、`gapx2`、`dividex`、`scrollm4`
- 已移除的扩展写法：
  `keyframes-*`、`animate-*` 扩展、`bg-gradient-*` 扩展、`shape-*`
- 已移除的别名入口：
  `fontbold`、`of-*`、`z10`、`flex-inline`、`auto-flow-*`、`rows|cols-*`
- 已移除的 `filter` / `transform` 扩展：
  `filter-*`、`drop-shadow-color-*`、`transform-*`、`perspective-*`、`preserve-*`
- 原始裸值拦截：
  `w-100px`、`p-2rem`、`gap-3px`、`inset-5px`、`translate-x-12px`、`scroll-m-2rem`

### 3. 刻意不再给迁移提示的例外

这类条目已被收紧，不再为了“有提示”而保留可能误导的映射：

- `pos-inherit`
- `property-height`
- `transition-property-height`

## 当前明确未处理项

### 1. `blocklist` 仍然承担一部分迁移提示职责

当前架构已经把最危险的“语法严格性”前移到规则和辅助函数层，但 `blocklist` 仍然保留为迁移提示层。

这本身是有意保留，不是缺陷；但如果未来要继续收敛架构，仍然可以做两件事：

- 继续评估哪些迁移提示应永久保留在 `blocklist`
- 决定哪些迁移提示未来可以转移到 ESLint 或编辑器层

### 2. 国际化目前只支持内置语言切换

当前已经支持通过 `locale` 切换中英文文案，但还没有开放更细粒度的自定义提示格式接口。

这不是当前缺陷，但如果以后要支持：

- 更多语言
- 项目方自定义文案模板
- 与外部国际化系统对接

那还需要再抽一层提示格式接口。

补充：

- 当前对外正式选项为 `locale`
- `blocklistLocale` 仅作为兼容回退保留

## 当前结论

从“`prefix` 会导致非法写法漏放”的主问题来看，这一轮已经完成了关键治理：

- 高风险严格性漏口已收紧
- `prefix` 负值写法已修复
- `prefix` 污染其他预设实例的问题已修复
- 新增了 `prefix` 专项回归和 Tailwind 3 `prefix` 对照测试
- `blocklist` 的 19 个迁移条目和 44 个原始条目已完成 `prefix` 穷举审计
