---
name: vercel-deployment-manager
description: Vercelデプロイを管理する（本番・Preview）。
---

# vercel-deployment-manager: Vercelデプロイ管理

本番・Preview環境へのデプロイを管理する。

## デプロイフロー

```
feature ブランチ push → Preview Deployment 自動生成
main ブランチ merge → Production Deployment 自動実行
```

## デプロイ確認コマンド

```bash
vercel ls                    # デプロイ一覧
vercel inspect [url]         # デプロイ詳細
vercel rollback              # 直前のデプロイに戻す
```

## チェックリスト（本番前）

- [ ] Preview URLで動作確認済みか
- [ ] 環境変数が本番用に設定されているか
- [ ] `release-checklist` を実行したか
