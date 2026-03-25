---
name: supabase-auth-handler
description: Supabase認証設計（JWT/RLS/Role管理）を行う。
---

# supabase-auth-handler: Supabase認証設計

Supabase Auth を使った認証・認可フローを実装する。

## Next.js との統合（Server Side）

```typescript
// app/api/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return new Response('Unauthorized', { status: 401 });
  // ...
}
```

## チェックリスト

- [ ] `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` が設定されているか
- [ ] Middleware でセッションリフレッシュを行っているか
- [ ] RLSポリシーで認証ユーザーのみアクセス可能か
