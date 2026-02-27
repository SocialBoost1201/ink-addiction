-- ============================================================
-- 002: schedule_screenshots & availability_slots
-- ============================================================

-- -------------------------------------------------------
-- schedule_screenshots
-- -------------------------------------------------------
create table if not exists schedule_screenshots (
  id                 uuid        primary key default gen_random_uuid(),
  path               text        not null,
  extracted_payload  jsonb,
  extracted_at       timestamptz,
  extraction_status  text        not null default 'pending'
    constraint chk_extraction_status check (
      extraction_status in ('pending', 'processing', 'success', 'failed')
    ),
  failure_reason     text,
  approved_by        uuid,
  approved_at        timestamptz,
  created_at         timestamptz not null default now()
);

create index if not exists idx_schedule_screenshots_status_created
  on schedule_screenshots (extraction_status, created_at desc);

comment on table schedule_screenshots is 'スクショ原本と抽出結果・承認履歴';
comment on column schedule_screenshots.extracted_payload is 'OCRで抽出した候補スロットのJSONArray';

-- -------------------------------------------------------
-- availability_slots
-- -------------------------------------------------------
create table if not exists availability_slots (
  id            uuid        primary key default gen_random_uuid(),
  start_at      timestamptz not null,
  end_at        timestamptz not null,
  status        text        not null default 'draft'
    constraint chk_slot_status check (
      status in ('draft', 'published', 'hidden', 'booked', 'tentative')
    ),
  source        text        not null default 'manual'
    constraint chk_slot_source check (
      source in ('screenshot', 'manual')
    ),
  screenshot_id uuid        references schedule_screenshots(id),
  confidence    numeric(3,2),
  note          text,
  created_by    uuid,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint chk_slot_time check (start_at < end_at)
);

create index if not exists idx_slots_status_start
  on availability_slots (status, start_at);

create index if not exists idx_slots_published_start
  on availability_slots (start_at)
  where status = 'published';

create index if not exists idx_slots_screenshot
  on availability_slots (screenshot_id);

comment on table availability_slots is '公開可能な空き枠。statusがpublishedのもののみPublicに表示。';
comment on column availability_slots.status is 'draft | published | hidden | booked | tentative';
comment on column availability_slots.source is 'screenshot: OCR由来 / manual: 手動入力';
