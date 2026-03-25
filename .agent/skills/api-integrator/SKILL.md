---
name: api-integrator
description: 外部APIの接続・設計を行う。
---

# api-integrator: API統合設計

外部APIとの接続・エラーハンドリング・レート制限対応を設計する。

## 実装テンプレート

```typescript
async function callApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(endpoint, {
    ...options,
    headers: { 'Authorization': `Bearer ${process.env.API_KEY}`, ...options?.headers },
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
  return res.json() as Promise<T>;
}
```

## チェックリスト

- [ ] APIキーを環境変数から取得しているか
- [ ] レート制限に対するリトライ処理があるか
- [ ] タイムアウトが設定されているか
- [ ] エラーレスポンスの型定義があるか
