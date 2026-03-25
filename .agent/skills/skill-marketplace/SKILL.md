---
name: skill-marketplace
description: Skillの流通・販売基盤を構築する。
---

# skill-marketplace: Skillマーケットプレイス

Skillの公開・共有・バージョン管理基盤を設計する。

## 設計要件

### Skill登録
- Skill名・説明・カテゴリ・対応スタックを登録
- SKILL.md の YAML frontmatter を標準フォーマットとする

### 検索・発見
- カテゴリ・キーワード・スタックで検索
- 利用回数・評価でソート

### バージョン管理
- Semver（semantic versioning）を採用
- 破壊的変更は MAJOR バージョンを上げる

## 公開フロー

1. `skill-pack-generator` でパッケージ化
2. GitHub Release にタグを打つ
3. マーケットプレイスにURLを登録
