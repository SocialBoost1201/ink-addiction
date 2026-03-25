---
name: skill-manager
description: Skillの一覧管理・バージョン管理・構成管理を行う。
---

# skill-manager: Skill構成管理

`.agent/skills/` の全Skillを管理する。

## コマンド

| コマンド | 説明 |
|---|---|
| `list` | 全Skillの一覧と説明を表示 |
| `add [name]` | 新規Skill雛形を作成 |
| `remove [name]` | Skillを削除（確認あり） |
| `audit` | 全Skill の SKILL.md フォーマットを検証 |
| `sync [project]` | 保管庫から指定プロジェクトへ同期 |

## SKILL.md 必須フィールド

```yaml
---
name: skill-name
description: 1行の説明（日本語）
---
```

## ディレクトリ構造

```
.agent/skills/
  [skill-name]/
    SKILL.md     # 必須
    references/  # 任意
```
