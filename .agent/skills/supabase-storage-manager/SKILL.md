---
name: supabase-storage-manager
description: Supabaseファイル・画像ストレージを管理する。
---

# supabase-storage-manager: Supabaseストレージ管理

Supabase Storage を使ったファイル・画像の管理を実装する。

## アップロード実装

```typescript
const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload(`${userId}/${filename}`, file, {
    cacheControl: '3600',
    upsert: false,
  });
```

## チェックリスト

- [ ] バケットポリシーが適切か（public/private）
- [ ] ファイルサイズ制限を設けているか
- [ ] 許可する MIME タイプを限定しているか
- [ ] 古いファイルの削除処理があるか
