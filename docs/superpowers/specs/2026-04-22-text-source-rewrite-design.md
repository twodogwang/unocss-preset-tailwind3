# Tailwind 3 Text Source Rewrite Design

状态日期：2026-04-22  
目标分支：`codex/tailwind3-source-rewrite`

## 目标

把 `text` 主规则族从当前“同一前缀下混合 size / color / opacity / 历史别名”的宽分发实现，收敛成以 Tailwind CSS 3 为唯一正确性标准的源头重写模板，并把这一轮实施过程中的日志与任务进度记录纳入版本控制。

本次设计只覆盖 `text` 主规则族，不扩展到 `leading`、`tracking`、`text-shadow`、`text-stroke`。

## Scope

包含：

- `text-<size>`
- `text-<size>/<line-height>`
- `text-<color>`
- `text-[...]`
- `text-[...]/[...]`
- `text-red-500/50` 这类颜色透明度正式写法
- `text-opacity-*`
- `text` 相关 utility spec
- `text` 相关 blocklist migration message
- 过程日志与任务进度记录

不包含：

- `leading-*`
- `tracking-*`
- `text-shadow-*`
- `text-stroke-*`
- `indent-*`

## 当前仓库现状

### 1. 运行时入口仍然是宽分发

当前 `text` 主规则族位于：

- `src/_rules/typography.ts`

主要入口是：

- `[/^text-(.+)$/, handleText, { autocomplete: 'text-$fontSize' }]`
- `[/^(?:text|font)-size-(.+)$/, handleSize, { autocomplete: 'text-size-$fontSize' }]`
- `[/^text-(.+)$/, handlerColorOrSize, { autocomplete: 'text-$colors' }]`
- `[/^text-opacity-(.+)$/, ...]`

这意味着同一个 `text-*` 前缀下，当前仍然用“先 size、再 color”的组合逻辑处理：

- 合法正式写法
- 历史别名
- 裸长度值

### 2. 当前已知真实差异

当前实现会错误接纳：

- `text-10px`
- `text-2rem`
- `text-size-sm`
- `font-size-sm`

这些都不应再作为 Tailwind 3 正式语法被 runtime 接纳。

### 3. 当前已知应保留的正式写法

当前仓库已有测试和实际行为都说明以下写法需要继续支持：

- `text-sm`
- `text-lg/7`
- `text-[14px]`
- `text-[14px]/[20px]`
- `text-white`
- `text-red-500/50`
- `text-[#fff]`
- `text-opacity-50`

### 4. 当前已知应拒绝或迁移的历史写法

当前测试已经把以下写法视为非法：

- `text-#fff`
- `text-red500`
- `text-color-red-500`

其中：

- `text-#fff -> text-[#fff]` 是高置信度迁移，可进入 blocklist fixture
- `text-size-sm -> text-sm` 是高置信度迁移，可进入 blocklist fixture
- `font-size-sm -> text-sm` 是高置信度迁移，可进入 blocklist fixture
- `text-10px -> text-[10px]`、`text-2rem -> text-[2rem]` 是高置信度迁移，可进入 blocklist fixture
- `text-red500` 是否要给迁移提示不在本轮必须范围内，可先作为非法 runtime / parity 样例
- `text-color-red-500 -> text-red-500` 语义明确，建议纳入 blocklist fixture

## 设计原则

### 1. `text-opacity-*` 保留为合法 Tailwind 3 语法

这轮不把 `text-opacity-*` 当作待清理历史别名。原因很简单：

- Tailwind 3 支持 `text-opacity-50`
- 当前仓库测试也已将其视为合法并与 Tailwind 3 对照

所以本轮目标不是移除它，而是确保它继续被正式支持，同时不与非法旧写法混淆。

### 2. `text-*` 的 runtime 语义必须显式化

当前 `text-*` 的问题不是“完全不能用”，而是边界太宽。重写后需要显式收敛成：

- size：主题键 + bracket arbitrary
- color：Tailwind 3 正式颜色写法 + alpha slash
- opacity：`text-opacity-*`

不再继续让裸长度值和旧别名通过宽回退被误接纳。

### 3. `blocklist` 只处理高置信度迁移

本轮 blocklist 只保留这些明确、可自动建议的迁移：

- `text-#fff -> text-[#fff]`
- `text-size-sm -> text-sm`
- `font-size-sm -> text-sm`
- `text-10px -> text-[10px]`
- `text-2rem -> text-[2rem]`
- `text-color-red-500 -> text-red-500`

像 `text-red500` 这类“疑似少了连字符”的写法，不在本轮强行给迁移提示。

## 目标结构

### 1. 共享 fixture

新增：

- `test/fixtures/tailwind-text-rewrite.ts`

至少拆成：

- `canonical`
- `invalid`
- `semantic`

职责边界：

- `canonical`：
  供 runtime 支持断言与 Tailwind parity 共用，回答“这个类名是否应该成立”
- `invalid`：
  供 runtime 反向断言、Tailwind parity 反向断言和 utility spec 共用，回答“这个类名是否必须拒绝”
- `semantic`：
  只供 runtime CSS 声明级断言消费，回答“即使类名成立，它生成的关键 CSS 语义是否正确”

建议最小样例：

```ts
export const textFixtures = {
  canonical: [
    'text-sm',
    'text-lg/7',
    'text-[14px]',
    'text-[14px]/[20px]',
    'text-white',
    'text-red-500/50',
    'text-[#fff]',
    'text-opacity-50',
  ],
  invalid: [
    'text-10px',
    'text-2rem',
    'text-size-sm',
    'font-size-sm',
    'text-#fff',
    'text-red500',
    'text-color-red-500',
  ],
  semantic: [
    'text-sm',
    'text-lg/7',
    'text-[14px]',
    'text-[14px]/[20px]',
    'text-white',
    'text-opacity-50',
  ],
} as const
```

`semantic` 在 runtime 测试里至少应锁住这些声明：

- `text-sm` 对应正确的 `font-size`
- `text-lg/7` 对应正确的 `font-size` 和 `line-height`
- `text-[14px]` 对应正确的 `font-size:14px`
- `text-[14px]/[20px]` 对应正确的 `font-size:14px` 和 `line-height:20px`
- `text-white` 或主题色样例能产出正确的文本颜色声明
- `text-opacity-50` 能产出 `--un-text-opacity` 相关声明

### 2. runtime / parity

继续在：

- `test/preset-tailwind3.test.ts`
- `test/preset-tailwind3-tailwind-diff.test.ts`

中为 `text` 主规则族建立独立正反向约束，不把它继续埋在“text / svg / accent / caret”混合测试里。

### 3. utility spec

继续使用：

- `test/tailwind-utility-spec.ts`
- `test/preset-tailwind3-utility-spec.test.ts`

把 `text` 纳入当前规则族规范清单。

### 4. blocklist migration

继续使用：

- `test/fixtures/blocklist-migration.ts`
- `test/preset-tailwind3-blocklist-messages.test.ts`

将 `text` 的高置信度迁移样例纳入共享 fixture。

### 5. 过程文档

新增：

- `docs/2026-04-22-text-source-rewrite-log.md`
- `docs/2026-04-22-text-source-rewrite-status.md`

并在整体入口：

- `docs/2026-04-22-tailwind3-source-rewrite-index.md`

中同步把 `text` 从 `pending` 推进到执行中 / 已完成。

## 验收标准

本轮完成后，应满足：

- `text-10px`、`text-2rem` 不会被 runtime 接纳
- `text-size-sm`、`font-size-sm` 不会被 runtime 接纳
- `text-sm`、`text-[14px]`、`text-white`、`text-red-500/50`、`text-[#fff]`、`text-opacity-50` 继续正常工作
- `text-#fff`、`text-color-red-500`、`text-size-sm`、`font-size-sm` 等高置信度旧写法有共享 fixture 级迁移提示保护
- `text` 已登记到 utility spec
- `text` 的 process log / status 和整体总表同步更新并进入 git

## 非目标

本次不做：

- `leading` / `tracking` 的运行时重写
- `text-shadow` / `text-stroke` 的运行时重写
- 所有 typography 相关别名的一次性清算
