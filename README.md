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
