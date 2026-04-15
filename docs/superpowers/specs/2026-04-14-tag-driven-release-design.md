# Tag-Driven Release With Changelog Design

**背景**

当前仓库已经有基于 Git tag 的 GitHub Actions 发布流程：

- `CI` 在 `main` 和 PR 上执行安装、构建、测试
- `Release` 在推送 `v*` tag 时执行安装、校验并 `npm publish`

现阶段缺少两部分能力：

- 面向 npm 包用户的版本级更新日志
- 一套稳定、可复现的版本准备流程，确保 tag 发布与 changelog 内容保持一致

**目标**

- 保留当前 `v*` tag 驱动的发布模式
- 引入仓库内 `CHANGELOG.md`
- 通过 `changesets` 管理版本说明与版本号更新
- 在发布 workflow 中继续执行完整校验后发布 npm 包
- 在 GitHub 上同步创建 Release，并附上该版本 changelog

**非目标**

- 不改成 main 分支自动发布
- 不引入多包版本联动发布逻辑
- 不为 `oxlint` 用户补齐相同的 IDE 迁移提示能力

## 方案选择

选择 `changesets`，原因如下：

- 它适合 npm 包仓库，支持维护版本级更新说明
- 能自动更新 `package.json` 和 `CHANGELOG.md`
- 可以与当前 tag 驱动发布方式并存，不需要改动仓库的发布节奏

相比之下：

- GitHub 自动 release notes 适合作为辅助，不适合作为主 changelog 来源
- 手写 `CHANGELOG.md` 长期维护成本过高且容易遗漏

## 设计

### 1. 版本与 changelog 来源

新增 `changesets` 配置目录：

- `.changeset/config.json`

新增仓库文档：

- `CHANGELOG.md`

日常开发时，为影响发布的改动补一个 `.changeset/*.md` 文件，描述：

- 发布级别：`patch` / `minor` / `major`
- 本次版本要出现在 changelog 中的摘要

准备发版时，本地执行：

- `pnpm changeset version`

该命令负责：

- 更新根 `package.json` 的版本号
- 生成或更新 `CHANGELOG.md`
- 消费掉对应的 `.changeset/*.md`

### 2. GitHub Actions 发布流程

保留当前 `.github/workflows/release.yml` 的 tag 触发方式，但增强为：

1. 安装依赖
2. 执行根 `ci`
3. 发布 npm 包
4. 基于 tag 创建 GitHub Release
5. 将对应版本的 changelog 内容写入 Release body

实现上不依赖 GitHub 自动生成 release notes，而是使用仓库中的 `CHANGELOG.md` 作为真实来源。

### 3. GitHub Release 内容来源

增加一个轻量脚本，从 `CHANGELOG.md` 中提取当前 tag 对应版本的条目，并输出到临时文件供 workflow 使用。

脚本职责：

- 输入 tag，例如 `v0.1.1`
- 规范化为版本号 `0.1.1`
- 在 `CHANGELOG.md` 中找到该版本标题
- 截取直到下一个版本标题之间的内容
- 将结果写入文件，供 `gh release create --notes-file` 或 `softprops/action-gh-release` 使用

这样可以避免在 workflow 中堆复杂 shell 文本处理。

### 4. 仓库脚本

根 `package.json` 新增版本准备相关脚本，例如：

- `changeset`
- `version:release`
- `release:notes`

目的：

- 降低日常操作门槛
- 把本地版本准备、日志生成和发布前检查统一为显式命令

### 5. 开发者流程

日常开发：

1. 修改代码
2. 添加 `.changeset/*.md`
3. 合并代码

准备发版：

1. 执行 `pnpm changeset version`
2. 审核 `package.json` 与 `CHANGELOG.md`
3. 提交版本更新
4. 打 tag，例如 `v0.1.1`
5. 推送 commit 与 tag

发布：

- GitHub Actions 在 tag 推送后自动完成校验、npm 发布与 GitHub Release 创建

## 涉及文件

**新增**

- `/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/.changeset/config.json`
- `/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/.changeset/README.md`
- `/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/CHANGELOG.md`
- `/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/scripts/release-notes.mjs`

**修改**

- `/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/package.json`
- `/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/.github/workflows/release.yml`
- `/Users/shakugannoshana/Documents/ex/twodogwang/unocss-preset-tailwind3/README.md`

## 测试策略

- 单元/脚本层面验证 `release-notes.mjs` 能正确提取目标版本内容
- 继续用根 `ci` 保证发布前质量门槛不退化
- 用本地 dry-run 命令验证 `changeset version` 能正确更新 `CHANGELOG.md`
- 通过 workflow 静态检查确认发布步骤引用的命令和文件存在

## 风险与控制

- 风险：开发者忘记补 `.changeset`
  控制：README 补充发布流程说明，必要时后续再补 CI 检查

- 风险：tag 与 `package.json` 版本不一致
  控制：release workflow 在发布前检查 tag 版本与包版本一致

- 风险：GitHub Release 内容为空或提取错误
  控制：增加 release notes 提取脚本测试，并在 workflow 中对空结果失败退出
