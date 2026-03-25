---
name: deploy-flow
description: デプロイ手順を標準化する。
---

# deploy-flow: デプロイ標準手順

アプリケーションのデプロイ手順を標準化する。

## 本番デプロイ手順

```
1. 事前確認
   [ ] main ブランチが最新か
   [ ] 全CIが通過しているか
   [ ] release-checklist を実行したか

2. デプロイ実行
   git push origin main
   → GitHub Actions が自動デプロイ

3. デプロイ後確認（30分間）
   [ ] 主要ページが正常に表示されるか
   [ ] APIレスポンスが正常か
   [ ] エラーログが増加していないか

4. 問題発生時
   vercel rollback  # 即時ロールバック
```
