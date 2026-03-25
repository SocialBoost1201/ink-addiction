---
name: lp-build-flow
description: LP制作の一連フロー（設計〜公開）を実行する。
---

# lp-build-flow: LP制作標準フロー

ランディングページの設計から公開までの手順を标准化する。

## フロー

```
1. 要件整理（ターゲット・CTA・KPI）
   └── ui-ux-pro で CV設計

2. ページ設計（ワイヤーフレーム）
   └── frontend-design でコンポーネント設計

3. 実装
   └── tailwind-master でUI実装
   └── animation-skill でアニメーション追加

4. SEO設定
   └── seo-checklist を実行

5. QA
   └── qa-checklist を実行

6. 公開
   └── release-checklist を実行
   └── vercel-deployment-manager でデプロイ
```
