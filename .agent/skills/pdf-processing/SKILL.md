---
name: pdf-processing
description: PDFの解析・生成を行う。
---

# pdf-processing: PDF処理

PDFファイルの読み込み・テキスト抽出・生成を行う。

## ライブラリ選択

| 用途 | ライブラリ |
|---|---|
| 生成 | @react-pdf/renderer |
| 解析 | pdf-parse |
| プレビュー | react-pdf |

## 注意事項

- 日本語フォントを明示的に埋め込む（文字化け防止）
- 大きなPDFは Worker で処理する
- ページ数が多い場合はストリーミング処理する
