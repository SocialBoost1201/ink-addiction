---
name: dependency-checker
description: 依存関係の安全性を管理する。
---

# dependency-checker: 依存関係安全性チェック

npmパッケージの脆弱性・ライセンス・バージョンを管理する。

## チェックコマンド

```bash
npm audit                    # 脆弱性確認
npm audit fix                # 自動修正可能なものを修正
npm outdated                 # アップデート可能なパッケージ確認
npx depcheck                 # 未使用依存関係の検出
```

## 判断基準

| レベル | 対応 |
|---|---|
| Critical | 即時修正・利用停止 |
| High | 1週間以内に修正 |
| Moderate | 計画的に修正 |
| Low | 次のリリース時に対処 |
