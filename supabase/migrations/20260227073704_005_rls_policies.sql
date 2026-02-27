-- ============================================================
-- 005: Row Level Security (RLS) policies
-- ============================================================
-- 方針:
--   Public: SELECT のみ、条件付き
--   Admin : INSERT / UPDATE / DELETE は auth.uid() 判定
--   Admin 判定: settings の allowlist を引くか、
--               将来的には auth.users のカスタムクレームで管理
--
-- v1 暫定方針:
--   - Public 系テーブルは匿名ユーザーから読み取り可能な行のみ許可
--   - Admin 操作は anon ロールでは禁止
--   - Service Role Key を使うバックエンド（API Routes）のみ書き込み可能
-- ============================================================

-- -------------------------------------------------------
-- genres: is_active=true のみ public 閲覧可
-- -------------------------------------------------------
alter table genres enable row level security;

create policy "public read active genres"
  on genres for select
  to anon, authenticated
  using (is_active = true);

-- -------------------------------------------------------
-- works: is_published=true and is_deleted=false のみ public 閲覧可
-- -------------------------------------------------------
alter table works enable row level security;

create policy "public read published works"
  on works for select
  to anon, authenticated
  using (is_published = true and is_deleted = false);

-- -------------------------------------------------------
-- work_images: public works に紐づくもののみ public 閲覧可
-- -------------------------------------------------------
alter table work_images enable row level security;

create policy "public read work images"
  on work_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from works w
      where w.id = work_images.work_id
        and w.is_published = true
        and w.is_deleted = false
    )
  );

-- -------------------------------------------------------
-- availability_slots: status='published' のみ public 閲覧可
-- -------------------------------------------------------
alter table availability_slots enable row level security;

create policy "public read published slots"
  on availability_slots for select
  to anon, authenticated
  using (status = 'published');

-- -------------------------------------------------------
-- schedule_screenshots: Public アクセス不可
-- -------------------------------------------------------
alter table schedule_screenshots enable row level security;
-- policy なし = 全ロールで拒否（service_role のみ操作可能）

-- -------------------------------------------------------
-- inquiries: Public は insert のみ（送信用）。取得・更新は不可。
-- -------------------------------------------------------
alter table inquiries enable row level security;

create policy "public insert inquiry"
  on inquiries for insert
  to anon, authenticated
  with check (true);

-- -------------------------------------------------------
-- inquiry_uploads: Public アクセス不可
-- -------------------------------------------------------
alter table inquiry_uploads enable row level security;
-- service_role からのみ操作可能

-- -------------------------------------------------------
-- admin_audit_logs: Public アクセス不可
-- -------------------------------------------------------
alter table admin_audit_logs enable row level security;
-- service_role からのみ操作可能

-- -------------------------------------------------------
-- settings: 全ユーザー SELECT 可（SNSリンク等の表示に使用）
-- -------------------------------------------------------
alter table settings enable row level security;

create policy "public read settings"
  on settings for select
  to anon, authenticated
  using (true);

-- -------------------------------------------------------
-- email_outbox: Public アクセス不可
-- -------------------------------------------------------
alter table email_outbox enable row level security;
-- service_role からのみ操作可能
