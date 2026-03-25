---
name: git-commit-generator
description: コミットメッセージを生成する（Conventional Commits準拠）。
---

# git-commit-generator: コミットメッセージ生成

Conventional Commits 規約に準拠したコミットメッセージを生成する。

## フォーマット

```
<type>(<scope>): <subject>

[body]

[footer]
```

## Type 一覧

| Type | 用途 |
|---|---|
| `feat` | 新機能追加 |
| `fix` | バグ修正 |
| `docs` | ドキュメント変更 |
| `style` | コード整形（動作変更なし）|
| `refactor` | リファクタリング |
| `test` | テスト追加・修正 |
| `chore` | ビルド・CI設定変更 |

## 例

```
feat(auth): Google OAuth ログイン機能を追加

- Supabase Auth を使用
- ユーザー情報を users テーブルに同期
```
