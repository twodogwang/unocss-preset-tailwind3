# @twodogwang/unocss-preset-tailwind3

一个独立仓库中的 UnoCSS preset，目标是把 utility 和 variant 的语法边界收紧到 Tailwind CSS v3.4.17。

## 目标

- 不依赖 `preset-mini`
- 不依赖 `preset-wind3`
- 保留 Tailwind 3 正反例测试
- 使用 Tailwind 3 黑盒差分保证语法边界

## 开发

```bash
pnpm install
pnpm build
pnpm test
```

## 发布

这个仓库保留 `v*` tag 驱动发布。

日常改动完成后，先补一条 changeset：

```bash
pnpm changeset
```

准备发版时，生成版本号和更新日志：

```bash
pnpm version:release
```

检查 `package.json` 与 `CHANGELOG.md` 后提交版本变更，然后创建并推送 tag：

```bash
git tag v0.1.1
git push origin main --tags
```

GitHub Actions 会在 tag 推送后自动执行校验、发布 npm 包并创建 GitHub Release。

## 使用

```ts
import { defineConfig } from 'unocss'
import presetTailwind3 from '@twodogwang/unocss-preset-tailwind3'

export default defineConfig({
  presets: [
    presetTailwind3(),
  ],
})
```
