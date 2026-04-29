import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/eslint/index.ts'],
  clean: true,
  dts: true,
  exports: true,
  failOnWarn: true,
})
