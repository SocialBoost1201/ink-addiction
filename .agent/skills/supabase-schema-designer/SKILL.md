---
name: supabase-schema-designer
description: Supabase DBのスキーマ設計・リレーション構築を行う。
---

# supabase-schema-designer: Supabaseスキーマ設計

Supabase (PostgreSQL) のテーブル設計・RLS・リレーションを設計する。

## 設計原則

- UUID を主キーとして使用する（`gen_random_uuid()`）
- `created_at` / `updated_at` を全テーブルに付ける
- soft delete は `deleted_at` カラムで管理する
- RLS を全テーブルに設定する

## RLSテンプレート

```sql
-- 自分のデータのみ参照
create policy "users can view own data"
  on table_name for select
  using (auth.uid() = user_id);
```

## チェックリスト

- [ ] 全テーブルにRLSポリシーが設定されているか
- [ ] インデックスが適切に設定されているか
- [ ] 必要なリレーションのFKが設定されているか
