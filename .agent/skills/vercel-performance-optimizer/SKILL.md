---
name: vercel-performance-optimizer
description: Vercel上のCore Web Vitalsを最適化する。
---

# vercel-performance-optimizer: Vercelパフォーマンス最適化

Core Web Vitals（LCP・FID・CLS）を改善する。

## 目標値

| 指標 | 目標 |
|---|---|
| LCP | 2.5秒以下 |
| FID/INP | 100ms以下 |
| CLS | 0.1以下 |

## 改善施策

### LCP改善
- `next/image` で画像を最適化する
- Largest Element の画像に `priority` をセットする
- フォントは `next/font` で最適化する

### CLS改善
- 画像・動画に `width`/`height` を明示する
- フォントの `font-display: swap` を使用する

### INP改善
- 重い処理を `useTransition` で低優先度に
