---
name: workflow-orchestrator
description: 複数Skillを統合して一連の作業を実行する。
---

# workflow-orchestrator: ワークフロー統合実行

複数のSkillを順序立てて実行し、一連の作業を完結させる。

## 実行フロー

1. `task-router` でタスクを分解
2. 各フェーズに対応するSkillをロード
3. フェーズ順に実行
4. 各フェーズの完了を確認してから次へ進む
5. 全フェーズ完了後に `qa-checklist` を実行

## エラーハンドリング

フェーズ失敗時: `debugger` を呼び出し → 修正 → 再実行
