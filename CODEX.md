# CODEX.md — ink-addiction（事業エージェント向け文脈）

> 最終更新: 2026-03-19 | グループ: B（テック系）

---

## Project Goal（事業の目的）

**「タトゥーアーティストのポートフォリオと予約を、最高のUI/UXで一体化する」**

アーティストが自分の作品を最高の形で見せ、クライアントが安心して予約できる
プラットフォームを提供。日本のタトゥー市場への信頼回復と合法化推進にも貢献する。

ターゲット: タトゥーを入れたいクライアント / 集客を増やしたいアーティスト

---

## Brand Identity

**「クリエイティビティとエッジ」**
- ダークモード基調（作品が映える）
- 電気ブルー（#0040FF）のアクセント
- ポートフォリオカードのホバー時グロー効果

---

## AEO（JSON-LD）ルール

```tsx
// LocalBusiness（スタジオページ）
{ "@type": "LocalBusiness", "name": "スタジオ名", "@type": "TattooShop" }
// Person（アーティストページ）
{ "@type": "Person", "name": "アーティスト名", "jobTitle": "Tattoo Artist" }
// FAQPage
{ "@type": "FAQPage", "mainEntity": [{ "@type": "Question", "name": "タトゥーの予約方法は？" }] }
```

---

## プライバシー・AI生成ルール

- 顧客の施術写真（身体部位を含む）をAI学習に使用することは絶対禁止
- アーティストプロフィールのAI生成は可（「AI補助作成」表記必須）
- Cloudflare Turnstile を登録・予約フォームに実装
- Supabase RLS で自分のデータのみ閲覧・更新できるポリシーを設定

---

## PPR & Edge

```ts
experimental: { ppr: true }
images: { formats: ["image/avif", "image/webp"] }
// Supabase Storage の画像URLを remotePatterns に追加
```
