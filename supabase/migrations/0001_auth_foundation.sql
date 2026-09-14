-- =============================================================================
-- 0001_auth_foundation.sql  —  Nhóm 1 / Module Auth (14.1, 14.2)
-- Phạm vi: enum vai trò, bảng profiles + audit_log, hàm/trigger, RLS.
-- KHÔNG bao gồm: leads, policy_documents, error_log (thuộc các mục C/D/E — làm sau).
--
-- Apply:  supabase db push   (hoặc dán vào SQL Editor của project hrbibbadjrimkyhbvyov)
-- Sau khi apply: tạo 3 user test qua Dashboard > Authentication > Add user, đặt
--   "User Metadata" = { "role": "super_admin" } / "marketing" / "cskh" và
--   "full_name". Trigger sẽ tự tạo bản ghi profiles tương ứng.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. ENUM
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('super_admin', 'marketing', 'cskh');
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 2. BẢNG profiles  (1–1 với auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text not null default '',
  role        public.app_role not null default 'cskh',
  is_active   boolean not null default true,
  created_by  uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint profiles_full_name_len check (char_length(full_name) <= 120)
);

comment on table public.profiles is 'Hồ sơ nội bộ 1–1 với auth.users: vai trò + trạng thái hoạt động.';

create index if not exists profiles_role_idx       on public.profiles (role);
create index if not exists profiles_created_by_idx on public.profiles (created_by);
-- Phục vụ guard_last_super_admin (đếm super_admin đang hoạt động)
create index if not exists profiles_active_super_admin_idx
  on public.profiles (role) where is_active and role = 'super_admin';

-- ---------------------------------------------------------------------------
-- 3. BẢNG audit_log  (ghi vết thao tác tài khoản — dùng lại cho Module 16 sau)
-- ---------------------------------------------------------------------------
create table if not exists public.audit_log (
  id         bigint generated always as identity primary key,
  actor_id   uuid references auth.users (id) on delete set null,
  action     text not null,
  entity     text not null,
  entity_id  text,
  diff       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_log_actor_id_idx   on public.audit_log (actor_id);
create index if not exists audit_log_entity_idx      on public.audit_log (entity, entity_id);
create index if not exists audit_log_created_at_idx  on public.audit_log (created_at desc);

-- ---------------------------------------------------------------------------
-- 4. HÀM & TRIGGER
-- ---------------------------------------------------------------------------

-- 4.1 current_app_role(): vai trò của user đang gọi. SECURITY DEFINER để RLS
--     policy đọc được profiles mà không đệ quy vào chính RLS của profiles.
create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = ''
as $$
  select p.role
  from public.profiles p
  where p.id = (select auth.uid())
    and p.is_active
$$;

revoke execute on function public.current_app_role() from public, anon;
grant execute on function public.current_app_role() to authenticated, service_role;

-- 4.2 set_updated_at(): trigger dùng chung
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- 4.3 handle_new_user(): tự tạo profiles khi có user mới trong auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta_role text := nullif(new.raw_user_meta_data ->> 'role', '');
  resolved_role public.app_role;
begin
  begin
    resolved_role := coalesce(meta_role, 'cskh')::public.app_role;
  exception when invalid_text_representation then
    resolved_role := 'cskh';
  end;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    resolved_role
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4.4 guard_last_super_admin(): chặn đưa số Super Admin đang hoạt động về 0
create or replace function public.guard_last_super_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  remaining int;
begin
  -- Chỉ quan tâm khi bản ghi cũ là super_admin đang hoạt động và thao tác
  -- làm mất trạng thái đó (xoá, khoá, hoặc đổi vai trò).
  if old.role = 'super_admin' and old.is_active
     and (
       tg_op = 'DELETE'
       or new.role <> 'super_admin'
       or new.is_active = false
     )
  then
    select count(*) into remaining
    from public.profiles
    where role = 'super_admin' and is_active and id <> old.id;

    if remaining = 0 then
      raise exception 'Không thể thao tác: hệ thống phải luôn còn ít nhất 1 Super Admin đang hoạt động.'
        using errcode = 'check_violation';
    end if;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_last_super_admin on public.profiles;
create trigger profiles_guard_last_super_admin
  before update or delete on public.profiles
  for each row execute function public.guard_last_super_admin();

-- ---------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------
alter table public.profiles  enable row level security;
alter table public.audit_log enable row level security;

-- 5.1 profiles ------------------------------------------------------------
-- Đọc hồ sơ của chính mình
drop policy if exists profiles_select_self on public.profiles;
create policy profiles_select_self on public.profiles
  for select to authenticated
  using (id = (select auth.uid()));

-- Super Admin: toàn quyền trên mọi hồ sơ
drop policy if exists profiles_select_super_admin on public.profiles;
create policy profiles_select_super_admin on public.profiles
  for select to authenticated
  using ((select public.current_app_role()) = 'super_admin');

drop policy if exists profiles_insert_super_admin on public.profiles;
create policy profiles_insert_super_admin on public.profiles
  for insert to authenticated
  with check ((select public.current_app_role()) = 'super_admin');

drop policy if exists profiles_update_super_admin on public.profiles;
create policy profiles_update_super_admin on public.profiles
  for update to authenticated
  using ((select public.current_app_role()) = 'super_admin')
  with check ((select public.current_app_role()) = 'super_admin');

-- Không cấp DELETE cho bất kỳ role nào qua API — chỉ Edge Function (service_role)
-- và service_role bỏ qua RLS.

-- 5.2 audit_log ---------------------------------------------------------
-- Chỉ Super Admin xem; INSERT chỉ qua service_role (Edge Function) nên không có policy insert.
drop policy if exists audit_log_select_super_admin on public.audit_log;
create policy audit_log_select_super_admin on public.audit_log
  for select to authenticated
  using ((select public.current_app_role()) = 'super_admin');

-- ---------------------------------------------------------------------------
-- 6. GRANTS bảng (RLS vẫn là hàng rào chính; đây chỉ mở cửa cho RLS xét)
-- ---------------------------------------------------------------------------
grant select, insert, update on public.profiles to authenticated;
grant select on public.audit_log to authenticated;
