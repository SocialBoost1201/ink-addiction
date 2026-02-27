-- ============================================================
-- 004: admin_audit_logs / settings / email_outbox
-- ============================================================

-- -------------------------------------------------------
-- admin_audit_logs
-- -------------------------------------------------------
create table if not exists admin_audit_logs (
  id                   uuid        primary key default gen_random_uuid(),
  admin_user_id        uuid        not null,
  action               text        not null,
  entity_type          text        not null,
  entity_id            text        not null,
  payload              jsonb       not null default '{}'::jsonb,
  approval_actor_role  text,
  approval_timestamp   timestamptz,
  created_at           timestamptz not null default now()
);

create index if not exists idx_audit_created
  on admin_audit_logs (created_at desc);

create index if not exists idx_audit_entity
  on admin_audit_logs (entity_type, entity_id);

comment on table admin_audit_logs is '重要操作の追跡。削除不可・最低180日保持。';
comment on column admin_audit_logs.action is
  'work_create | work_publish | work_unpublish | work_delete | work_genre_override | work_tags_update
   | screenshot_upload | screenshot_extract_success | screenshot_extract_failed
   | slot_publish | slot_hide | slot_booked | slot_edit
   | inquiry_status_change | inquiry_note_update | settings_update';
comment on column admin_audit_logs.payload is 'before_value / after_value を含む変更差分';

-- -------------------------------------------------------
-- settings
-- -------------------------------------------------------
create table if not exists settings (
  key        text        primary key,
  value      jsonb       not null,
  updated_by uuid,
  updated_at timestamptz not null default now()
);

comment on table settings is 'SNSリンク・ポリシー・制限値・営業時間などの運用値をDBで管理';

-- Initial settings seed
insert into settings (key, value) values
  ('sns.instagram_url',            '"https://www.instagram.com/"'::jsonb),
  ('sns.tiktok_url',               '"https://www.tiktok.com/"'::jsonb),
  ('business.open_hours',          '"10:00-20:00"'::jsonb),
  ('inquiry.upload.max_files',     '5'::jsonb),
  ('inquiry.upload.max_size_mb',   '10'::jsonb),
  ('availability.slot_min_minutes','60'::jsonb),
  ('legal.cancellation_policy',    '"キャンセルポリシーをここに記載してください。"'::jsonb),
  ('legal.privacy_policy',         '"プライバシーポリシーをここに記載してください。"'::jsonb)
on conflict (key) do nothing;

-- -------------------------------------------------------
-- email_outbox
-- -------------------------------------------------------
create table if not exists email_outbox (
  id                   uuid        primary key default gen_random_uuid(),
  kind                 text        not null
    constraint chk_email_kind check (
      kind in ('inquiry_auto_reply', 'admin_notification')
    ),
  to_email             text        not null,
  subject              text        not null,
  body                 text        not null,
  status               text        not null default 'pending'
    constraint chk_email_status check (
      status in ('pending', 'sent', 'failed')
    ),
  failure_reason       text,
  related_entity_type  text,
  related_entity_id    text,
  created_at           timestamptz not null default now(),
  sent_at              timestamptz
);

create index if not exists idx_outbox_status_created
  on email_outbox (status, created_at desc);

comment on table email_outbox is '自動返信・管理者通知の再送キュー。送信失敗を可視化する。';
