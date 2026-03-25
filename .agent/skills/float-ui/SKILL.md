---
name: float-ui
description: Use Float UI components when building UI sections for React/Next.js projects with Tailwind CSS. Free, open-source UI component library with beautifully designed sections including heroes, features, pricing, testimonials, CTAs, navigation, and more. Use when asked to build a new page section or when looking for pre-built UI patterns.
---

# Float UI

公式サイト: https://floatui.com/

## 概要
React + Tailwind CSS 製の無料オープンソースUIコンポーネントライブラリ。
コピーペーストで使用するため、npm インストール不要。LTR/RTL 両対応。

## 使い方
1. https://floatui.com/components にアクセス
2. 目的のコンポーネントを選択
3. コードをコピーしてプロジェクトに貼り付け
4. Tailwind クラスをプロジェクトのデザインシステムに合わせて調整

## 利用可能なカテゴリ

| カテゴリ | コンポーネント例 |
|---------|----------------|
| Navigation | Navbar, Sidebar, Breadcrumb |
| Hero | Centered, Split, With Image |
| Features | Grid, List, Icon-based |
| Pricing | Table, Cards, Toggle |
| Testimonials | Carousel, Grid, Quote |
| CTA | Banner, Full-width, Split |
| Team | Cards, List |
| FAQ | Accordion, Two-column |
| Footer | Simple, Columns, Dark |
| Forms | Contact, Newsletter, Login |

## テンプレート
https://floatui.com/templates から完成済みページテンプレートを入手可能。

## プロジェクト別推奨用途

| プロジェクト | 推奨コンポーネント |
|------------|-----------------|
| socialboost | Features, Pricing, Testimonials, CTA |
| ikotsu.com | Hero, Features, FAQ, CTA |
| seiren-corporate | Navbar, Team, Footer |
| Animo | Pricing, FAQ, Features |

## Magic UI との役割分担
- **Float UI**: 静的セクション（ナビ、フィーチャー、フッター等）
- **Magic UI**: アニメーション演出（Globe, Particles, SparklesText等）

## 注意点
- Tailwind CSS v3 前提。v4を使う場合はクラス名の調整が必要な場合あり
- コンポーネントは `components/ui/` または `components/sections/` に配置
- カスタマイズ時は変数化してデザイントークンに合わせること
