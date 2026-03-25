---
name: tailwind-master
description: Tailwind CSS を使ったUI設計を最適化する。
---

# tailwind-master: Tailwind CSS 最適化

Tailwind CSS v3/v4 を使ったUI実装のベストプラクティス。

## 原則

- ユーティリティクラスを直接適用する（CSS変数を優先しない）
- `cn()` ヘルパー（clsx + tailwind-merge）を使って条件分岐する
- カスタムクラスは `tailwind.config` で定義する

## よく使うパターン

```tsx
// 条件付きスタイル
className={cn("base-class", isActive && "active-class", className)}

// レスポンシブ
className="text-sm md:text-base lg:text-lg"

// ダーク対応
className="bg-white dark:bg-gray-900"
```
