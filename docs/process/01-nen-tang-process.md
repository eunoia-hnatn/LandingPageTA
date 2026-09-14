# Process log — Nhóm 1 / Module Auth (xác thực & phân quyền)

> Nguồn: `docs/plan/01-nen-tang-plan.md` — phạm vi đợt này: **chỉ Auth (mục A + B)**.
> Format mỗi dòng: `[timestamp] - [bước] - [trạng thái] - [ghi chú]`

## Bối cảnh (2026-09-09)
- Repo thực tế lệch so với plan: admin ở `src/` phẳng, chưa có router, `src/features/user/` gần rỗng,
  chưa có Supabase client. Chốt với khách: **tạo lớp `src/shared/` mới, giữ admin phẳng**, chỉ làm Auth.
- Supabase MCP chưa uỷ quyền trong phiên → viết file migration + Edge Function để khách tự apply
  (`supabase db push` / SQL Editor) và tự tạo 3 user test.

---

[2026-09-09 04:06] - B0 khảo sát + chốt phạm vi - done - Đọc plan, soi repo, hỏi khách 3 câu (cấu trúc / phạm vi / supabase). Chốt: shared layer mới, chỉ Auth A+B, viết file SQL+Edge cho khách apply.
[2026-09-09 04:15] - B1 migration 0001_auth_foundation.sql - done - enum app_role; bảng profiles + audit_log; hàm current_app_role/set_updated_at/handle_new_user/guard_last_super_admin + trigger; RLS profiles+audit_log; index FK. CHƯA apply (chờ khách chạy `supabase db push` — xem supabase/README.md).
[2026-09-09 04:20] - B2 Edge Function admin-users - done - list/create/update_role/set_active; verify JWT caller + role super_admin; double-check Super Admin cuối; ghi audit_log. + _shared/cors.ts, config.toml. CHƯA deploy.
[2026-09-09 04:30] - B3 lớp shared client - done - shared/lib/{supabase,database.types,permissions}.ts; shared/contexts/AuthContext.tsx (Supabase Auth thật, lỗi generic, tự signOut khi is_active=false); shared/hooks/useIdleTimeout.ts (30' + cảnh báo 2'); shared/components/{ProtectedRoute,ForbiddenView}.tsx. src/lib/{use-auth,auth-context} thành re-export; xoá auth-context-def.ts.
[2026-09-09 04:40] - B6 nối vào admin - done - App.tsx (ProtectedRoute + gate section theo SECTION_ROLES + ROLE_HOME + ForbiddenView); LoginPage.tsx (signIn thật, bỏ hộp demo creds, thông báo generic); Header.tsx (badge role thật, bỏ chip "Đã đồng bộ Google Sheets" giả + nút sync); types/auth.ts + mockAuth.ts chuẩn hoá role snake_case; ContentLandingPage/LeadsManagementPage đổi currentUser→profile.
[2026-09-09 04:45] - B7 quản lý tài khoản - done - src/services/accounts.ts (bọc admin-users); src/pages/AccountsPage.tsx (list/tạo/đổi role/khoá, chặn hạ cấp-khoá Super Admin cuối ở UI); NAV_ITEMS thêm "Quản lý tài khoản" (super_admin); gỡ tab "Tài khoản" khỏi BudgetPermissionsPage.
[2026-09-09 04:55] - Build xanh - done - package.json + @supabase/supabase-js; `npm install` đồng bộ toolchain (TS 6.0.3); `npm run build` OK; `npx oxlint src` exit 0.
[2026-09-09 05:05] - Hook auto-log - done - Viết lại hook Windows-safe: `.claude/hooks/log-process-edit.mjs` (node, đọc JSON stdin, ghi vào file này) + `.claude/settings.json` PostToolUse Edit|Write (async). Bỏ path `current-module.md` sai. Đã test pipe + xác nhận fire live.

## Còn lại để khách/đợt sau làm
- [BLOCKED - khách] Apply migration + deploy Edge Function + tạo 3 user test (Supabase MCP chưa uỷ quyền trong phiên). Hướng dẫn: `supabase/README.md`.
- [ ] E2E 3 vai trò (E-01..E-07) — chạy sau khi có user test thật.
- [ ] Unit test permissions/useFormState/validators (vitest chưa cài — thuộc bước 5, ngoài phạm vi đợt này).
- [ ] Xoá tàn dư mock cuối (src-admin-temp/ không tồn tại ở repo này; SEED_ACCOUNTS đã gỡ).

---

## Nhật ký auto-edit (hook PostToolUse Edit|Write → `.claude/hooks/log-process-edit.mjs`)
> Mỗi dòng do hook tự ghi khi Claude sửa 1 file (bỏ qua node_modules/dist/.git và chính thư mục docs/process).
[2026-09-09 04:27] - auto-edit - done - .claude/hooks/log-process-edit.mjs
