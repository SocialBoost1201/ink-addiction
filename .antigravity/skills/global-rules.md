# global-rules.md — ink-addiction

> グループ: **B（SocialBoost / テック系）**  
> 最終更新: 2026-03-19

---

## 1. ブランドアイデンティティ

### カラーシステム

| 役割 | HEX | 用途 |
|------|-----|------|
| プライマリブルー | `#0040FF` | プライマリCTA |
| ダークネイビー | `#0D2E57` | ヘッダー・フッター・深い背景 |
| アクセント | `#00CFFF` | ハイライト・グロー |
| 背景 | `#F0F4FF` / `#FFFFFF` | ベース背景 |
| テキスト | `#0D1A2E` | 本文 |

### Tailwind v4 カラー定義
```css
@theme {
  --color-brand-primary: #0040FF;
  --color-brand-dark:    #0D2E57;
  --color-brand-accent:  #00CFFF;
  --color-bg-base:       #FFFFFF;
  --color-bg-subtle:     #F0F4FF;
  --color-text-base:     #0D1A2E;
  --color-text-muted:    #4A5568;
}
```

### ブランドトーン
- タトゥーアーティスト向けプラットフォームとしての個性・クリエイティビティ
- アーティストが使いたくなる洗練されたデザイン
- 難解な登録フロー・管理UIは避け、シンプルに

---

## 2. デザインシステム

### 基本方針
- **エッジが効いた・モダン・黒/ネイビーベース**のデザイン
- ダークモード基調（アーティスト向けプラットフォームとして）
- 角丸は `rounded-lg`
- ポートフォリオ画像が映える広い余白

### ダークモードCSS
```css
:root {
  --bg: #0D1117;
  --surface: #161B22;
  --border: rgba(255, 255, 255, 0.1);
  --text: #E6EDF3;
  --muted: #8B949E;
}
```

---

## 3. アニメーション

このプロジェクトはアニメーションライブラリは現在未導入。
追加する場合は `framer-motion` を推奨。

### 推奨ホバーパターン（CSS）
```css
.portfolio-card {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.25s ease;
}
.portfolio-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 64, 255, 0.2);
}
```

---

## 4. フォント

| 要素 | フォント |
|------|---------|
| 見出し | Noto Sans JP / Inter |
| 本文 | Noto Sans JP |

---

## 5. 技術スタック最適化パターン

**スタック**: Next.js 16 / React 19 / Supabase / Tailwind CSS v4

### Supabase ストレージ（画像管理）
```ts
// ポートフォリオ画像はSupabase Storageで管理
const { data, error } = await supabase.storage
  .from("portfolios")
  .upload(`${userId}/${filename}`, file, {
    cacheControl: "3600",
    upsert: false,
  })
```

### Supabase RLS
```sql
-- 自分のデータのみ変更可能
CREATE POLICY "Own data only" ON portfolios
  FOR ALL USING (auth.uid() = user_id);
```

### 画像表示最適化
```tsx
// Supabase Storage の公開URLをnext/imageで表示
import Image from "next/image"
<Image
  src={supabasePublicUrl}
  alt={work.title}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 50vw, 33vw"
/>
```

---

## 6. コンポーネント設計ルール

- `src/components/ui/` → 汎用UIコンポーネント
- `src/components/portfolio/` → ポートフォリオ関連
- `any` 型の使用禁止
- `console.log` の本番コードへの混入禁止
- 画像は `next/image` を必ず使用

---

## 7. セキュリティ

- Supabase RLS を全テーブルに必ず設定
- ファイルアップロードはサイズ制限・拡張子制限を必ず実装
- uuid でファイル名を生成（ユーザー指定ファイル名の保存禁止）

---

## 8. アニメーション アクセシビリティ基準（2026追加）

### useReducedMotion 必須ルール（framer-motion 新規追加）

```tsx
"use client"
import { motion, useReducedMotion } from "framer-motion"

export function PortfolioCard({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion()
  return (
    <motion.div
      whileHover={prefersReduced ? {} : { scale: 1.02, boxShadow: "0 12px 32px rgba(0, 64, 255, 0.2)" }}
      transition={prefersReduced ? {} : { duration: 0.25, ease: "easeOut" }}
    >{children}</motion.div>
  )
}
```

### Suspense による重エフェクトの遅延

```tsx
import { Suspense } from "react"
import dynamic from "next/dynamic"
const Effect = dynamic(() => import("@/components/Effect"), { ssr: false })
<Suspense fallback={<div className="bg-surface animate-pulse h-48 rounded-lg" />}>
  <Effect />
</Suspense>
```

### パフォーマンス基準
- ポートフォリオ画像（LCP対象）にアニメーション禁止
- Lighthouse Performance スコア 90+ を維持すること

---

## Tailwind CSS v4 アニメーション定義（2026追加）

> このプロジェクトはTailwind CSS v4（`@tailwindcss/postcss`使用）のため、`globals.css` に直接定義する。

### app/globals.css への追記

```css
/* =============================================
   2026: Shimmer・Floating・Glow アニメーション
   ============================================= */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

@keyframes floating {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
}

@keyframes floating-slow {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-5px) rotate(0.4deg); }
  66%       { transform: translateY(-2px) rotate(-0.3deg); }
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 8px rgba(0, 64, 255, 0.3); }
  50%       { box-shadow: 0 0 24px rgba(0, 64, 255, 0.7); }
}

@keyframes slide-in-left {
  0%   { opacity: 0; transform: translateX(-20px); }
  100% { opacity: 1; transform: translateX(0); }
}

/* =============================================
   Shimmer グラデーション共通ユーティリティ
   スケルトンUIに適用: className="animate-shimmer shimmer-bg"
   ============================================= */
@utility shimmer-bg {
  background: linear-gradient(
    90deg,
    theme(colors.gray.200) 25%,
    theme(colors.gray.100) 50%,
    theme(colors.gray.200) 75%
  );
  background-size: 200% 100%;
}

/* ============
   アニメーション
   ============ */
@utility animate-shimmer       { animation: shimmer 1.8s linear infinite; }
@utility animate-floating      { animation: floating 3.5s ease-in-out infinite; }
@utility animate-floating-slow { animation: floating-slow 8.0s ease-in-out infinite; }
@utility animate-glow-pulse    { animation: glow-pulse 2.5s ease-in-out infinite; }
@utility animate-slide-in-left { animation: slide-in-left 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
```

### 使用例

```tsx
// スケルトンローディング
<div className="animate-shimmer shimmer-bg h-48 rounded-lg" />

// 浮遊するアイコン・バッジ
<div className="animate-floating">
  <Icon />
</div>

// CTAボタンのグロー
<button className="animate-glow-pulse bg-brand-primary text-white px-6 py-3 rounded-lg">
  今すぐ始める
</button>
```

