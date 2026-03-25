---
name: dynamic-skill-loader
description: 必要なSkillのみを遅延ロードしてトークンを節約する。
---

# dynamic-skill-loader: 動的Skillローダー

タスクの進行に応じて必要なSkillのみをロードする。

## ロードタイミング

- タスク開始時: `using-superpowers` + `find-skills` のみ
- 作業フェーズ移行時: 該当フェーズのSkillをロード
- 完了時: `qa-checklist` + `release-checklist`

## 節約効果

1Skillあたり約2,000トークン節約。10Skill同時ロードを避けることで20,000トークン確保。
