---
name: agent-loop-controller
description: タスク分解→実行→再評価のループを制御する。
---

# agent-loop-controller: エージェントループ制御

複雑なタスクをループ構造で処理する。

## ループ構造

```
PLAN → EXECUTE → VERIFY → (問題あり) → DIAGNOSE → PLAN
                         → (完了) → REPORT
```

## 制御ルール

- **最大反復回数**: 5回（超過時はユーザーに確認）
- **停止条件**: 全チェックリスト項目が✅ になった時点
- **エラー時**: 同じアプローチを3回繰り返した場合は別手法に切り替える
