---
name: supabase-query-builder
description: Supabase SQLの生成・最適化を行う。
---

# supabase-query-builder: Supabaseクエリ最適化

Supabase クライアントを使ったクエリの生成・最適化を行う。

## クエリパターン

```typescript
// 基本的なselect
const { data, error } = await supabase
  .from('table')
  .select('id, name, created_at')
  .order('created_at', { ascending: false })
  .limit(20);

// JOIN（リレーション取得）
const { data } = await supabase
  .from('posts')
  .select('*, author:users(name, avatar_url)');

// 条件付き
const { data } = await supabase
  .from('items')
  .select('*')
  .eq('status', 'active')
  .gte('price', 1000);
```

## パフォーマンスチェック

- [ ] N+1クエリが発生していないか
- [ ] 必要なカラムのみを select しているか
- [ ] インデックスが使われているか（EXPLAIN で確認）
