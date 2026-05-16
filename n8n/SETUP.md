# 清蓮 Note 自動投稿 — n8n セットアップ手順

## 1. ワークフロー内の設定ノードを編集

インポート後、**「設定 & トピック選択」** ノードを開き、冒頭2行を書き換えてください：

```js
const ANTHROPIC_API_KEY = 'sk-ant-ここにAPIキーを貼り付け';  // ← 変更
const NOTE_SESSION_TOKEN = 'ここにセッショントークンを貼り付け';  // ← 変更
```

| 項目 | 値 |
|------|-----|
| `ANTHROPIC_API_KEY` | Anthropic Console で発行した `sk-ant-...` |
| `NOTE_SESSION_TOKEN` | Note.com の `_note_session_v5` クッキー値のみ（プレフィックス不要） |

> ⚠️ `NOTE_SESSION_TOKEN` は Note.com にログインし直すたびに更新が必要です。
> ⚠️ Starter プランでは環境変数機能（Variables）が使えないため、この方式を採用しています。

## 2. ワークフローのインポート

1. [n8n クラウド](https://takuma1201.app.n8n.cloud/) にログイン
2. 左メニューの **Workflows** → **Add Workflow**
3. 右上の **⋮（3点ドット）** → **Import from File**
4. `n8n/workflows/seiren-note-auto-post.json` を選択

## 3. スケジュールの変更（任意）

インポート後、**毎日9時トリガー** ノードを開いて投稿時刻を変更できます。

## 4. 動作確認（手動実行）

1. ワークフローを開く
2. **Test workflow** ボタンをクリック
3. 各ノードの出力を確認：
   - `ランダムトピック選択` → トピックが選ばれているか
   - `Claude 記事生成` → 記事テキストが返ってきているか
   - `Note.com 投稿` → 200 レスポンスが返ってきているか

## 5. 本番有効化

確認できたら右上の **Inactive** トグルを **Active** に切り替える。

---

## トピック一覧

自動でランダム選択されます：

- 海洋散骨
- お墓じまい
- 粉骨サービス
- 手元供養
- 樹木葬
- 永代供養
- 散骨の法律と注意点
- 終活の始め方

`n8n/workflows/seiren-note-auto-post.json` の **ランダムトピック選択** ノード内の `topics` 配列を編集すればトピックを追加・変更できます。

---

## Note セッショントークンの更新方法

1. Chrome で note.com にログイン
2. DevTools → Application → Cookies → `https://note.com`
3. `_note_session_v5` の値をコピー
4. n8n の環境変数 `NOTE_SESSION_TOKEN` を更新
