# Tailwind 3 源头重写任务计划

> 这份文档保留为原始总需求文档。当前实时状态入口请查看：
> [docs/2026-04-22-tailwind3-source-rewrite-index.md](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/docs/2026-04-22-tailwind3-source-rewrite-index.md)

状态日期：2026-04-21  
工作分支：`codex/tailwind3-source-rewrite`

## 任务目标

本轮任务不再沿用原先从 UnoCSS `preset-wind3` 继承来的宽匹配规则，也不再继续在旧正则上做小修小补。

新的目标是：

- 每个 utility 都以 Tailwind 3 的正式写法为唯一目标重新实现
- `preset-wind3` 不再作为实现基础，只保留为负向样本来源
- 语法合法性由规则和辅助函数在源头定义
- `blocklist` 只承担迁移提示职责，不再承担主合法性定义

## 基本原则

### 1. Tailwind 3 是唯一正确性标准

以后每个 utility 的实现目标都是：

- Tailwind 3 支持的写法，当前预设必须支持
- Tailwind 3 不支持的写法，当前预设必须拒绝

### 2. `preset-wind3` 只提供反向样本

`preset-wind3` 的唯一用途是帮助发现这类写法：

- UnoCSS 官方 `preset-wind3` 支持
- Tailwind 3 不支持

这些写法可以作为历史遗留写法样本，辅助构造反向测试，但不能再影响当前预设的规则设计。

### 3. 不继续修补旧正则

原先从 `preset-wind3` 继承过来的宽正则、宽辅助函数、宽回退逻辑，都不再默认视为可复用资产。

重写时优先做的是：

- 按 Tailwind 3 写法重新定义 matcher
- 按 Tailwind 3 允许的值类型重新定义 value resolver
- 必要时重新设计 autocomplete

## 测试策略

重写方案下，测试必须同时保留正向和反向两套。

### 1. 正向测试

目标：

- 验证 Tailwind 3 的正式写法能正常工作

来源：

- Tailwind 3 官方写法
- 主题扩展写法
- 方括号任意值写法
- 必要时的 `prefix` / `negative` / `variant`

### 2. 反向测试

目标：

- 验证非 Tailwind 3 写法不会误生效

来源：

- 历史别名
- 紧凑缩写
- 旧属性前缀
- 裸单位值
- `preset-wind3` 支持但 Tailwind 3 不支持的写法

### 3. 对照测试

目标：

- 验证当前预设与 Tailwind 3 结果是否一致

执行方式：

- 同一组输入同时跑当前预设和 Tailwind 3
- 比较匹配集合是否一致

## 结构调整方向

### 1. 规则族清单保留为总表

文件：

- [test/tailwind-rule-family-inventory.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-rule-family-inventory.ts)

职责：

- 记录全仓有哪些规则族
- 标记哪些规则族已进入重写
- 标记哪些规则族已完成 Tailwind 对照

### 2. 语法债务清单将逐步升级为规则规范清单

当前文件：

- [test/tailwind-grammar-debt.ts](/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/test/tailwind-grammar-debt.ts)

后续目标：

- 不再只是“已发现问题清单”
- 逐步演进为“规则族规范定义”

理想结构至少包含：

- 规则族标识
- 源文件
- 正式写法集合
- 非法写法生成来源
- 是否支持 `prefix`
- 是否支持 `negative`
- 是否支持 `variant`

### 3. `preset-wind3` 对照仅作为辅助扫描

后续如需引入 `preset-wind3` 参与测试，其职责仅限于：

- 生成候选负向写法
- 标记潜在历史债务来源

它不能作为当前预设的实现基线。

## 实施顺序

### 第一阶段：建立重写模板

选一个规则族，完整示范一遍：

1. 写 Tailwind 3 规则族规范
2. 写正向测试
3. 写反向测试
4. 写 Tailwind 对照测试
5. 重写 matcher 和 value resolver
6. 保留必要的迁移提示

推荐先从这些规则族中选：

- `border`
- `rounded`

原因：

- 语法边界清晰
- 已经确认存在真实差异
- 适合建立第一套模板

### 第二阶段：推广到相邻规则族

优先顺序：

- `text`
- `leading`
- `tracking`
- `stroke`
- `spacing`
- `outline`
- `behavior`

### 第三阶段：建立长期门槛

最终目标：

- 新增或修改规则族时，必须同时补规则族规范和 Tailwind 对照测试
- 不允许再直接引入 `preset-wind3` 风格的宽 matcher

## 当前补充记录

### 当前工作区处理

由于 `git stash` 在当前仓库异常失败，本轮改用等价备份方案处理旧工作区：

- 已将被忽略的 `docs/` 目录备份到：
  `/tmp/unocss-preset-tailwind3-docs-backup-2026-04-21`
- 已将已跟踪改动导出为补丁：
  `/tmp/unocss-preset-tailwind3-wip-2026-04-21.patch`

然后已清理工作区，并从本地 `main` 切出当前分支。

## 下一步

下一步直接开始：

- 以 `border` / `rounded` 为模板，定义“Tailwind 3 源头重写”版本的规则族规范
- 再决定是否将当前已有的 `border` 相关收紧逻辑保留为过渡层，还是直接替换成全新实现
