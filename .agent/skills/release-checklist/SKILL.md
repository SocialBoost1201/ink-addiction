---
name: release-checklist
description: リリース前の最終確認を行う。
---

# release-checklist: リリース前最終確認チェックリスト

本番デプロイ前に必ず実行する。

## コード

- [ ] `npm run build` がエラーなく通過するか
- [ ] `npm run lint` がエラーなく通過するか
- [ ] テストが全て通っているか
- [ ] コンソールエラーがないか

## 機能・UI

- [ ] `qa-checklist` を実行済みか
- [ ] Preview URL で本番相当の動作確認をしたか
- [ ] 新機能のエラー状態のUIを確認したか

## セキュリティ・設定

- [ ] 環境変数が本番用に設定されているか
- [ ] APIキーがコードに含まれていないか
- [ ] `npm audit` でHigh/Critical がないか

## SEO（LP・記事ページの場合）

- [ ] `seo-checklist` を実行済みか
