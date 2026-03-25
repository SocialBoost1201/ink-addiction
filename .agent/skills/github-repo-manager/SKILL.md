---
name: github-repo-manager
description: GitHubリポジトリ構成・ブランチ戦略を管理する。
---

# github-repo-manager: GitHubリポジトリ管理

リポジトリ設定・ブランチ戦略・プロテクションルールを管理する。

## ブランチ戦略（GitHub Flow）

```
main ← production（直接pushは禁止）
  └── feature/[issue-number]-[description]
  └── fix/[issue-number]-[description]
  └── chore/[description]
```

## ブランチ保護ルール

- `main`: PRのみマージ可・最低1 approve・CI passing必須
- 動作確認はPreview URLで行う

## チェックリスト

- [ ] `main` ブランチの保護が設定されているか
- [ ] CODEOWNERS が設定されているか
- [ ] Issue/PRテンプレートが存在するか
