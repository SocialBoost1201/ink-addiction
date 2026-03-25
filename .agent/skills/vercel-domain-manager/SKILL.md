---
name: vercel-domain-manager
description: ドメイン・SSL・ルーティングを管理する。
---

# vercel-domain-manager: Vercelドメイン管理

カスタムドメインの設定・SSL・リダイレクトルールを管理する。

## ドメイン追加手順

```bash
vercel domains add [domain]    # ドメイン追加
vercel domains inspect [domain] # 設定確認
```

## `vercel.json` リダイレクト設定

```json
{
  "redirects": [
    { "source": "/old-path", "destination": "/new-path", "permanent": true }
  ],
  "headers": [
    { "source": "/(.*)", "headers": [
      { "key": "X-Frame-Options", "value": "SAMEORIGIN" }
    ]}
  ]
}
```

## チェックリスト

- [ ] SSL証明書が有効か（Vercel自動発行）
- [ ] www と apex ドメインの両方が設定されているか
- [ ] 不要なリダイレクトループがないか
