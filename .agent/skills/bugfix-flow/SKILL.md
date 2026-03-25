---
name: bugfix-flow
description: バグ修正プロセスを標準化する。
---

# bugfix-flow: バグ修正フロー

バグ報告受領から本番リリースまでのプロセスを标准化する。

## フロー

```
1. バグ確認
   - 再現手順を確認する
   - 影響範囲を特定する（critical/major/minor）

2. ブランチ作成
   git checkout -b fix/[issue-number]-[description]

3. 原因調査
   └── debugger を使って根本原因を特定

4. 修正実装
   └── unit-test-generator でテストを先に書く
   └── 修正を実装してテストが通ることを確認

5. レビュー・リリース
   └── pull-request-manager でPRを作成
   └── qa-checklist を実行
   └── deploy-flow に従ってリリース
```
