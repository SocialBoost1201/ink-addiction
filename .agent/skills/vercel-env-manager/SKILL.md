---
name: vercel-env-manager
description: Vercelの環境変数・Secrets管理を行う。
---

# vercel-env-manager: Vercel環境変数管理

本番・Preview・開発環境の環境変数を管理する。

## 環境種別

| 環境 | 用途 |
|---|---|
| Production | `main` ブランチ本番環境 |
| Preview | PR/feature ブランチ |
| Development | `vercel dev` ローカル |

## CLI操作

```bash
vercel env add [name]              # 環境変数追加
vercel env ls                      # 一覧表示
vercel env rm [name] [environment] # 削除
vercel env pull .env.local         # ローカルに取得
```

## チェックリスト

- [ ] シークレット（APIキー等）は `Encrypted` 設定か
- [ ] 不要な環境変数が残っていないか
- [ ] `.env.example` が最新の状態か
