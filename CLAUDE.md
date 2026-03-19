# CLAUDE.md — ink-addiction（技術エージェント向け憲法）

> 最終更新: 2026-03-19 | Package Manager: npm | Node: >=18.0.0

---

## コマンド一覧

```bash
npm run dev          # 開発サーバー起動
npm run build        # next build
npm run start        # 本番起動
npm run lint         # ESLint
```

---

## 技術スタック

| 項目 | 内容 |
|------|------|
| Framework | Next.js 15.x |
| React | 18.x |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion v12 / GSAP 3 / Lenis |
| 3D | Three.js / @react-three/fiber / @react-three/drei |
| Database | Supabase（Auth + Storage + PostgreSQL） |
| Icons | Lucide React |

---

## TypeScript 規約

```ts
// ✅ Supabase Storage パターン（ポートフォリオ画像管理）
import { createClient } from "@supabase/supabase-js"
const { data, error } = await supabase.storage
  .from("portfolios")
  .upload(`${artistId}/${fileName}`, file, { cacheControl: "3600", upsert: false })

// ✅ RLS ポリシー: 自分のデータのみ更新可
// policy: "artist can update own portfolios"
// USING (auth.uid()::text = artist_id)

// ✅ Three.js → dynamic import + ssr: false 必須
```

---

## PPR & 最適化

```ts
experimental: { ppr: true }
images: { formats: ["image/avif", "image/webp"] }
// ポートフォリオ画像の Supabase Storage URL は next.config.ts の remotePatterns に追加
```

---

## セキュリティ

- Supabase RLS 全テーブルに設定（artist_id による行レベル制限）
- ファイルアップロードサイズ制限（Supabase: 50MB以内）
- Cloudflare Turnstile をアーティスト登録フォームに実装
