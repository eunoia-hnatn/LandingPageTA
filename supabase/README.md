# Supabase — Nhóm 1 (Auth + Lead + Policy)

Project ref: `hrbibbadjrimkyhbvyov`

## 1. Apply migration (theo thứ tự)

```bash
# Cách A — Supabase CLI (đã link project)
supabase link --project-ref hrbibbadjrimkyhbvyov
supabase db push        # apply cả 0001_auth_foundation + 0001b_leads_policy

# Cách B — thủ công: Dashboard > SQL Editor, dán & Run lần lượt
#   supabase/migrations/0001_auth_foundation.sql
#   supabase/migrations/0001b_leads_policy.sql   (enum lead_*, bảng leads, policy_documents + seed)
#   supabase/migrations/0002_site_content.sql    (Nhóm 2: bảng site_content + RLS + seed 5 block landing)
```

## 2. Deploy Edge Functions

```bash
# Secret: service_role key (Dashboard > Project Settings > API)
supabase secrets set SB_SERVICE_ROLE_KEY=<service_role key>

supabase functions deploy admin-users     # verify_jwt=true  — chỉ super_admin
supabase functions deploy submit-lead     # verify_jwt=false — public, nhận Lead từ landing
```

> `admin-users`: kiểm JWT caller + `role='super_admin'` bên trong.
> `submit-lead`: public; validate lại bằng `_shared/rules.ts`, chống trùng theo `phone_normalized`
> ("Lead mới thắng" — ghi đè, giữ `id`/`created_at`); ghi bằng `service_role` (anon KHÔNG insert `leads` trực tiếp).

## 3. Tạo 3 user test (một lần)

Dashboard > **Authentication > Users > Add user**. Với mỗi user:

| Email                     | Password (tối thiểu 8) | User Metadata (raw JSON)                                  |
|---------------------------|------------------------|----------------------------------------------------------|
| `superadmin@huyway.edu.vn` | (tự đặt)              | `{ "role": "super_admin", "full_name": "Super Admin" }`   |
| `marketing@huyway.edu.vn`  | (tự đặt)              | `{ "role": "marketing", "full_name": "Nhân sự Marketing" }` |
| `cskh@huyway.edu.vn`       | (tự đặt)              | `{ "role": "cskh", "full_name": "Nhân sự CSKH" }`         |

Trigger `on_auth_user_created` sẽ tự tạo bản ghi `public.profiles` tương ứng.
Nhớ tick **Auto Confirm User** để đăng nhập được ngay.

Sau này, tài khoản mới tạo qua UI **Quản lý tài khoản** (gọi `admin-users`) — không cần vào Dashboard nữa.

## 4. Kiểm chứng nhanh

```sql
-- anon KHÔNG đọc được profiles của người khác
select set_config('role','anon', true);
select * from public.profiles;            -- 0 rows

-- Sau khi đăng nhập bằng user cskh: không thấy profiles người khác
-- Sau khi đăng nhập bằng super_admin: thấy tất cả

-- Ràng buộc Super Admin cuối cùng
update public.profiles set is_active = false
where role = 'super_admin';                -- raise exception nếu là người cuối
```
