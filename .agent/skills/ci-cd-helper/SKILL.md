---
name: ci-cd-helper
description: CI/CDを自動化する。
---

# ci-cd-helper: CI/CD自動化

継続的インテグレーション・デプロイのパイプラインを管理する。

## パイプライン構成

```
コードpush
  → lint + type-check
  → unit test
  → build
  → (PR) e2e test on Preview URL
  → (main) deploy to production
```

## 失敗時の対処

| エラー | 対処 |
|---|---|
| lint error | `eslint --fix` を実行 |
| type error | 型定義を確認・修正 |
| build error | ローカルで `npm run build` を実行して確認 |
| test failure | 失敗テストを個別実行して調査 |
