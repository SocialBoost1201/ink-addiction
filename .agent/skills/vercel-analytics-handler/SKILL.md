---
name: vercel-analytics-handler
description: Vercelのアクセス解析・パフォーマンス測定を行う。
---

# vercel-analytics-handler: Vercel Analytics設定

Vercel Analytics と Speed Insights を設定・分析する。

## 導入

```bash
npm install @vercel/analytics @vercel/speed-insights
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

## 確認観点

- ページ別訪問数・直帰率
- Core Web Vitals の P75 値
- トップページLCPの改善推移
