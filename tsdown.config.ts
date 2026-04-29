import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/eslint.ts'],
  clean: true,
  dts: true,
  exports: true,
  failOnWarn: true,
})
