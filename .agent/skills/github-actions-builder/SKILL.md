---
name: github-actions-builder
description: CI/CDパイプラインを構築する。
---

# github-actions-builder: GitHub Actions構築

CI/CDパイプラインをGitHub Actionsで構築する。

## 基本テンプレート

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

## チェックリスト

- [ ] シークレットが `GitHub Secrets` で管理されているか
- [ ] キャッシュが有効化されているか（実行時間短縮）
- [ ] タイムアウトが設定されているか
