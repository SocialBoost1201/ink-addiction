---
name: skill-router
description: タスクに応じて適切なSkillを選択・呼び出す。
---

# skill-router: Skillルーター

タスクを受け取り、最適なSkillへルーティングする。

## ルーティングマップ

| タスク種別 | 推奨Skill |
|---|---|
| コード生成 | code-generator |
| リファクタリング | refactor-engine |
| バグ修正 | debugger → bugfix-flow |
| UI実装 | frontend-design → tailwind-master |
| DB設計 | supabase-schema-designer |
| デプロイ | deploy-flow → vercel-deployment-manager |
| SEO記事 | seo-content-flow |
| PRレビュー | pull-request-manager → code-review-automation |

## 判定フロー

1. キーワード抽出
2. カテゴリ判定
3. Skill呼び出し
4. 完了確認
