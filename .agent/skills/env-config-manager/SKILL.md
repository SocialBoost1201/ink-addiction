---
name: env-config-manager
description: 環境設定を管理する。
---

# env-config-manager: 環境設定管理

開発・Staging・本番環境の設定を管理する。

## 環境ファイル構成

```
.env.local          # ローカル開発用（gitignore）
.env.example        # 必要な変数一覧（git管理）
.env.test           # テスト用
```

## チェックリスト

- [ ] `.env.local` が `.gitignore` に含まれているか
- [ ] `.env.example` に全変数が記載されているか
- [ ] 本番の機密情報がコードにないか
- [ ] 環境ごとに値が正しく設定されているか

## 命名規則

- `NEXT_PUBLIC_` プレフィックス: クライアントに公開してよい変数
- それ以外: サーバーサイドのみで使用する変数
