---
name: find-skills
description: タスクに応じて最適なSkillを探索・提案する。人気・信頼性・適合性ベースで選定する。
---

# find-skills: Skill探索エージェント

タスク内容を分析し、最適なSkillを特定して提案する。

## 探索プロセス

1. タスクのカテゴリを判定（Engineering / Frontend / Data / Integration / Document / Supabase / GitHub / Vercel / DevOps / Security）
2. `.agent/skills/` ディレクトリを走査してSKILL.mdの `description` フィールドを照合
3. 適合度スコアを算出して上位3件を提案

## 選定基準

| 基準 | 説明 |
|---|---|
| 適合性 | タスクキーワードとdescriptionの一致度 |
| 汎用性 | 複数ユースケースに対応するか |
| 依存関係 | 他Skillと組み合わせが必要か |

## 出力フォーマット

```
推奨Skill: [skill-name]
理由: [1行で説明]
参照: .agent/skills/[skill-name]/SKILL.md
```
