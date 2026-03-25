---
name: script-runner
description: スクリプト実行を統合管理する。
---

# script-runner: スクリプト実行統合

`package.json` のスクリプトと外部スクリプトを統合管理する。

## package.json scripts 標準構成

```json
{
  "scripts": {
    "dev":     "next dev",
    "build":   "next build",
    "start":   "next start",
    "lint":    "next lint",
    "test":    "vitest run",
    "test:e2e": "playwright test",
    "type-check": "tsc --noEmit",
    "format":  "prettier --write ."
  }
}
```

## 実行順序（pre/post）

```json
{
  "prebuild":  "npm run type-check && npm run lint",
  "postbuild": "echo 'Build complete'"
}
```
