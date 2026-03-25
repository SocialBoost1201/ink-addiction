---
name: data-parser
description: データを解析・抽出する。
---

# data-parser: データ解析

CSV・JSON・XML・テキストデータの解析と構造化を行う。

## ライブラリ

| 形式 | ライブラリ |
|---|---|
| CSV | Papa Parse |
| Excel | xlsx |
| XML | fast-xml-parser |
| HTML | cheerio |

## 処理フロー

1. 入力データ形式を判定
2. 適切なパーサーで読み込む
3. 型定義に合わせて変換する
4. バリデーションを実行する
5. 構造化データを返す
