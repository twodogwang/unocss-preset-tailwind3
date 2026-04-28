# Changesets

这个目录用于维护版本发布说明，并驱动自动化发版。

常用流程：

1. 开发完成后运行 `pnpm changeset`
2. 选择版本级别并填写面向用户的变更摘要
3. 将生成的 `.changeset/*.md` 与代码改动一起提交到 PR
4. 合并到 `main` 后，Release workflow 会创建或更新版本 PR，并执行 `pnpm version:release` 来更新 `package.json` 与 `CHANGELOG.md`
5. 合并版本 PR 后，Release workflow 会自动发布 npm 包、创建对应 tag，并生成 GitHub Release

如果只想在本地预览版本变更，仍然可以手动运行 `pnpm version:release`。

## Beta / prerelease 流程

当变更会明显收窄默认支持语法，或需要先收集升级反馈时，优先走 prerelease，而不是直接发正式版。

推荐使用一条长期维护的 beta 分支承载 prerelease：

- 面向 beta 的功能分支从 `beta` 切出，再合回 `beta`
- `beta` 分支保留 `.changeset/pre.json`，不要把这层 prerelease 状态长期带回 `main`
- push 到 `beta` 会触发 GitHub Actions 自动发布新的 `beta` 版本
- workflow 会把 `package.json`、`CHANGELOG.md` 和 `.changeset` 的 prerelease 状态自动提交回 `beta`，保证下一次 beta 继续在上一版基础上滚动

推荐约束：

1. prerelease 在非 `main` 分支上操作，不要长期把 prerelease 状态留在 `main`
2. 如果目标是 `1.0.0-beta.0`，changeset 应使用 `major`
3. beta 发布必须先进入 `changeset` 的 prerelease 模式，由 `pre enter beta` 接管 npm dist-tag
4. `package.json#version`、`CHANGELOG.md`、`.changeset/pre.json` 视为 release-managed 文件，普通功能 PR 不应直接改动
5. 需要补齐或推进 beta 状态时，使用 `release/*` 分支提 PR 到 `beta`
6. `main` 上的正式版版本 PR 继续使用 Changesets 默认的 `changeset-release/*`

常用命令：

1. `pnpm version:prerelease:enter:beta`
2. `pnpm version:release`
3. `pnpm release:publish:beta`
4. 发布结束后执行 `pnpm version:prerelease:exit`

说明：

- `changeset pre enter beta` 会让后续版本变成 `*-beta.x`，并把 publish channel 设为 `beta`
- prerelease 模式下不要再额外传 `--tag beta`，否则 `changeset publish` 会直接报错
- 在 prerelease 期间新增的 changeset 会继续累积到后续 `beta` 版本中

## Beta 状态补齐 PR

如果 npm 上已经有新的 beta 版本，但 `beta` 分支还没回写对应的 prerelease 状态，按下面的方式补齐：

1. 从 `beta` 切一条 `release/sync-beta-state` 分支
2. 运行 `pnpm version:release`
3. 提交 `package.json`、`CHANGELOG.md`、`.changeset/pre.json`
4. 向 `beta` 发 PR，合并后由 `release.yml` 检查当前版本是否已发布

这类 PR 只负责补齐分支状态，不会重复发布同一个 npm 版本。仓库中的 `Release Guard` workflow 会阻止普通功能分支把这些 release-managed 文件直接带入 `main` 或 `beta`。
