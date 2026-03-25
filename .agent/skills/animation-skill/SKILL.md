---
name: animation-skill
description: アニメーション設計・実装を行う。
---

# animation-skill: アニメーション設計

Web アニメーションの設計と実装ガイドライン。

## ライブラリ選択

| 用途 | ライブラリ |
|---|---|
| スクロール連動 | GSAP ScrollTrigger |
| ページ遷移 | Framer Motion |
| Three.js連携 | GSAP Timeline |
| 軽量マイクロ | CSS Transition |

## パフォーマンスルール

- `transform` / `opacity` のみをアニメーション対象にする
- `will-change` は使用直前にセット、完了後に削除する
- 60fps を基準とする（10ms/frame 以内）
- `prefers-reduced-motion` に対応する
