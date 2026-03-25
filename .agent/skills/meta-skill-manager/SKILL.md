---
name: meta-skill-manager
description: Skillの生成・統合・最適化を行うメタ管理Skill。
---

# meta-skill-manager: Skillメタ管理

Skill自体の品質向上・統合・最適化を担う。

## 機能

### 1. Skill生成
ユーザーの要件からSKILL.mdを自動生成する。

### 2. Skill統合
関連する複数SkillをまとめてWorkflowを作成する。

### 3. 重複検出
既存Skillと機能が重複するSkillを検出し統合を提案する。

### 4. 品質スコア
各Skillを以下の基準で評価する：
- フォーマット準拠（YAML frontmatter）
- 説明の明確性
- チェックリストの有無
- 実例の有無
