# UI/UX Global Rules Violation Report

- Project: ink-addiction
- Generated: 2026-03-20T00:13:16.082Z
- Scope: UI files (42 files)
- Method: static analysis (regex-based heuristic)

## Critical

- なし

## High

- なし

## Medium

1. 行間不足の疑い
- 判定理由: line-height が詰まる指定を 34 件検出。可読性低下の可能性。
- 根拠:
- ink-addiction/src/app/globals.css:54 `line-height: 1.7;`
- ink-addiction/src/app/globals.css:463 `line-height: 1;`
- ink-addiction/src/app/globals.css:479 `line-height: 1.8;`
- ink-addiction/src/app/globals.css:661 `line-height: 1.6;`
- ink-addiction/src/app/globals.css:689 `line-height: 1.9;`
- ink-addiction/src/app/globals.css:751 `line-height: 1.9;`
- ink-addiction/src/app/globals.css:1189 `.admin-message-box__text { background: var(--bg); border: 1px solid var(--border); padding: 12px; border-radius: 3px; font-size: 14px; color: var(--text-secondary); white-space: pr`
- ink-addiction/src/app/globals.css:1219 `line-height: 1.9;`

## Low

- なし

## Notes

- このレポートは静的解析ベースのため、最終判断は実機表示（1920/1440/1024/768/430/390/375）で確認すること。
- Fixed要素・重なり・改行崩れは、実際のDOM/表示幅で再検証すること。
