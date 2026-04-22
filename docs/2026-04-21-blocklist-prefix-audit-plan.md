# Blocklist Prefix 穷举审计方案

状态日期：2026-04-21
适用分支：`codex/prefix-tailwind3-strictness`
当前状态：已完成

## 审计结果

本方案已落地为以下测试与状态同步：

- 审计测试文件：
  [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)
- 状态汇总：
  [docs/2026-04-21-prefix-tailwind3-strictness-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-prefix-tailwind3-strictness-status.md)

当前结果：

- `migrationDescriptors` 19 条规则已全部纳入 fixture 审计
- `rawBlocklist` 44 条规则已全部纳入 fixture 审计
- fixture 集合与 base blocklist 规则集合做了精确对齐断言
- `zh-CN` 下全部 migration fixture 都验证了无 prefix / 有 prefix 的 message
- `en` 下补了代表性样例验证国际化入口
- 审计完成后，未发现新的 prefix blocklist 漏项

## 目标

对 [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts) 中的全部条目做一轮**条目级 prefix 审计**，确认在 `prefix: 'tw-'` 场景下：

- 本应被 `blocklist` 拦截的旧写法，仍然会被拦截
- 有迁移提示的条目，prefix 版本仍然能给出正确提示
- 纯拒绝型条目，prefix 版本也会被 `uno.getBlocked(...)` 明确标记
- 不会出现“无 prefix 正常、加 prefix 后静默漏掉”的情况

## 非目标

这轮审计**不**负责：

- 重新设计全部 `blocklist` 规则
- 再次大规模重构 rule / helper
- 解决所有 Tailwind parity 问题
- 做真正的无限语义穷举

这轮的“穷举”定义是：

**对 `blocklist.ts` 的每一个规则条目，都至少给出一个有代表性的 prefix 样例，并在测试里明确断言。**

## 审计对象分类

当前 [src/blocklist.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/src/blocklist.ts) 可以分成两大类。

### 1. migrationDescriptors

特点：

- 命中后除了 blocked，还要给出 message
- prefix 下 message 还要保留前缀并输出正确替换建议

代表条目：

- `b-*`
- `rd-*`
- `fw-*`
- `pos-*`
- `op50`
- `bg-op50`
- `border-op50`
- `ring-width-*`
- `outline-color-*`
- `transition-delay-*`
- `transition-ease-*`

### 2. rawBlocklist

特点：

- 命中后只要求 blocked
- 不要求 message
- prefix 下不能静默漏掉

代表条目：

- `w4`
- `p4`
- `gapx2`
- `dividex`
- `keyframes-spin`
- `animate-duration-500`
- `bg-gradient-linear`
- `fontbold`
- `of-hidden`
- `z10`
- `filter-blur-sm`
- `transform-rotate-45`
- `w-100px`
- `gap-3px`
- `inset-5px`
- `translate-x-12px`

## 审计矩阵

每个审计样例都跑同一组断言。

### A. migrationDescriptors 样例

对每个 migration 样例，至少断言：

1. 无 prefix：
   - `uno.getBlocked(input)` 为真
   - `generate()` 不产出 CSS
   - message 等于预期替换建议

2. 有 prefix：
   - `uno.getBlocked(prefixedInput)` 为真
   - `generate()` 不产出 CSS
   - message 等于带 prefix 的预期替换建议

3. 可选补充：
   - `locale: 'en'` 下 message 正确
   - `locale` 优先于兼容选项 `blocklistLocale`

### B. rawBlocklist 样例

对每个 raw 样例，至少断言：

1. 无 prefix：
   - `uno.getBlocked(input)` 为真
   - `generate()` 不产出 CSS

2. 有 prefix：
   - `uno.getBlocked(prefixedInput)` 为真
   - `generate()` 不产出 CSS

### C. 高置信度“不要误伤”对照样例

为了避免 blocklist 审计把合法写法也误判，需要保留一小组对照样例：

- `border-2`
- `rounded-md`
- `absolute`
- `opacity-50`
- `bg-opacity-50`
- `delay-75`
- `ease-linear`
- `w-4`
- `p-4`
- `divide-x`
- `animate-spin`
- `bg-gradient-to-r`

对照断言：

- `getBlocked(...)` 为假
- 是否能匹配交给现有语法/ parity 测试负责

## 样例组织方案

推荐新增一个独立测试文件，例如：

- [test/preset-tailwind3-blocklist-prefix-audit.test.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/preset-tailwind3-blocklist-prefix-audit.test.ts)

文件中维护 3 组 fixture：

### 1. migrationFixtures

建议结构：

```ts
type MigrationFixture = {
  label: string
  input: string
  prefixed: string
  zh: string
  en?: string
}
```

例子：

```ts
{
  label: 'border alias',
  input: 'b-2',
  prefixed: 'tw-b-2',
  zh: '旧写法 "b-2" 已禁用，请改为 "border-2"',
  en: 'Legacy class "b-2" is disabled. Use "border-2" instead.',
}
```

### 2. rawFixtures

建议结构：

```ts
type RawFixture = {
  label: string
  input: string
  prefixed: string
}
```

### 3. allowFixtures

建议结构：

```ts
type AllowFixture = {
  label: string
  input: string
  prefixed?: string
}
```

## 样例选择原则

因为 regex 不是有限集合，所以不能做数学意义上的无限穷举，这里采用**条目级代表样例穷举**。

规则如下：

1. 每个 `migrationDescriptor` 至少 1 个样例
2. 每个 `rawBlocklist` 条目至少 1 个样例
3. 对“语义面较宽”的条目补 2 个样例

需要补 2 个样例的典型条目：

- 十六进制颜色类
- `border((?:-[a-z]{1,2})?)-color-*`
- `outline-*`
- `transition-delay-*`
- `transition-ease-*`
- `animate-*`
- `bg-gradient-*`
- arbitrary value 类正则

## 执行顺序

建议按下面顺序推进，避免一次性改太多：

### 第一步：把 fixture 表建出来

先把全部条目盘点成 fixture 表，但只写 fixture，不改实现。

完成标准：

- `migrationDescriptors` 全覆盖
- `rawBlocklist` 全覆盖
- 对照样例齐全

### 第二步：先跑 red

新增测试文件，先跑失败，确认当前还未覆盖的空洞具体在哪些条目。

目标：

- 找出 prefix 下仍未 blocked 的条目
- 找出 prefix 下 message 不正确的条目
- 找出被误伤的合法写法

### 第三步：按类别修复

修复顺序建议：

1. migration rule 类
2. rawBlocklist prefix clone 类
3. locale / message 格式类
4. 误伤类

### 第四步：补文档

把审计结果同步回：

- [docs/2026-04-21-prefix-tailwind3-strictness-status.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-21-prefix-tailwind3-strictness-status.md)

记录：

- 已完全覆盖的类别
- 仍有意保留的例外
- 不打算继续处理的边界

## 完成标准

这轮审计完成，至少满足：

1. `blocklist.ts` 中每一个规则条目，都能在测试文件中找到对应 fixture
2. 所有 fixture 在无 prefix / 有 prefix 下都有明确断言
3. migration fixture 在 `zh-CN` 下都能给出正确提示
4. 至少有一组 `en` 样例验证国际化入口可用
5. `pnpm test` 通过
6. `pnpm run typecheck:tsc` 通过

## 风险与注意事项

### 1. 不要把“生成不了 CSS”和“被 blocklist 明确拦截”混为一谈

这轮审计的目标之一，就是把“静默失败”收敛成“显式 blocked”。

### 2. 不要为了覆盖率而重新放宽迁移提示

像 `pos-inherit`、`property-height` 这类，当前不提示是刻意收紧后的结果，不应为了“多覆盖几条”再放开。

### 3. 不要让 fixture 直接依赖实现细节顺序

测试应该依赖：

- 是否 blocked
- message 是否正确

不应该依赖 `blocklist` 数组的具体顺序或内部下标。

## 建议输出

这轮完成后，建议产出 3 个结果：

1. 一份完整的 `blocklist` prefix 审计测试文件
2. 一份“哪些条目永久保留、哪些只是兼容过渡”的分类清单
3. 一份简短结论，说明是否仍存在 prefix 下的 blocklist 漏项
