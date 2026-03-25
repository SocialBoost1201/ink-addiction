---
name: log-analyzer
description: ログを分析してエラーを検出する。
---

# log-analyzer: ログ分析

アプリケーションログからエラー・パフォーマンス問題を検出する。

## 分析観点

- エラーレベル: ERROR / WARN / INFO の比率
- 頻出エラー: 同一エラーの発生頻度
- 時系列: スパイク発生時刻とデプロイの関連
- スロークエリ: 1000ms 超のDB/APIコール

## Vercel ログ確認

```bash
vercel logs [deployment-url] --output raw | grep ERROR
```
