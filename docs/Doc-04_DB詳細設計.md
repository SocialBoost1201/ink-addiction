# INK ADDICTION LP – DB詳細設計 v1.0

受領日: 2026-02-27  
ステータス: 確定

---

## 1. 目的と方針

本書は、INK ADDICTION LP のデータモデルを実装可能な粒度で定義する。  
予約空き枠とギャラリーは運用事故が起きやすいため、**非破壊設計・監査性・誤公開防止**を最優先とする。

### 基本方針

| 方針         | 内容                                    |
| ------------ | --------------------------------------- |
| ファイル管理 | 実ファイルはStorage、参照メタはDB       |
| 自動推定     | 保持するが、公開値は必ず管理者の確定値  |
| 削除         | 原則ソフト削除                          |
| 監査         | 重要操作は監査ログ必須                  |
| 権限         | Publicは読み取り専用、Adminのみ書き込み |

---

## 2. テーブル一覧

| テーブル名             | 用途                                  |
| ---------------------- | ------------------------------------- |
| `genres`               | ジャンル正規化・表示順制御            |
| `works`                | 作品メタデータと公開制御              |
| `work_images`          | 作品に紐づく画像管理                  |
| `work_tags`            | タグ（任意。jsonb運用でも可）         |
| `schedule_screenshots` | スクショ原本と抽出結果・承認履歴      |
| `availability_slots`   | 公開可能な空き枠管理                  |
| `inquiries`            | 問い合わせ本体                        |
| `inquiry_uploads`      | 問い合わせ添付ファイル                |
| `admin_audit_logs`     | 重要操作の追跡                        |
| `settings`             | SNSリンク・制限値・営業時間等の運用値 |
| `email_outbox`         | 自動返信・通知の再送キュー（推奨）    |

---

## 3. 各テーブル詳細

### 3.1 `genres`

**目的:** ジャンルの正規化と表示順制御

```sql
slug              text        PK
name              text        NOT NULL
description       text        NULL
cover_path        text        NULL
priority          int         NOT NULL DEFAULT 100   -- 小さいほど上位表示
is_active         boolean     NOT NULL DEFAULT true
created_at        timestamptz NOT NULL DEFAULT now()
updated_at        timestamptz NOT NULL DEFAULT now()
```

**Indexes:** `idx_genres_active_priority (is_active, priority)`

---

### 3.2 `works`

**目的:** 作品のメタデータと公開制御

```sql
id                      uuid        PK DEFAULT gen_random_uuid()
title                   text        NOT NULL
description             text        NULL
auto_genre_slug         text        NULL REFERENCES genres(slug)
auto_genre_confidence   numeric(3,2) NULL
final_genre_slug        text        NULL REFERENCES genres(slug)
tags                    jsonb       NOT NULL DEFAULT '{}'
sessions_estimate       int         NULL
time_estimate_minutes   int         NULL
price_min               int         NULL
price_max               int         NULL
is_published            boolean     NOT NULL DEFAULT false
published_at            timestamptz NULL
is_deleted              boolean     NOT NULL DEFAULT false
deleted_at              timestamptz NULL
created_at              timestamptz NOT NULL DEFAULT now()
updated_at              timestamptz NOT NULL DEFAULT now()
```

**Constraints**

- `is_published = true` の場合 `final_genre_slug IS NOT NULL`（トリガまたはアプリ側で保証）
- `price_min <= price_max`（両方存在時）

**Indexes**

```
idx_works_published_created  (is_published, created_at DESC)
idx_works_final_genre        (final_genre_slug)
gin_idx_works_tags           (tags) USING GIN
```

> **Notes:** `tags` の形式例: `{ bodyPart:[], size:"", color:[], technique:[] }`

---

### 3.3 `work_images`

**目的:** 作品に紐づく画像の管理

```sql
id          uuid        PK DEFAULT gen_random_uuid()
work_id     uuid        NOT NULL REFERENCES works(id) ON DELETE CASCADE
path        text        NOT NULL
width       int         NULL
height      int         NULL
blurhash    text        NULL
sort_order  int         NOT NULL DEFAULT 0
created_at  timestamptz NOT NULL DEFAULT now()
```

**Constraints:** `UNIQUE(work_id, path)`  
**Indexes:** `idx_work_images_work_sort (work_id, sort_order)`

---

### 3.4 `schedule_screenshots`

**目的:** 予約表スクショ原本と抽出結果の保存、承認履歴

```sql
id                  uuid        PK DEFAULT gen_random_uuid()
path                text        NOT NULL
extracted_payload   jsonb       NULL
extracted_at        timestamptz NULL
extraction_status   text        NOT NULL DEFAULT 'pending'
  -- allowed: pending | processing | success | failed
failure_reason      text        NULL
approved_by         uuid        NULL
approved_at         timestamptz NULL
created_at          timestamptz NOT NULL DEFAULT now()
```

**Indexes:** `idx_schedule_screenshots_status_created (extraction_status, created_at DESC)`

---

### 3.5 `availability_slots`

**目的:** 公開可能な空き枠を管理する

```sql
id             uuid        PK DEFAULT gen_random_uuid()
start_at       timestamptz NOT NULL
end_at         timestamptz NOT NULL
status         text        NOT NULL DEFAULT 'draft'
  -- allowed: draft | published | hidden | booked | tentative
source         text        NOT NULL DEFAULT 'manual'
  -- allowed: screenshot | manual
screenshot_id  uuid        NULL REFERENCES schedule_screenshots(id)
confidence     numeric(3,2) NULL
note           text        NULL
created_by     uuid        NULL
created_at     timestamptz NOT NULL DEFAULT now()
updated_at     timestamptz NOT NULL DEFAULT now()
```

**Constraints**

- `start_at < end_at`
- `status = 'published'` は管理者承認を経たもののみ（アプリ側＋監査ログで保証）
- 同一時間帯の重複防止: アプリ側で overlap チェック（または排他制約を検討）

**Indexes**

```
idx_slots_status_start    (status, start_at)
idx_slots_published_start (start_at) WHERE status='published'
idx_slots_screenshot      (screenshot_id)
```

> **Notes:** v1では `booked` は管理者が手動付与。将来的な予約DB化時は `bookings` テーブルを追加。

---

### 3.6 `inquiries`

**目的:** 問い合わせの本体

```sql
id                uuid        PK DEFAULT gen_random_uuid()
name              text        NOT NULL
email             text        NOT NULL
phone             text        NULL
contact_pref      text        NOT NULL DEFAULT 'email'
  -- allowed: email | phone | instagram
age_confirmed     boolean     NOT NULL
style_pref        text        NOT NULL
placement         text        NOT NULL
size              text        NOT NULL
color_pref        text        NOT NULL
budget_range      text        NOT NULL
preferred_windows jsonb       NOT NULL DEFAULT '[]'
message           text        NULL
status            text        NOT NULL DEFAULT 'new'
  -- allowed: new | reviewing | waiting_customer | quoted | scheduled | closed | cancelled
internal_notes    text        NULL
created_at        timestamptz NOT NULL DEFAULT now()
updated_at        timestamptz NOT NULL DEFAULT now()
```

**Indexes**

```
idx_inquiries_status_created    (status, created_at DESC)
idx_inquiries_email_created     (email, created_at DESC)
gin_idx_inquiries_preferred     (preferred_windows) USING GIN
```

> **Notes:** `preferred_windows` は `slotId` 優先。将来の予約確定に向け `slotId` 保持を推奨。

---

### 3.7 `inquiry_uploads`

**目的:** 問い合わせに紐づく添付

```sql
id           uuid        PK DEFAULT gen_random_uuid()
inquiry_id   uuid        NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE
path         text        NOT NULL
mime         text        NOT NULL
size_bytes   int         NOT NULL
created_at   timestamptz NOT NULL DEFAULT now()
```

**Indexes:** `idx_inquiry_uploads_inquiry (inquiry_id)`

---

### 3.8 `admin_audit_logs`

**目的:** 重要操作の追跡

```sql
id              uuid        PK DEFAULT gen_random_uuid()
admin_user_id   uuid        NOT NULL
action          text        NOT NULL
entity_type     text        NOT NULL
entity_id       text        NOT NULL
payload         jsonb       NOT NULL DEFAULT '{}'
created_at      timestamptz NOT NULL DEFAULT now()
```

**Indexes**

```
idx_audit_created (created_at DESC)
idx_audit_entity  (entity_type, entity_id)
```

**必須記録アクション**

| 対象     | アクション                                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------------- |
| Work     | `work_create` / `work_publish` / `work_unpublish` / `work_delete` / `work_genre_override` / `work_tags_update` |
| Schedule | `screenshot_upload` / `screenshot_extract_success` / `screenshot_extract_failed`                               |
| Slot     | `slot_publish` / `slot_hide` / `slot_booked` / `slot_edit`                                                     |
| Inquiry  | `inquiry_status_change` / `inquiry_note_update`                                                                |
| Settings | `settings_update`                                                                                              |

---

### 3.9 `settings`

**目的:** SNSリンクやポリシー、制限値、営業時間などの運用値をDBで管理

```sql
key         text    PK
value       jsonb   NOT NULL
updated_by  uuid    NULL
updated_at  timestamptz NOT NULL DEFAULT now()
```

**管理キー例**

```
sns.instagram_url
sns.tiktok_url
business.open_hours
inquiry.upload.max_files
inquiry.upload.max_size_mb
availability.slot_min_minutes
legal.cancellation_policy
legal.privacy_policy
```

---

### 3.10 `email_outbox`（任意だが推奨）

**目的:** 自動返信・管理者通知の再送、失敗可視化

```sql
id                   uuid        PK DEFAULT gen_random_uuid()
kind                 text        NOT NULL
  -- allowed: inquiry_auto_reply | admin_notification
to_email             text        NOT NULL
subject              text        NOT NULL
body                 text        NOT NULL
status               text        NOT NULL DEFAULT 'pending'
  -- allowed: pending | sent | failed
failure_reason       text        NULL
related_entity_type  text        NULL
related_entity_id    text        NULL
created_at           timestamptz NOT NULL DEFAULT now()
sent_at              timestamptz NULL
```

**Indexes:** `idx_outbox_status_created (status, created_at DESC)`

---

## 4. Row Level Security（RLS）方針

### 4.1 Public Policies

| テーブル             | ポリシー                                                 |
| -------------------- | -------------------------------------------------------- |
| `genres`             | `is_active = true` のみ SELECT                           |
| `works`              | `is_published = true AND is_deleted = false` のみ SELECT |
| `work_images`        | Publicな `works` に紐づく場合のみ SELECT                 |
| `availability_slots` | `status = 'published'` のみ SELECT                       |

### 4.2 Admin Policies

- allowlist 方式で admin 判定
- admin のみ INSERT / UPDATE / DELETE（削除はソフト削除推奨）

### 4.3 Storage Policies

| 対象               | ポリシー                          |
| ------------------ | --------------------------------- |
| 作品画像（公開用） | 公開バケット、または署名URL       |
| 問い合わせ添付     | 非公開。管理画面から署名URLで閲覧 |
| スクショ原本       | 非公開。管理画面からのみ閲覧      |

---

## 5. インデックスと最適化

- `works` の検索は `tags` GIN + `final_genre` インデックスを併用
- `availability_slots` は `published` の部分インデックスを必須
- `inquiries` は `status, created_at` での運用が基本

---

## 6. データ保持と削除

- 問い合わせ添付は保持期間をポリシー化し、期限後に削除可能
- 削除時は Storage ファイルも連動削除（バッチ）
- 監査ログは原則削除しない

---

## 7. マイグレーション方針

| ルール         | 内容                         |
| -------------- | ---------------------------- |
| 破壊的変更     | 禁止                         |
| 新規追加       | create-only                  |
| enum追加       | `ADD VALUE` のみ             |
| 既存カラム削除 | 行わず `deprecated` フラグ化 |

---

## 8. 将来拡張の設計余地

- `bookings` テーブル追加で予約確定をDB化
- `customers` テーブル追加でCRM化
- artists 複数対応
- multi-studio 対応（TattooBase統合）
- `reviews` テーブル追加

---

## 9. 受け入れ基準

| 基準           | 内容                           |
| -------------- | ------------------------------ |
| 公開作品       | `final_genre` を必ず持つ       |
| OCR抽出結果    | 承認しない限り公開されない     |
| Publicアクセス | 書き込み不可                   |
| 問い合わせ添付 | 公開導線から直接閲覧不可       |
| 監査ログ       | 必須アクションで必ず記録される |
