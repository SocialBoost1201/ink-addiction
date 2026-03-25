---
name: json-transformer
description: JSONデータの整形・変換を行う。
---

# json-transformer: JSON変換

JSON データの構造変換・バリデーション・整形を行う。

## 変換パターン

```typescript
// フラット→ネスト
const nested = flatData.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

// 配列→マップ
const map = new Map(array.map(item => [item.id, item]));

// キャメルケース変換
const camel = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
```

## バリデーション

- Zod スキーマでバリデーションする
- 必須フィールドの欠落を早期検出する
