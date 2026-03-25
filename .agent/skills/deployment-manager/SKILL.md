---
name: deployment-manager
description: 全体のデプロイを管理する。
---

# deployment-manager: デプロイ全体管理

アプリケーションのデプロイを計画・実行・確認する。

## デプロイフロー

1. `release-checklist` を実行
2. Stagingへデプロイして動作確認
3. 本番へデプロイ（`vercel-deployment-manager` 参照）
4. デプロイ後の動作確認
5. モニタリングで異常がないか確認（30分）

## ロールバック手順

```bash
vercel rollback  # 直前のデプロイに戻す
```

問題が継続する場合はFeature Flagでoff → 原因調査
