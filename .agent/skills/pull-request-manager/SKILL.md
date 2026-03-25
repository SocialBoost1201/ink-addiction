---
name: pull-request-manager
description: PR作成・レビュー・マージ管理を行う。
---

# pull-request-manager: PRライフサイクル管理

Pull Request の作成・レビュー依頼・マージまでを標準化する。

## PRテンプレート

```markdown
## 変更概要
[何をなぜ変更したか]

## 変更内容
- [ ] 

## 動作確認
- [ ] ローカルで動作確認済み
- [ ] Preview URLで確認済み

## レビュー観点
- 特に確認してほしい箇所
```

## チェックリスト（マージ前）

- [ ] CIが全て通過しているか
- [ ] レビューでapproveされているか
- [ ] コンフリクトが解消されているか
- [ ] `main` ブランチへのマージ方針（Squash推奨）
