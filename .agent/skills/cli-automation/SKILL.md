---
name: cli-automation
description: CLI操作を自動化する。
---

# cli-automation: CLI自動化

繰り返し行うCLI操作をスクリプト化・自動化する。

## よく使うスクリプトパターン

```bash
#!/bin/bash
set -euo pipefail  # エラー時に即停止

# 色付き出力
RED='[0;31m'
GREEN='[0;32m'
NC='[0m'

log_success() { echo -e "${GREEN}✓ $1${NC}"; }
log_error()   { echo -e "${RED}✗ $1${NC}"; exit 1; }

# メイン処理
main() {
  log_success "開始"
  # 処理...
}

main "$@"
```

## automation 対象候補

- 開発環境セットアップ（`.env.local` 生成）
- DB マイグレーション実行
- 定期バックアップ
- ログローテーション
