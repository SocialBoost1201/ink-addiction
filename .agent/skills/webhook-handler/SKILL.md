---
name: webhook-handler
description: Webhookイベントを処理する。
---

# webhook-handler: Webhook処理

Webhookの受信・検証・処理を実装する。

## 実装テンプレート（Next.js App Router）

```typescript
export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get('x-signature') ?? '';
  
  if (!verifySignature(payload, sig, process.env.WEBHOOK_SECRET!)) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const event = JSON.parse(payload);
  await processEvent(event);
  return new Response('OK', { status: 200 });
}
```

## チェックリスト

- [ ] 署名検証を実装しているか
- [ ] 冪等性を保証しているか（重複受信対応）
- [ ] 処理を非同期（Queue）で行っているか
- [ ] レスポンスを200ms以内に返しているか
