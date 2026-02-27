-- ============================================================
-- 001: genres & works
-- ============================================================

-- Extensions
create extension if not exists "pgcrypto";

-- -------------------------------------------------------
-- genres
-- -------------------------------------------------------
create table if not exists genres (
  slug        text        primary key,
  name        text        not null,
  description text,
  cover_path  text,
  priority    int         not null default 100,
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_genres_active_priority
  on genres (is_active, priority);

comment on table genres is 'タトゥージャンルのマスタ';

-- -------------------------------------------------------
-- works
-- -------------------------------------------------------
create table if not exists works (
  id                    uuid        primary key default gen_random_uuid(),
  title                 text        not null,
  description           text,
  auto_genre_slug       text        references genres(slug),
  auto_genre_confidence numeric(3,2),
  final_genre_slug      text        references genres(slug),
  tags                  jsonb       not null default '{}'::jsonb,
  sessions_estimate     int,
  time_estimate_minutes int,
  price_min             int,
  price_max             int,
  is_published          boolean     not null default false,
  published_at          timestamptz,
  is_deleted            boolean     not null default false,
  deleted_at            timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  constraint chk_price_range check (
    price_min is null or price_max is null or price_min <= price_max
  ),
  constraint chk_published_requires_genre check (
    is_published = false or final_genre_slug is not null
  )
);

create index if not exists idx_works_published_created
  on works (is_published, created_at desc);

create index if not exists idx_works_final_genre
  on works (final_genre_slug);

create index if not exists gin_idx_works_tags
  on works using gin (tags);

comment on table works is '作品メタデータと公開制御';
comment on column works.auto_genre_slug is 'AI自動分類結果（参照のみ）';
comment on column works.final_genre_slug is '管理者が確定したジャンル（公開時必須）';
comment on column works.tags is '{ bodyPart:[], size:"", color:[], technique:[] }';

-- -------------------------------------------------------
-- work_images
-- -------------------------------------------------------
create table if not exists work_images (
  id          uuid        primary key default gen_random_uuid(),
  work_id     uuid        not null references works(id) on delete cascade,
  path        text        not null,
  width       int,
  height      int,
  blurhash    text,
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now(),

  constraint uq_work_images_work_path unique (work_id, path)
);

create index if not exists idx_work_images_work_sort
  on work_images (work_id, sort_order);

comment on table work_images is '作品に紐づく画像。Storageの参照メタ。';

-- -------------------------------------------------------
-- Initial genre seed data
-- -------------------------------------------------------
insert into genres (slug, name, priority) values
  ('japanese',       '和彫',              10),
  ('western',        '洋彫',              20),
  ('anime',          'アニメ',            30),
  ('black-and-grey', 'ブラック＆グレー',  40),
  ('traditional',    'トラディショナル',  50),
  ('fine-line',      'ファインライン',    60),
  ('realism',        'リアリズム',        70),
  ('lettering',      'レタリング',        80)
on conflict (slug) do nothing;
