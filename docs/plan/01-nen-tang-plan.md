# Coding Plan — Nhóm 1: Nền tảng dùng chung

> Nguồn yêu cầu: `docs/requirements/14-xac-thuc-phan-quyen-module.docx` (Module 14) +
> `docs/requirements/17-chinh-sach-he-thong-module.docx` (Module 17), tham chiếu Module 2
> (field form Lead, mục 2.2) và `DESIGN.md`.
> Bản gốc của tài liệu này được duyệt với khách 2026-09-08, sau đó bị xoá nhầm khỏi repo
> (commit `d6fbec4`) và khôi phục lại từ lịch sử git (`4d6ab6f`) ngày 2026-09-09. Bản này viết lại
> theo đúng khung 4 mục khách yêu cầu (Kiến trúc / Trình tự triển khai / File / Test plan), đồng
> thời **đối chiếu lại với code thực tế hiện có trong repo** — vì phần lớn hạng mục A/B/D/G bên
> dưới đã được lập trình sau ngày duyệt plan, theo lối triển khai có vài điểm lệch so với thiết kế
> gốc (ghi rõ ở từng mục).
> Trạng thái: **đã code một phần** — xem bảng §1 và §3 để biết chính xác phần nào xong/còn lại.

---

## 1. Mục tiêu Nhóm 1

Thay toàn bộ phần "thử nghiệm" bằng nền tảng thật để 4 nhóm sau đứng lên:

| # | Hạng mục | Từ requirement | Trạng thái thực tế (2026-09-09) |
|---|----------|----------------|----------------------------------|
| A | Xác thực thật (Supabase Auth) + 3 vai trò + guard FE & BE + session timeout | 14.1, 14.2 | ✅ Code xong (`AuthContext`, `ProtectedRoute`, `useIdleTimeout`) — ⛔ migration/user test **chưa apply lên Supabase thật** |
| B | Quản lý tài khoản (tạo/sửa/khoá/gán vai trò), ràng buộc ≥1 Super Admin | 14.2 | ✅ Code xong (`AccountsPage` + `accounts.ts` gọi Edge Function `admin-users`) — ⛔ chưa deploy/test thật |
| C | Component `<LeadForm>` dùng chung: validate client+server, 4 trạng thái, ghi DB thật, chống double-submit, timeout | 17.4, 2.2 | ⚠️ **Dở dang** — component đã có và `CtaBand` đã dùng thật; **Hero.tsx (form chính) vẫn là UI tĩnh**, chưa gọi `submitLead` (xem §3, bước còn lại B13) |
| D | Chính sách bảo vệ dữ liệu cá nhân + ghi vết version đồng ý | 17.1 | ✅ Code xong (`policy_documents` + seed + `PolicyModal` + `PrivacyPolicyPage` + `submit-lead` ghi `consent_version`/`consent_at`) — ⛔ chưa apply migration |
| E | Trang lỗi 404/500 tuỳ biến + fallback tĩnh + error logging | 17.2 | ❌ **Chưa làm** — không có `NotFoundPage`/`ErrorPage`/`ErrorBoundary`, không có bảng `error_log`/Edge Function `log-error`, không có `public/404.html`/`500.html`/`.htaccess`. `UserApp.tsx` hiện ghi chú "Nhóm 2 sẽ bổ sung catch-all 404" — **cần khách xác nhận lại: 404/500 thuộc Nhóm 1 (17.2) hay dời sang Nhóm 2**, xem §3 |
| F | Meta SEO (title/description/OG/favicon) + sitemap.xml/robots.txt + không hard-code | 17.3 | ⚠️ **Dở dang** — `<Seo>` + `seo.ts` đã code (dùng **React 19 native head hoisting**, không cần `react-helmet-async` như bản gốc dự tính — đơn giản hơn); favicon đã có đủ bộ. Còn thiếu: `robots.txt`, `sitemap.xml`, `og-default.png` |
| G | Lớp design token theo `DESIGN.md` (Montserrat, 2 màu) + schema DB + RLS | ràng buộc phi CN | ✅ Code xong (`tailwind.config.js` + `DESIGN.md` + `index.css`); schema/RLS xong ở mục A/D — ⛔ chưa apply |

**Ngoài phạm vi Nhóm 1** (không đổi so với bản gốc): dựng lại layout Hero/CTA (Nhóm 2), CMS sửa
nội dung (Nhóm 4), Google Sheets sync (Nhóm 4), refactor admin sang route lồng nhau thật (Nhóm 4),
brute-force rate-limit tuỳ biến (tạm dùng giới hạn mặc định của Supabase Auth — đã chốt 2026-09-08).

---

## 2. Kiến trúc

### 2.1 Tầng dữ liệu (Supabase Postgres) — **đã viết migration, chưa apply**

> Khác với bản gốc (1 file `0001_foundation.sql`), khi code thật đã **tách thành 3 migration** cho
> dễ soát từng phần — giữ nguyên nội dung, chỉ đổi cách chia file:
> - `supabase/migrations/0001_auth_foundation.sql` — enum `app_role`, bảng `profiles` + `audit_log`,
>   hàm `current_app_role()`/`set_updated_at()`/`handle_new_user()`/`guard_last_super_admin()`.
> - `supabase/migrations/0001b_leads_policy.sql` — enum `lead_status`/`lead_source`, bảng `leads`
>   (đủ cột `phone_normalized`, `consent`, `consent_version`, `consent_at`, `CHECK (consent = true)`)
>   + bảng `policy_documents` (đã seed 1 bản `slug='data-privacy'`) + RLS 2 bảng.
> - `supabase/migrations/0002_site_content.sql` — bảng `site_content` (thuộc Nhóm 4/CMS, tạo sớm
>   để Nhóm 2/3 có chỗ đọc nội dung ngay).
>
> **Chưa có trong 3 file trên** (đúng theo mục E ở §1 — cần chốt lại phạm vi trước khi viết):
> bảng `error_log`.
>
> **Việc còn lại, không phải do Claude làm**: apply 3 migration lên project Supabase thật
> (`hrbibbadjrimkyhbvyov`, xem `.env`) qua `supabase db push` hoặc SQL Editor, `supabase gen types`
> để đồng bộ lại `database.types.ts`, và tạo thủ công 3 user test (mỗi role) qua Auth dashboard —
> **Supabase MCP chưa được uỷ quyền trong phiên làm việc của Claude** nên không tự apply được.

**Enum** — `app_role('super_admin','marketing','cskh')`, `lead_status('new','contacting','closed','unreachable')`, `lead_source('landing_hero','cta_after_hero','cta_after_steps','cta_after_instructor','manual_hotline')`.

**Bảng chính** — `profiles` (1–1 với `auth.users`, trigger tự tạo), `leads` (`phone_normalized` chống
trùng, `consent`/`consent_version`/`consent_at`), `policy_documents` (đã seed bản nháp, đánh dấu
"NỘI DUNG TẠM"), `audit_log` (ghi vết đổi tài khoản). Còn thiếu `error_log` (mục E).

**RLS** (đã bật cho các bảng đã tạo) — `leads`: anon không SELECT, chỉ INSERT qua Edge Function
service role; `authenticated` SELECT/UPDATE khi role `cskh`/`super_admin` (marketing không thấy).
`profiles`: mỗi user SELECT bản thân; `super_admin` toàn quyền. `policy_documents`: anon SELECT bản
`is_current`; `super_admin`/`marketing` toàn quyền.

### 2.2 Edge Functions (Deno, `supabase/functions/`) — **đã viết, chưa deploy**

| Function | Trạng thái | Ghi chú |
|----------|-----------|---------|
| `submit-lead` | ✅ Code xong | Validate qua `_shared/rules.ts`, normalize phone, gắn `consent_version`/`consent_at` từ `policy_documents` hiện hành, insert bằng service role |
| `admin-users` | ✅ Code xong | Verify JWT + `current_app_role()='super_admin'`, dùng `supabase.auth.admin`, chặn hạ cấp/khoá Super Admin cuối, ghi `audit_log` |
| `log-error` | ❌ Chưa viết | Phụ thuộc quyết định về mục E (§1) — nếu giữ trong Nhóm 1 thì cần viết cùng đợt với `ErrorBoundary`/`error_log` |

`supabase/functions/_shared/rules.ts` đã là bản khớp nội dung với `src/shared/forms/rules.ts` (client
import trực tiếp file client, Edge Function giữ bản sao — có ghi chú nguồn chân lý trong cả 2 file).

### 2.3 Tầng client (React) — **đã dựng đúng cấu trúc `src/shared/`**

```
src/shared/
├── lib/            supabase.ts · database.types.ts · permissions.ts   ✅
├── contexts/       AuthContext.tsx (Supabase Auth thật)               ✅
├── hooks/          useIdleTimeout.ts · usePolicyDocument.ts           ✅
├── components/     ProtectedRoute.tsx · ForbiddenView.tsx ·
│                   Seo.tsx (React 19 native, KHÔNG dùng react-helmet) ✅
│                   PolicyModal.tsx                                   ✅
│                   ErrorBoundary.tsx                                 ❌ chưa có
├── config/         seo.ts · policyFallback.ts                        ✅
├── forms/          rules.ts · validators.ts · useFormState.ts ·
│                   fields/{TextField,SelectField,TextAreaField,ConsentCheckbox}.tsx ✅
└── LeadForm/       LeadForm.tsx · LeadFormSuccess.tsx · submitLead.ts ✅
```

**Khác với thiết kế gốc — khu vực admin GIỮ CẤU TRÚC PHẲNG** (chốt với khách 2026-09-09, ghi ở
`docs/process/01-nen-tang-process.md`): không có `src/features/admin/*` như bản plan cũ, mà dùng
`src/App.tsx`, `src/pages/*`, `src/services/accounts.ts`, `src/lib/{use-auth,auth-context}.tsx`
(2 file này là **re-export shim** trỏ vào `src/shared/`), `src/data/mockDashboard.ts` (vẫn giữ
`NAV_ITEMS` ở đây, lọc quyền qua `SECTION_ROLES` trong `src/shared/lib/permissions.ts` thay vì gắn
field `roles` trực tiếp vào từng item).

**`<LeadForm>`** — đúng thiết kế gốc: đủ field, `useFormState` (idle/loading/success/error),
`ConsentCheckbox` không tick sẵn + mở `PolicyModal`. **Đang được `CtaBand` dùng thật**
(`source` truyền vào theo vị trí). **Hero.tsx (vị trí form chính, giá trị cao nhất trang) vẫn chưa
nối** — `handleSubmit` chỉ `setSubmitted(true)`, không gọi `submitLead` → đây là lỗ hổng lớn nhất
còn lại của Nhóm 1 (xem bước B13 ở §3).

### 2.4 SEO / trang lỗi / hạ tầng — **một phần chưa làm**

- `Seo.tsx` đã dùng React 19 native (`<title>`/`<meta>` tự hoist) — **quyết định mới, thay thế**
  `react-helmet-async` trong bản gốc (đơn giản hơn, ít dependency hơn). Đang gắn ở `LandingPage`,
  `PrivacyPolicyPage`. `index.html` đã có favicon đủ bộ + meta description/OG cơ bản.
- **Còn thiếu**: `public/robots.txt`, `public/sitemap.xml`, `public/og-default.png` (đang bị 404
  khi share mạng xã hội vì `og:image` trỏ tới file không tồn tại).
- **Còn thiếu toàn bộ mục E**: `ErrorBoundary`, `NotFoundPage`/`ErrorPage`, bảng `error_log`, Edge
  Function `log-error`, `public/404.html`/`500.html`/`.htaccess`.

---

## 3. Trình tự triển khai (phần còn lại, theo dependency)

> Các bước A–G ở bảng §1 đánh ✅ coi như xong, không liệt lại. Dưới đây là các bước **còn phải
> làm** để đóng nốt Nhóm 1, đánh số tiếp từ B13 (B1–B12 là các bước đã thực hiện, xem
> `docs/process/01-nen-tang-process.md`).

| B | Việc | Phụ thuộc | Đầu ra kiểm chứng |
|---|------|-----------|-------------------|
| B13 | **[Ưu tiên cao nhất]** Nối `src/features/user/sections/Hero.tsx` vào logic thật: dùng lại `useFormState` + `validateLead` + `submitLead` với `source: "landing_hero"` (đã có sẵn trong `LEAD_SOURCES`), giữ nguyên markup/CSS hiện có (không đổi layout). Thêm trạng thái `loading` (disable nút) và hiển thị `form.formError` khi submit lỗi (hiện chưa có UI báo lỗi). | Không có (mọi mảnh ghép đã tồn tại) | Submit trên trang thật → bản ghi `leads` có `source='landing_hero'`; ngắt mạng khi submit → hiện lỗi, không tự hiện "Cảm ơn" giả |
| B14 | **[Cần khách chốt]** Quyết định phạm vi mục E: 404/500 + `error_log` có nằm trong Nhóm 1 (đúng 17.2) hay dời hẳn sang Nhóm 2 (hiện `UserApp.tsx` đang ghi chú vậy nhưng chưa ai xác nhận chính thức). | — | Cập nhật `docs/DECISIONS.md` |
| B15 | Nếu B14 chốt "làm ở Nhóm 1": viết `error_log` (migration `0001c_error_log.sql`), Edge Function `log-error`, `ErrorBoundary.tsx`, `NotFoundPage.tsx`/`ErrorPage.tsx`, catch-all route trong `UserApp.tsx`, `public/404.html`/`500.html`/`.htaccess`. | B14 | `/duong-dan-sai` → 404 tuỳ biến; lỗi runtime giả → `ErrorBoundary` bắt + có dòng trong `error_log` |
| B16 | `public/robots.txt`, `public/sitemap.xml` (liệt kê `/`, `/chinh-sach-bao-mat`), `public/og-default.png` (asset tạm theo brand — dùng logo đã tách nền ở `src/features/user/assets/`). | — | Truy cập trực tiếp 3 URL đều trả về đúng nội dung; share link lên mạng xã hội có ảnh preview |
| B17 | Cài `vitest` + `@testing-library/react` (dev) và `@playwright/test` (dev) — **hiện repo chưa có công cụ test nào**. | — | `npm run test` chạy được (dù chưa có ca nào) |
| B18 | Viết unit test theo §5.1 (`validators`, `useFormState`, `permissions`). | B17 | Xem §5.1 |
| B19 | Dọn tàn dư: xác nhận `src-admin-temp/` không còn tồn tại (đã xoá — kiểm tra lại); cập nhật `MIGRATION_GUIDE.md`/`SETUP_STATUS.md` phần Authentication cho khớp trạng thái thật (nhiều file `.md` ở gốc repo hiện đang mô tả lại trạng thái cũ). | — | `git grep -i "mock"` sạch phần auth |
| **B20 [BLOCKED — khách]** | Apply 3 migration + deploy 2 Edge Function (+ `log-error` nếu có B15) lên Supabase thật; tạo 3 user test qua Auth dashboard; set secret `SERVICE_ROLE_KEY`. | B13–B16 xong về code | Query bằng anon key không SELECT được `leads`; `curl submit-lead` trả về bản ghi thật |
| B21 | Sau khi B20 xong: chạy toàn bộ E2E ở §5.4 với 3 user thật. | B20 | Xem §5.4 |

---

## 4. File sẽ tạo / sửa (phần còn lại)

### Tạo mới
```
public/robots.txt
public/sitemap.xml
public/og-default.png
tests/unit/validators.test.ts
tests/unit/useFormState.test.ts
tests/unit/permissions.test.ts
tests/e2e/*.spec.ts                         (Playwright, sau khi B20 xong)

# Chỉ nếu B14 chốt "404/500 thuộc Nhóm 1":
supabase/migrations/0001c_error_log.sql
supabase/functions/log-error/index.ts
src/shared/components/ErrorBoundary.tsx
src/features/user/pages/NotFoundPage.tsx
src/features/user/pages/ErrorPage.tsx
public/404.html
public/500.html
public/.htaccess
```

### Sửa
```
src/features/user/sections/Hero.tsx   # nối useFormState + submitLead (source="landing_hero"), giữ nguyên UI — bước B13
src/features/user/UserApp.tsx         # thêm catch-all 404 (nếu B14 chốt Nhóm 1) — hiện route mới có "/" và "/chinh-sach-bao-mat"
src/App.tsx                           # bọc <ErrorBoundary> (nếu B14 chốt Nhóm 1)
package.json                          # + devDeps vitest/@testing-library/react/@playwright/test — bước B17
MIGRATION_GUIDE.md / SETUP_STATUS.md  # cập nhật mục Authentication cho khớp trạng thái thật — bước B19
docs/DECISIONS.md                     # ghi quyết định B14
```

### Đã tạo/sửa xong (tham khảo — không cần làm lại)
```
supabase/config.toml · migrations/{0001_auth_foundation,0001b_leads_policy,0002_site_content}.sql
supabase/functions/{admin-users,submit-lead,_shared/{cors,rules}}.ts
src/shared/**  (lib, contexts, hooks, components, config, forms, LeadForm — xem §2.3)
src/pages/{AccountsPage,LoginPage}.tsx · src/services/accounts.ts
src/lib/{use-auth,auth-context}.tsx (re-export shim) · src/App.tsx (ProtectedRoute + gate theo role)
src/features/user/components/{Header,Footer}.tsx (logo/favicon — ngoài phạm vi Nhóm 1, đã làm ở đợt khác)
```

---

## 5. Test plan

### 5.1 Unit (Vitest — cần cài mới, bước B17)
| File | Ca kiểm |
|------|---------|
| `validators.test.ts` | SĐT `0912345678` hợp lệ; `0212345678`/`12345`/`"098 765 4321"` (chuẩn hoá rồi pass); email sai; `full_name` rỗng/>120; consent=false |
| `useFormState.test.ts` | double-submit chỉ chạy 1 lần; submit treo >15s → `error`, không kẹt `loading`; reset về `idle` |
| `permissions.test.ts` | `ROLE_HOME` đúng; `canAccessSection('marketing','leads')===false`, `('cskh','content')===false`, `('super_admin', *)===true` |

### 5.2 RLS / SQL (chạy trong SQL Editor sau khi B20 apply xong)
- anon: `select * from leads` → 0 rows/lỗi; `insert into leads` trực tiếp → bị chặn.
- `marketing`: `select from leads` → chặn. `cskh`: `select`/`update status` → OK; `select` `profiles`
  người khác → chặn.
- `update profiles set is_active=false` với Super Admin cuối cùng → trigger raise exception.

### 5.3 Edge Function (curl / Deno test — sau B20)
- `submit-lead`: thiếu `full_name` → `{ok:false, errors.full_name}`; SĐT sai → `errors.phone`;
  hợp lệ → `{ok:true}` + có bản ghi `leads` với `consent_version`/`consent_at`/`source` đúng.
- Trùng `phone_normalized` → ghi đè bản cũ (resubmit), không tạo bản ghi thứ 2.
- `admin-users` gọi bằng JWT role `cskh` → 403; bằng `super_admin` → tạo được user.

### 5.4 E2E (Playwright — skill `browser-automation`/`playwright-skill`, sau B17+B20)
| Mã | Kịch bản | Kỳ vọng | AC |
|----|----------|---------|----|
| E-01..E-03 | Đăng nhập từng vai trò | Thấy đúng menu theo `SECTION_ROLES` | 14.1/14.2 |
| E-04 | Sai mật khẩu | Thông báo generic | 14.1 |
| E-05 | Chưa đăng nhập mở `/admin` | Redirect `/login` | 14.1 |
| E-06 | Tài khoản `is_active=false` đang mở phiên | Bị đăng xuất | 14.2 |
| E-07 | Idle 30 phút | Cảnh báo trước 2', hết giờ → `/login` | 14.1 |
| E-08..E-13 | `<LeadForm>` ở **cả Hero lẫn CtaBand** (bổ sung so với bản gốc — trước đây chỉ test CtaBand): field rỗng, SĐT/email sai, không tick consent, submit hợp lệ, double-click, ngắt mạng | Hành vi đồng nhất ở cả 2 vị trí | 17.4/2.2 |
| E-14 | Mở `PolicyModal` từ consent + link Footer | Mở/đóng đúng, khoá scroll nền | 17.1 |
| E-15/E-16 | 404 / lỗi runtime (chỉ nếu B14 chốt Nhóm 1) | Trang tuỳ biến + `error_log` có dòng mới | 17.2 |
| E-17 | Kiểm meta mỗi route + `robots.txt`/`sitemap.xml` | Đúng theo route, truy cập được | 17.3 |
| E-18 | Đối chiếu `DESIGN.md` các bề mặt Nhóm 1 | Montserrat, đúng 2 màu, focus ring 2px indigo | ràng buộc |

### 5.5 Build / tĩnh (chạy được ngay bây giờ)
- `npx tsc -b` + `npm run build` + `npx oxlint src` — hiện đã xanh, chạy lại sau mỗi bước ở §3.
- `node .impeccable/.../detect.mjs` không phát sinh P0/P1 mới trên các bề mặt Nhóm 1.

---

## 6. Việc đã chốt / cần chốt tiếp với khách

**Đã chốt (2026-09-08, giữ nguyên từ bản gốc):** duyệt cài `react-markdown`+`remark-gfm` (đã cài),
email chỉ cần đúng định dạng (không ép `@gmail.com`), brute-force dùng giới hạn mặc định Supabase
Auth, `policy_documents` seed bằng văn bản mẫu tạm, nội dung consent giữ nguyên Module 2.2, session
timeout 30 phút idle, host/HTTPS production khách tự xử lý (chỉ có mẫu `.htaccess`).

**Đổi so với bản gốc (quyết định kỹ thuật khi code, không cần hỏi lại khách):** dùng React 19 native
`<title>`/`<meta>` thay `react-helmet-async`; giữ admin cấu trúc phẳng (`src/pages`, `src/services`)
thay vì `src/features/admin/*`; tách migration thành 3 file.

**Cần khách chốt tiếp (bước B14):** 404/500 tuỳ biến + `error_log` có thuộc Nhóm 1 (đúng yêu cầu
17.2) hay dời sang Nhóm 2 — hiện đang bỏ ngỏ, một dòng comment cũ trong code tự ý giả định "dời
sang Nhóm 2" nhưng chưa ai xác nhận chính thức.
