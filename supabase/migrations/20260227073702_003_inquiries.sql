-- ============================================================
-- 003: inquiries & inquiry_uploads
-- ============================================================

-- -------------------------------------------------------
-- inquiries
-- -------------------------------------------------------
create table if not exists inquiries (
  id                uuid        primary key default gen_random_uuid(),
  name              text        not null,
  email             text        not null,
  phone             text,
  contact_pref      text        not null default 'email'
    constraint chk_contact_pref check (
      contact_pref in ('email', 'phone', 'instagram')
    ),
  age_confirmed     boolean     not null,
  style_pref        text        not null,
  placement         text        not null,
  size              text        not null,
  color_pref        text        not null,
  budget_range      text        not null,
  preferred_windows jsonb       not null default '[]'::jsonb,
  message           text,
  status            text        not null default 'new'
    constraint chk_inquiry_status check (
      status in (
        'new', 'reviewing', 'waiting_customer',
        'quoted', 'scheduled', 'closed', 'cancelled'
      )
    ),
  internal_notes    text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  constraint chk_age_confirmed check (age_confirmed = true)
);

create index if not exists idx_inquiries_status_created
  on inquiries (status, created_at desc);

create index if not exists idx_inquiries_email_created
  on inquiries (email, created_at desc);

create index if not exists gin_idx_inquiries_preferred
  on inquiries using gin (preferred_windows);

comment on table inquiries is '問い合わせ本体';
comment on column inquiries.preferred_windows is 'slotId優先。無ければ{ date, timeRange }を許容。';
comment on column inquiries.internal_notes is '管理者の内部メモ。ユーザーには非公開。';

-- -------------------------------------------------------
-- inquiry_uploads
-- -------------------------------------------------------
create table if not exists inquiry_uploads (
  id          uuid        primary key default gen_random_uuid(),
  inquiry_id  uuid        not null references inquiries(id) on delete cascade,
  path        text        not null,
  mime        text        not null,
  size_bytes  int         not null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_inquiry_uploads_inquiry
  on inquiry_uploads (inquiry_id);

comment on table inquiry_uploads is '問い合わせ添付ファイル。Storageの参照メタ。非公開バケット。';
