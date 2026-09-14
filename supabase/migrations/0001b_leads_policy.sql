-- =============================================================================
-- 0001b_leads_policy.sql — Hoàn thiện Nhóm 1 (mục C/D): bảng leads + policy_documents
-- Bổ sung sau 0001_auth_foundation.sql. Apply: supabase db push
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. ENUM
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'lead_status') then
    create type public.lead_status as enum ('new', 'contacting', 'closed', 'unreachable');
  end if;
  if not exists (select 1 from pg_type where typname = 'lead_source') then
    create type public.lead_source as enum (
      'landing_hero', 'cta_after_hero', 'cta_after_steps', 'cta_after_instructor', 'manual_hotline'
    );
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 2. HÀM normalize_phone
-- ---------------------------------------------------------------------------
create or replace function public.normalize_phone(raw text)
returns text
language sql
immutable
as $$
  select case
    when raw is null then ''
    when regexp_replace(raw, '[\s().-]', '', 'g') like '+84%'
      then '0' || substr(regexp_replace(raw, '[\s().-]', '', 'g'), 4)
    when regexp_replace(raw, '[\s().-]', '', 'g') like '84%'
         and length(regexp_replace(raw, '[\s().-]', '', 'g')) = 11
      then '0' || substr(regexp_replace(raw, '[\s().-]', '', 'g'), 3)
    else regexp_replace(raw, '[\s().-]', '', 'g')
  end
$$;

-- ---------------------------------------------------------------------------
-- 3. BẢNG leads
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id               uuid primary key default gen_random_uuid(),
  full_name        text not null,
  phone            text not null,
  phone_normalized text not null,
  email            text,
  course_interest  text,
  current_level    text,
  learning_need    text,
  source           public.lead_source not null,
  status           public.lead_status not null default 'new',
  consent          boolean not null,
  consent_version  text not null,
  consent_at       timestamptz not null,
  assigned_to      uuid references public.profiles (id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint leads_consent_true      check (consent = true),
  constraint leads_full_name_len     check (char_length(full_name) between 2 and 120),
  constraint leads_learning_need_len check (learning_need is null or char_length(learning_need) <= 2000),
  constraint leads_phone_norm_fmt    check (phone_normalized ~ '^0(3|5|7|8|9)[0-9]{8}$'),
  constraint leads_email_fmt         check (email is null or email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$')
);

create index if not exists leads_phone_normalized_idx on public.leads (phone_normalized);
create index if not exists leads_status_idx           on public.leads (status);
create index if not exists leads_assigned_to_idx      on public.leads (assigned_to);
create index if not exists leads_created_at_idx       on public.leads (created_at desc);

-- BEFORE INSERT: set phone_normalized (validate qua CHECK ở trên)
create or replace function public.leads_before_insert()
returns trigger
language plpgsql
as $$
begin
  new.phone_normalized := public.normalize_phone(new.phone);
  new.full_name := btrim(new.full_name);
  if new.email is not null then new.email := nullif(btrim(new.email), ''); end if;
  return new;
end;
$$;

drop trigger if exists leads_before_insert on public.leads;
create trigger leads_before_insert
  before insert on public.leads
  for each row execute function public.leads_before_insert();

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 4. BẢNG policy_documents
-- ---------------------------------------------------------------------------
create table if not exists public.policy_documents (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null,
  version      text not null,
  title        text not null,
  body_md      text not null,
  is_current   boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now()
);

-- 1 bản "current" / slug
create unique index if not exists policy_documents_current_uniq
  on public.policy_documents (slug) where is_current;

-- Seed bản data-privacy (NỘI DUNG TẠM)
insert into public.policy_documents (slug, version, title, body_md, is_current, published_at)
values (
  'data-privacy',
  '0.1-draft',
  'Chính sách bảo vệ dữ liệu cá nhân',
  E'> **NỘI DUNG TẠM — CHƯA PHẢI BẢN CHÍNH THỨC.**\n\n## 1. Thông tin chúng tôi thu thập\nHọ tên, số điện thoại, email (nếu có), khóa học quan tâm, trình độ hiện tại và nhu cầu học tập do bạn cung cấp.\n\n## 2. Mục đích sử dụng\nLiên hệ tư vấn lộ trình học; gửi thông tin khóa học/ưu đãi bạn quan tâm; cải thiện dịch vụ.\n\n## 3. Chia sẻ thông tin\nChúng tôi không bán hoặc cho thuê thông tin cá nhân. Chỉ chia sẻ nội bộ với đội tư vấn và đơn vị hạ tầng kỹ thuật.\n\n## 4. Lưu trữ và bảo mật\nDữ liệu lưu trên hạ tầng có mã hoá và kiểm soát truy cập, trong thời gian cần thiết hoặc tới khi bạn yêu cầu xoá.\n\n## 5. Quyền của bạn\nBạn có quyền xem, sửa, xoá thông tin và rút lại đồng ý bất cứ lúc nào.\n\n## 6. Liên hệ\nLiên hệ hotline/email ở chân trang.',
  true,
  now()
)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- 5. RLS
-- ---------------------------------------------------------------------------
alter table public.leads             enable row level security;
alter table public.policy_documents  enable row level security;

-- leads: KHÔNG cấp INSERT trực tiếp cho anon (chỉ Edge Function service_role).
--        authenticated đọc/sửa khi role cskh/super_admin (marketing KHÔNG thấy lead).
drop policy if exists leads_select_cs on public.leads;
create policy leads_select_cs on public.leads
  for select to authenticated
  using ((select public.current_app_role()) in ('cskh', 'super_admin'));

drop policy if exists leads_update_cs on public.leads;
create policy leads_update_cs on public.leads
  for update to authenticated
  using ((select public.current_app_role()) in ('cskh', 'super_admin'))
  with check ((select public.current_app_role()) in ('cskh', 'super_admin'));

grant select, update on public.leads to authenticated;

-- policy_documents: anon đọc bản is_current; marketing/super_admin toàn quyền (UI ở Nhóm 4).
drop policy if exists policy_docs_read_current on public.policy_documents;
create policy policy_docs_read_current on public.policy_documents
  for select to anon, authenticated
  using (is_current);

drop policy if exists policy_docs_write on public.policy_documents;
create policy policy_docs_write on public.policy_documents
  for all to authenticated
  using ((select public.current_app_role()) in ('marketing', 'super_admin'))
  with check ((select public.current_app_role()) in ('marketing', 'super_admin'));

grant select on public.policy_documents to anon, authenticated;
grant insert, update, delete on public.policy_documents to authenticated;
