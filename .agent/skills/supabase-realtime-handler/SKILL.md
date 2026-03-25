---
name: supabase-realtime-handler
description: Supabaseリアルタイム通信・サブスクリプションを処理する。
---

# supabase-realtime-handler: Supabaseリアルタイム処理

Supabase Realtime を使った双方向通信を実装する。

## サブスクリプション実装

```typescript
useEffect(() => {
  const channel = supabase
    .channel('table-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'messages',
    }, (payload) => {
      setMessages(prev => [...prev, payload.new as Message]);
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}, []);
```

## チェックリスト

- [ ] コンポーネントのアンマウント時にチャンネルを削除しているか
- [ ] RLSポリシーでリアルタイム配信が許可されているか
