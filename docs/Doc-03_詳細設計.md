# INK ADDICTION LP – 詳細設計 v1.0

受領日: 2026-02-27  
ステータス: 確定

---

## 1. 目的

本書はBasic Designを実装可能レベルまで分解し、API仕様・処理詳細・バリデーション・状態遷移・例外処理・セキュリティ制御を明確化する。

本LPは将来的なTattooBase統合を前提とするため、拡張可能性を損なわない設計とする。

---

## 2. API設計

### 2.1 Public API

#### `POST /api/inquiry`

**目的:** 問い合わせ送信

**Request Body**

| フィールド       | 型      | 必須 | 備考                             |
| ---------------- | ------- | ---- | -------------------------------- |
| `name`           | string  | ✅   |                                  |
| `email`          | string  | ✅   |                                  |
| `phone`          | string  |      | 任意                             |
| `ageConfirmed`   | boolean | ✅   | `true` 必須                      |
| `style`          | string  | ✅   |                                  |
| `placement`      | string  | ✅   |                                  |
| `size`           | string  | ✅   |                                  |
| `color`          | string  | ✅   |                                  |
| `budgetRange`    | string  | ✅   |                                  |
| `preferredSlots` | array   | ✅   |                                  |
| `message`        | string  |      |                                  |
| `uploads`        | array   |      | メタデータのみ、実ファイルは別途 |

**Validation**

- 必須項目チェック
- `ageConfirmed: true` 必須
- uploads: MIME検証
- サイズ上限: 10MB / 1枚
- 1回の送信最大: 5枚

**Response**

| ステータス | 意味                 |
| ---------- | -------------------- |
| `201`      | 送信成功             |
| `400`      | バリデーションエラー |
| `429`      | レート制限           |
| `500`      | 内部エラー           |

**Idempotency:** `idempotency-key` ヘッダ対応

---

#### `GET /api/gallery`

**Query Parameters**

| パラメータ | 型     | 備考          |
| ---------- | ------ | ------------- |
| `genre`    | string |               |
| `bodyPart` | string |               |
| `color`    | string |               |
| `page`     | number |               |
| `limit`    | number | デフォルト 24 |

**Response**

```json
{
  "works": [],
  "total": 0,
  "hasNext": false
}
```

---

#### `GET /api/availability`

**Response:** 公開済みスロットのみ返却

```json
[
  {
    "id": "uuid",
    "startAt": "ISO8601",
    "endAt": "ISO8601"
  }
]
```

---

### 2.2 Admin API

#### `POST /api/admin/work`

| フィールド     | 型     | 備考 |
| -------------- | ------ | ---- |
| `title`        | string |      |
| `description`  | string |      |
| `images`       | files  |      |
| `initialGenre` | string | 任意 |

**処理:**

1. 画像をStorage保存
2. DBにメタ登録
3. 非同期分類ジョブ起動

---

#### `PATCH /api/admin/work/{id}`

| フィールド   | 型      | 備考                                      |
| ------------ | ------- | ----------------------------------------- |
| `finalGenre` | string  |                                           |
| `tags`       | array   |                                           |
| `publish`    | boolean | `finalGenre` 設定済みの場合のみ `true` 可 |

---

#### `POST /api/admin/schedule-import`

| フィールド   | 型   | 備考 |
| ------------ | ---- | ---- |
| `screenshot` | file |      |

**処理:**

1. Storageに保存
2. OCRジョブ起動
3. `extractedSlots` 生成
4. `confidence` 付与

---

#### `POST /api/admin/schedule-approve`

| フィールド | 型    | 備考                 |
| ---------- | ----- | -------------------- |
| `slots`    | array | 承認済みスロット一覧 |

**処理:** `AvailabilitySlots` へinsert、`status = published`

---

#### `PATCH /api/admin/slot/{id}`

- `status` 変更
- `booked` 時は公開から除外

---

#### `PATCH /api/admin/inquiry/{id}`

- `status` 変更
- `internalNotes` 追加

---

## 3. 画像自動分類処理

### 3.1 フロー

```
1) 画像アップロード
2) Worker が Vision API へ送信
3) ラベル取得
4) ジャンルマッピングロジック適用
5) autoGenre 保存
6) confidence 保存
```

### 3.2 ジャンル決定ロジック例

```
"irezumi" or "dragon" or "samurai"          → 和彫
"anime" or "manga"                           → アニメ
"traditional" or "old school"               → トラディショナル
"realistic" or portrait with high detail    → リアリズム
```

`confidence`: 0.0 〜 1.0 で保存

### 3.3 管理画面表示

- `autoGenre` / `finalGenre` を並列表示
- `confidence` 数値表示
- ワンクリック確定ボタン
- 手動変更可能

---

## 4. スクショ解析処理

### 4.1 OCR処理フロー

```
1) 画像前処理（グレースケール・コントラスト強調）
2) OCR テキスト抽出
3) 日付・時間パターン抽出
4) 予定ブロック検出
5) 空き候補生成
```

### 4.2 抽出アルゴリズム基本方針

- 既存予約時間を検出
- 営業時間を設定値から取得
- 予約未占有時間を空き候補とする

### 4.3 信頼度スコア

| 指標                   | 内容                   |
| ---------------------- | ---------------------- |
| OCR一致率              | テキスト認識精度       |
| 時間フォーマット一致度 | 解析パターンの適合度   |
| 重複検出数             | 重複するスロットの検出 |

> `confidence < 0.6` は「要確認」表示

---

## 5. Inquiryステータス設計

### 状態遷移

```
new
  ↓
reviewing
  ↓
waiting_customer
  ↓
quoted
  ↓
scheduled
  ↓
closed

キャンセル時 → cancelled（任意のステータスから遷移可）
```

> **自動返信は `new` 作成時のみ送信する**

---

## 6. バリデーション設計

### 6.1 Inquiry

| フィールド | ルール                                    |
| ---------- | ----------------------------------------- |
| `email`    | 正規表現チェック                          |
| `phone`    | 数字のみ                                  |
| `message`  | 最大1000文字                              |
| `uploads`  | MIME whitelist（JPEG / PNG / WebP / PDF） |

### 6.2 Work

| ルール       | 詳細                   |
| ------------ | ---------------------- |
| `title`      | 必須                   |
| 画像         | 最低1枚必須            |
| `finalGenre` | 未設定の場合、公開不可 |

---

## 7. セキュリティ設計

| 項目             | 内容                                    |
| ---------------- | --------------------------------------- |
| Admin API認証    | JWT必須                                 |
| RLS（Supabase）  | adminのみ write / public は select のみ |
| ファイルアクセス | 署名URL（Signed URL）経由のみ           |

---

## 8. レート制限

| エンドポイント      | 制限                   |
| ------------------- | ---------------------- |
| `POST /api/inquiry` | 1IP あたり 5回 / 10分  |
| upload系            | 1IP あたり 20MB / 10分 |

---

## 9. エラーハンドリング

### 9.1 Inquiry

| エラー         | 対応                  |
| -------------- | --------------------- |
| DB保存失敗     | retry 3回             |
| メール送信失敗 | ログ保存 + 再送キュー |

### 9.2 スクショ解析失敗

- 管理画面に失敗通知を表示
- 手動入力UIへ誘導

---

## 10. ロギング設計

| ログ種別           | 内容         |
| ------------------ | ------------ |
| admin action log   | 管理者操作   |
| inquiry送信ログ    | 送信イベント |
| classificationログ | 自動分類結果 |
| OCR失敗ログ        | 解析エラー   |

**保持期間:** 180日

---

## 11. パフォーマンス設計

| 項目               | 方針                            |
| ------------------ | ------------------------------- |
| 画像読み込み       | 段階読み込み（サムネ → 高解像） |
| ギャラリー取得件数 | 1回あたり limit 24件            |
| 初期表示           | SSR（Server Side Rendering）    |
| 管理画面テーブル   | サーバーサイドページネーション  |

---

## 12. 将来拡張余地

- 作品お気に入り機能
- CRM連携
- Stripe デポジット
- 多言語化
- TattooBase統合

---

## 13. テスト観点（抜粋）

- 自動分類の誤判定時の修正フロー確認
- スクショ誤認識時の承認UI確認
- 添付ファイル異常値（不正MIME・サイズ超過）
- 二重送信防止（同一idempotency-key）
- RLS突破不可確認

---

## 14. 実装禁止事項

> [!CAUTION]
> 以下は実装段階でいかなる理由があっても行ってはならない。

- 自動予約確定
- `autoGenre` の自動公開
- OCR結果の即時公開
- 管理者未承認データの公開
