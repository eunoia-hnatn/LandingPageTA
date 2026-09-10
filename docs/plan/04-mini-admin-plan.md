# Coding Plan — Nhóm 4: Mini Admin (Quản lý Lead + CMS nội dung)

> Nguồn yêu cầu: `docs/requirements/15-quan-ly-lead-module.docx`,
> `16-cau-hinh-noi-dung-cms-module.docx`.
> Phụ thuộc: **Nhóm 1** (`leads` schema + RLS + `current_app_role()` + `audit_log` + Edge Function
> `submit-lead`/`admin-users` + form kit `src/shared/forms/` + `AuthContext`), **Nhóm 2**
> (`site_content` + RLS write `super_admin`/`marketing` + `useSiteContent`/`contentDefaults`),
> **Nhóm 3A/3B** (shape từng block + cơ chế auto-hide khi rỗng).
> Bản gốc (duyệt 2026-09-08) khôi phục từ git (`4d6ab6f`) giả định cấu trúc `src/features/admin/*`
> — **admin thật giữ cấu trúc phẳng** (`src/pages`, `src/services`, `src/components`, `src/lib`,
> `src/data`, `src/types`, xem `plan/01-nen-tang-plan.md` §2.3). Bản này viết lại theo đúng cấu
> trúc thật + đối chiếu với 2 trang mock hiện có.
> Trạng thái: **chưa code** (đúng như bản gốc) — 2 màn `LeadsManagementPage.tsx`/
> `ContentLandingPage.tsx` đã tồn tại nhưng **100% dữ liệu mock cục bộ** (`mockAuth`,
> `mockContent`, `useState`), chưa gọi Supabase ở đâu cả.

---

## 1. Mục tiêu Nhóm 4

Thay phần admin mock bằng 2 màn vận hành thật, sau RBAC (đã có từ Nhóm 1):

| Module | Vai trò | Màn | File hiện tại |
|--------|---------|-----|----------------|
| 15 | CSKH + Super Admin | Danh sách Lead (lọc ngày/trạng thái) · cập nhật trạng thái tư vấn · nhập tay Lead Hotline · đồng bộ Google Sheets | `src/pages/LeadsManagementPage.tsx` (mock), `src/pages/CustomersPage.tsx` (mock, tách riêng — xem §6 điểm giữ nguyên quyết định gộp) |
| 16 | Marketing + Super Admin | Sửa văn bản/hình ảnh mọi block Landing, phản ánh không cần deploy, validate, audit log | `src/pages/ContentLandingPage.tsx` (mock, dữ liệu từ `src/data/mockContent.ts`) |

**Ngoài phạm vi Nhóm 4:** Dashboard "Tổng quan" (`src/pages/Dashboard.tsx`) + "Báo cáo & Thống kê"
(`ReportsPage.tsx`) — không có requirement 01–18, giữ mock; các mục nav `budget`/`staff`/`courses`
giữ nguyên (`ComingSoon`); quản lý tài khoản (Module 14.2, đã xong ở Nhóm 1).

---

## 2. Kiến trúc

### 2.1 Schema DB

**`supabase/migrations/0005_lead_ops.sql`** (mở rộng bảng `leads` đã có từ Nhóm 1
`0001b_leads_policy.sql` — bảng hiện **chưa có** các cột dưới đây, xác nhận qua migration hiện tại)

| Bảng | Cột thêm | Ghi chú |
|------|----------|---------|
| `leads` | `note text`, `last_contacted_at timestamptz`, `updated_by uuid → profiles`, `registration_count int NOT NULL DEFAULT 1`, `is_archived bool NOT NULL DEFAULT false`, `archived_at timestamptz` | Không thêm cột xoá cứng / không cấp quyền `DELETE` — chỉ lưu trữ mềm (§6 điểm 5) |
| `lead_events` | `id`, `lead_id → leads`, `type text` (`status_change`\|`note`\|`assign`\|`merge`\|`resubmit`\|`archive`\|`sync`), `from_value`, `to_value`, `actor_id uuid`, `note`, `created_at` | Timeline cho `LeadDetailDrawer` + truy vết 15.1 |
| `lead_sync_queue` | `lead_id → leads PK`, `status text` (`pending`\|`synced`\|`error`), `attempts int default 0`, `last_error text`, `sheet_row int`, `synced_at`, `updated_at` | 15.3 — giai đoạn này chỉ chạy với `MockSheetsClient` (§2.2), không gọi Google thật |

**Hàm/RPC** (`SECURITY DEFINER`, tự kiểm `current_app_role()`):
- `find_lead_duplicates(p_phone text, p_email text) returns setof leads` — theo `phone_normalized`/`email`.
- `create_manual_lead(payload jsonb) returns jsonb` — validate bằng cùng `rules.ts` (Nhóm 1),
  `source='manual_hotline'`. **Quy tắc trùng "Lead mới thắng"**: trùng `phone_normalized` →
  **không** tạo bản ghi mới, ghi đè field (trừ `id`/`created_at`/`registration_count`),
  `registration_count += 1`, `updated_at = now()`, ghi `lead_events(type='resubmit')`; trả
  `{ lead, was_duplicate }`. Áp dụng đúng nguyên tắc này cả ở `submit-lead` (đã có ở Nhóm 1, cần
  bổ sung thêm — hiện `submit-lead/index.ts` mới có ghi đè cơ bản, chưa có `registration_count`).
- `assign_lead(p_lead uuid, p_assignee uuid) returns leads` — gán tay qua dropdown; ghi
  `lead_events(type='assign')`.
- `update_lead_status(p_lead uuid, p_status lead_status, p_note text) returns leads` — chỉ
  `cskh`/`super_admin`; ghi `lead_events`; set `last_contacted_at`.
- `merge_leads(p_a uuid, p_b uuid) returns leads` — hợp nhất tay 2 bản CSKH tự phát hiện trùng
  (dedupe tự động không bắt được); "mới thắng" theo `updated_at`; bản thua `is_archived=true`.
- `archive_lead`/`unarchive_lead(p_lead uuid) returns leads` — **cách "xoá" duy nhất**, không có
  RPC/API nào xoá cứng (khớp Module 17.1).
- Trigger `AFTER INSERT ON leads` → `INSERT lead_sync_queue(lead_id,'pending')`.

**`supabase/migrations/0006_cms.sql`**

| Bảng | Cột | Ghi chú |
|------|-----|---------|
| `site_content` (thêm cột) | `version int NOT NULL DEFAULT 1` | optimistic concurrency (16 edge — hiện chưa có, migration Nhóm 2 không có cột này) |
| `site_content_revisions` | `id`, `block text`, `data jsonb`, `version int`, `edited_by uuid`, `edited_at`, `note` | lịch sử chỉnh sửa + rollback |

**Hàm/RPC:**
- `save_site_content(p_block text, p_data jsonb, p_base_version int) returns jsonb` — chỉ
  `marketing`/`super_admin`; version lệch → `409 {conflict:true, current}`; validate field bắt
  buộc theo `p_block`; `version = version+1`; trigger ghi `site_content_revisions`.
- `rollback_site_content(p_block text, p_revision_id uuid)` — `super_admin`.
- `publish_policy_version(p_title text, p_body_md text) returns policy_documents` —
  `marketing`/`super_admin`: tạo version mới cho `policy_documents` (bảng đã có từ Nhóm 1),
  `is_current=true`, bản cũ `is_current=false` (giữ lịch sử, khớp `consent_version` mỗi Lead).

**RLS/Storage bổ sung**
- `leads`: `marketing` **không** SELECT/UPDATE; `cskh`/`super_admin` SELECT + UPDATE **chỉ qua
  RPC** ở trên; **không vai trò nào** có `DELETE`.
- `site_content`: write qua RPC `save_site_content` (không `UPDATE` trực tiếp qua PostgREST nữa —
  chặt hơn RLS hiện tại của Nhóm 2 vốn cho `UPDATE` trực tiếp).
- Storage bucket `landing-media` (**tạo ở đây, không phải Nhóm 3B**): public read; ghi chỉ qua
  Edge Function `upload-media`.

### 2.2 Edge Functions

| Function | Trigger | Việc |
|----------|---------|------|
| `submit-lead` (SỬA — đã có ở Nhóm 1) | public | Áp đầy đủ "mới thắng" (`registration_count`), enqueue `lead_sync_queue`, gọi bất đồng bộ `process-sheet-sync` (best-effort, lỗi không ảnh hưởng response) |
| `process-sheet-sync` (MỚI) | `pg_cron` mỗi 1 phút + gọi tay | Drain `lead_sync_queue` (`pending`/`error`, `attempts<6`); gọi `_shared/sheets.ts`; cập nhật trạng thái; backoff; lỗi → `error_log` (nếu Module E của Nhóm 1 đã làm — nếu chưa, log console tạm) |
| `upload-media` (MỚI) | authenticated `marketing`/`super_admin` | Validate mime (jpeg/png/webp) + size ≤5MB; resize theo usage; lưu `landing-media`; trả `{url,width,height}` |

**Google Sheets — MOCK giai đoạn này** (giữ đúng quyết định gốc): `supabase/functions/_shared/sheets.ts`
định nghĩa interface `SheetsClient` (`pushLead(lead): Promise<{sheetRow:number}>`) +
`MockSheetsClient` (giả lập, không gọi mạng thật). Khi khách cấp `GOOGLE_SA_KEY`/`LEADS_SHEET_ID`
thật, chỉ thêm `GoogleSheetsClient` cùng interface — không sửa phần queue/retry/RLS.

**API endpoint** (PostgREST/RPC, không phải REST tự viết):
```
GET  /rest/v1/leads?select=...&created_at=gte.X&status=eq.Y&is_archived=eq.false&order=created_at.desc&limit&offset
POST /rest/v1/rpc/{create_manual_lead|update_lead_status|assign_lead|merge_leads|archive_lead|unarchive_lead|find_lead_duplicates}
GET  /rest/v1/profiles?role=eq.cskh&is_active=eq.true      # dropdown gán CSKH
POST /rest/v1/rpc/{save_site_content|rollback_site_content|publish_policy_version}
GET  /rest/v1/site_content_revisions?block=eq.X&order=edited_at.desc
```

### 2.3 Nguồn chân lý schema nội dung

`src/shared/content/schema.ts` — 1 nơi mô tả mọi block (field, kiểu `text|textarea|markdown|
image|bool|list|object`, `required`, `label`, giới hạn item). `contentDefaults.ts` (Nhóm 2/3A/3B)
suy ra default+type từ đây; `blockSchemas.ts` (Nhóm 4) đọc để render form động + validate. Thêm
field mới cho 1 block = sửa 1 chỗ, cả 2 phía theo.

> **Icon field**: dùng khoá **Material Symbols** (không phải `lucide-react` như bản gốc) — khớp
> quyết định đã cập nhật ở `plan/03-section-tinh-plan.md` §6 điểm 3 (landing đã dùng
> `material-symbols-outlined` xuyên suốt, không đổi sang lucide).

### 2.4 Frontend admin (cấu trúc phẳng thật, không phải `src/features/admin/*`)

```
src/
├── data/
│   └── (xoá dần mockContent.ts, mockAuth.ts phần Lead/Content — giữ phần khác nếu còn dùng)
├── components/shared/
│   ├── DataTable.tsx          # MỚI, nhẹ — bọc UI bảng đang viết tay trong LeadsManagementPage/
│   │                          #   CustomersPage thành 1 component dùng chung (cột config, sort,
│   │                          #   empty state) — TÁI DÙNG markup hiện có, không viết từ đầu
│   ├── FilterBar.tsx           # MỚI — ghép FilterSelect.tsx + SearchInput.tsx đã có + date-range
│   ├── Pagination.tsx          # ĐÃ CÓ — dùng thẳng, không cần viết lại
│   └── FilterSelect.tsx        # ĐÃ CÓ
├── hooks/
│   ├── useServerTable.ts      # MỚI — state filter/sort/page → query PostgREST
│   └── useAsyncData.ts        # MỚI — fetch + loading/error
├── cms/                        # MỚI (thư mục mới, phẳng theo cấu trúc admin hiện tại)
│   ├── blockSchemas.ts
│   ├── BlockEditor.tsx
│   ├── PolicyTab.tsx
│   ├── useBlockContent.ts
│   └── fields/{TextFieldEditor,MarkdownEditor,ImageFieldEditor,IconPickerField,BoolFieldEditor,ListEditor,ObjectEditor}.tsx
├── leads/                       # MỚI
│   ├── LeadDetailDrawer.tsx
│   ├── ManualLeadModal.tsx      # dùng field kit src/shared/forms/ (cùng field Module 2.2)
│   ├── AssigneeSelect.tsx
│   └── DuplicateNotice.tsx
├── services/
│   ├── leads.ts                 # MỚI — list/get/updateStatus/assign/createManual/merge/archive/resync
│   ├── content.ts                # MỚI — getBlock/saveBlock/listRevisions/rollback/uploadMedia/publishPolicy
│   ├── sync.ts                   # MỚI — trạng thái sync tổng hợp cho Sidebar
│   └── accounts.ts                # ĐÃ CÓ (Nhóm 1) — không đổi
└── pages/
    ├── LeadsManagementPage.tsx   # SỬA (không viết mới) — thay data mock bằng services/leads.ts
    ├── ContentLandingPage.tsx    # SỬA — thay data mock bằng services/content.ts + cms/BlockEditor
    └── CustomersPage.tsx         # XOÁ — gộp vào LeadsManagementPage theo chip filter (§6 điểm 6)
```

**`LeadsManagementPage`** (15.1, gộp `customers`): `<FilterBar>` (khoảng ngày + trạng thái +
chip "Khách hàng" lọc `status='closed'` + chip "Đã lưu trữ" ẩn mặc định) → bảng cột *họ tên, SĐT,
email, khóa học, trình độ, nguồn, thời gian gửi, trạng thái, số lần đăng ký*. Nút "Nhập Lead
Hotline" → `<ManualLeadModal>` (trùng → `<DuplicateNotice>`, không chặn). Bấm 1 dòng →
`<LeadDetailDrawer>` (đổi trạng thái, gán CSKH qua `<AssigneeSelect>`, timeline, badge đồng bộ
Sheets, nút "Lưu trữ" — không có nút xoá vĩnh viễn).

**`ContentLandingPage`** (16.1): cột trái = danh sách block (khớp đúng các block đã seed ở Nhóm
2/3A/3B: `hero`, `trust_bar`, `values`, `pain_points`, `process_steps`, `courses`, `instructors`,
`testimonials`, `commitment`, `faq`, `tech_showcase`, `footer`, `map`, `seo`) **+ tab "Chính
sách"** (`PolicyTab`); cột phải = `<BlockEditor>` render form từ `blockSchemas`. "Lưu" gọi
`save_site_content`: thiếu field bắt buộc → chặn; `409` → banner "đã có người sửa" + Tải lại/Ghi
đè; list rỗng → cảnh báo "section sẽ ẩn" (khớp auto-hide Nhóm 3); panel "Lịch sử chỉnh sửa" +
khôi phục (`super_admin`).

**Cập nhật landing:** `useSiteContent` (Nhóm 2) đã tự fetch khi mount → nội dung mới hiện ở lần
tải trang kế tiếp, không cần deploy.

**Sidebar health** (thay chip "Google Sheets API Active" giả trong `src/components/layout/Header.tsx`):
đọc `lead_sync_queue` → "Đồng bộ Sheets: OK / N chờ / N lỗi" (dữ liệu từ `MockSheetsClient`) + nút
"Đồng bộ ngay" gọi `process-sheet-sync`.

---

## 3. Trình tự triển khai (theo dependency)

| B | Việc | Phụ thuộc | Đầu ra kiểm chứng |
|---|------|-----------|-------------------|
| 1 | `0005_lead_ops.sql` + `0006_cms.sql`: cột, bảng, RPC, trigger, RLS, bucket `landing-media`. Apply. `supabase gen types`. | Nhóm 1–3 migrations (đã apply) | RPC sai role → chặn; `save_site_content` sai version → 409 |
| 2 | `src/shared/content/schema.ts`; refactor `contentDefaults.ts` (Nhóm 2/3A/3B) suy ra từ đây. | Nhóm 2/3 | `npm run build` landing xanh; default không đổi |
| 3 | Edge Function `upload-media` (validate + resize). Deploy. | 1 | Upload ảnh sai định dạng/quá size → 422 |
| 4 | `_shared/sheets.ts` (`SheetsClient` + `MockSheetsClient`); Edge Function `process-sheet-sync` + `pg_cron`; sửa `submit-lead` (enqueue + registration_count). | 1 | Lead mới → queue chuyển `synced` (mock) <1 phút |
| 5 | `components/shared/DataTable.tsx` (bọc markup bảng hiện có, không viết mới từ đầu), `FilterBar.tsx` (ghép `FilterSelect`+`SearchInput` đã có); `hooks/useServerTable.ts`, `useAsyncData.ts`. | 1 | Sort + phân trang + empty state chạy trên dữ liệu giả lập |
| 6 | `services/leads.ts`; sửa `LeadsManagementPage.tsx` dùng data thật + `LeadDetailDrawer` + `AssigneeSelect` + `ManualLeadModal` + `DuplicateNotice`; xoá `CustomersPage.tsx`, gỡ mục `customers` khỏi `NAV_ITEMS`. | 5, Nhóm 1 (form kit) | CSKH lọc theo ngày/trạng thái/khách hàng; đổi trạng thái ghi `lead_events`; nhập tay trùng SĐT → ghi đè "mới thắng" + thông báo không chặn |
| 7 | `cms/blockSchemas.ts` + `BlockEditor` + field editors (icon theo Material Symbols) + `useBlockContent`; `PolicyTab` + `publish_policy_version`; `services/content.ts`; sửa `ContentLandingPage.tsx` dùng data thật. | 2, 3, 5 | Marketing sửa headline Hero → Lưu → mở `/` thấy đổi, không deploy |
| 8 | Sidebar health từ `lead_sync_queue`; bỏ chip "Google Sheets API Active" giả trong `Header.tsx` → nối `process-sheet-sync` (mock) thật. | 4 | Chip phản ánh đúng số `pending/error` |
| 9 | Backfill: enqueue toàn bộ `leads` hiện có (nếu đã có dữ liệu thật sau khi Nhóm 1 apply) vào `lead_sync_queue`; chạy `process-sheet-sync` 1 lần. | 4 | Lead cũ chuyển `synced` (mock) |
| 10 | Dọn mock: xoá `src/data/mockContent.ts`, phần Lead/Content trong `mockAuth.ts` (giữ phần khác nếu Dashboard tổng quan còn dùng). | 6–8 | `git grep -i mock` — chỉ còn Dashboard tổng quan + `MockSheetsClient` (cố ý) |
| 11 | QA: Playwright §5.3 + RLS/RPC test (dedupe "mới thắng", archive, assign). | tất cả | Không P0/P1 |

---

## 4. File sẽ tạo / sửa

### Tạo mới
```
supabase/migrations/0005_lead_ops.sql
supabase/migrations/0006_cms.sql
supabase/functions/upload-media/index.ts
supabase/functions/process-sheet-sync/index.ts
supabase/functions/_shared/sheets.ts
src/shared/content/schema.ts
src/components/shared/DataTable.tsx
src/components/shared/FilterBar.tsx
src/hooks/useServerTable.ts
src/hooks/useAsyncData.ts
src/services/leads.ts
src/services/content.ts
src/services/sync.ts
src/leads/LeadDetailDrawer.tsx
src/leads/ManualLeadModal.tsx
src/leads/AssigneeSelect.tsx
src/leads/DuplicateNotice.tsx
src/cms/blockSchemas.ts
src/cms/BlockEditor.tsx
src/cms/PolicyTab.tsx
src/cms/useBlockContent.ts
src/cms/fields/{TextFieldEditor,MarkdownEditor,ImageFieldEditor,IconPickerField,BoolFieldEditor,ListEditor,ObjectEditor}.tsx
tests/unit/content-schema.test.ts
tests/unit/save-site-content.test.ts
tests/unit/lead-dedup.test.ts
tests/e2e/admin-leads.spec.ts
tests/e2e/admin-cms.spec.ts
```

### Sửa
```
supabase/functions/submit-lead/index.ts   # registration_count, enqueue sync, "mới thắng" đầy đủ
src/features/user/config/contentDefaults.ts  # suy ra từ src/shared/content/schema.ts
src/data/mockDashboard.ts                 # xoá mục 'customers', gỡ mock Lead/nguồn (giữ KPI Dashboard tổng quan)
src/App.tsx                               # PAGES['leads'] dùng bản đã sửa, gỡ 'customers'
src/components/layout/Header.tsx          # "Đồng bộ thủ công" → process-sheet-sync (mock)
src/pages/LeadsManagementPage.tsx         # data thật qua services/leads.ts
src/pages/ContentLandingPage.tsx          # data thật qua services/content.ts + cms/BlockEditor
database.types.ts                         # regen sau 0005/0006
```

### Xoá
```
src/pages/CustomersPage.tsx     # gộp vào LeadsManagementPage (chip filter "Khách hàng")
src/data/mockContent.ts         # thay bằng site_content thật qua services/content.ts
```

---

## 5. Test plan

### 5.1 Unit / RPC (Vitest — cần cài, xem `plan/01-nen-tang-plan.md` bước B17)
| File | Ca kiểm |
|------|---------|
| `content-schema.test.ts` | mọi block trong `schema.ts` có `title` bắt buộc; `contentDefaults` khớp shape schema |
| `save-site-content.test.ts` | `base_version` cũ → `{conflict:true}`; thiếu field required → lỗi validate; lưu OK → `version+1` + 1 hàng revision |
| `lead-dedup.test.ts` | `find_lead_duplicates` khớp theo `phone_normalized`; `create_manual_lead` trùng → ghi đè (giữ `id`), `registration_count+1`, `was_duplicate:true`, không tạo hàng mới |

### 5.2 RLS / RPC / Storage
- `marketing`: `SELECT leads` → deny; `save_site_content` → OK.
- `cskh`: `save_site_content` → deny; `update_lead_status`/`assign_lead`/`archive_lead` → OK.
- anon: mọi RPC ghi → deny; **không có** policy `DELETE` nào trên `leads`.
- Storage `landing-media`: anon upload → deny; `marketing` qua `upload-media` → OK.

### 5.3 E2E (Playwright — skill `browser-automation`/`playwright-skill`)
| Mã | Kịch bản | Kỳ vọng | AC |
|----|----------|---------|-----|
| L-01 | CSKH mở "Quản lý Leads" | Bảng đủ cột theo 15.1 | 15.1 |
| L-02 | Lọc ngày + trạng thái | Kết quả đúng, phân trang đúng | 15.1 |
| L-02b | Bấm chip "Khách hàng" | Lọc `status='closed'` | 15.1 |
| L-03 | Bộ lọc không ra kết quả | Empty state rõ ràng | 15.1 edge |
| L-04 | Đổi trạng thái + ghi chú | Lưu, timeline có event | 15.1 |
| L-04b | Gán CSKH qua dropdown | `assigned_to` cập nhật, `lead_events(assign)` | 15 |
| L-05 | Nhập Lead Hotline hợp lệ | `source='manual_hotline'` | 15.2 |
| L-06 | Nhập tay thiếu field/SĐT sai | Chặn + lỗi inline | 15.2 |
| L-07 | Nhập tay SĐT đã tồn tại | Ghi đè bản cũ, `<DuplicateNotice>` không chặn | 15.2 edge |
| L-08 | Lead mới tạo | `lead_sync_queue` → `synced` (mock) <1 phút | 15.3 |
| L-09 | `MockSheetsClient` giả lập lỗi | Lead vẫn lưu; queue `error`; retry tự động | 15.3 edge |
| L-10 | Marketing mở `/admin` mục Leads | 403/ẩn mục | 14.2 |
| L-11 | Bấm "Lưu trữ" 1 Lead | Ẩn khỏi danh sách mặc định; không nút xoá vĩnh viễn | 17.1 |
| C-01 | Sửa headline Hero → Lưu → mở `/` | Đổi ngay, không deploy | 16.1 |
| C-02 | Upload ảnh sai định dạng/quá size | Cảnh báo, không lưu ảnh vỡ | 16.1 edge |
| C-03 | Upload ảnh hợp lệ | Resize/nén, preview đúng | 16.1 edge |
| C-04 | Bỏ trống tiêu đề → Lưu | Chặn + lỗi | 16.1 |
| C-05 | Xoá hết item 1 block list → Lưu | Cảnh báo "section sẽ ẩn"; landing tự ẩn | 16.1 edge |
| C-06 | 2 tab cùng sửa 1 block | Tab sau nhận cảnh báo 409, chọn Tải lại/Ghi đè | 16.1 edge |
| C-07 | CSKH mở `/admin` mục Content | 403/ẩn mục | 16 |
| C-08 | Sau khi lưu | `site_content_revisions` có bản ghi | 16 |
| C-09 | Khôi phục revision cũ | Landing trở lại nội dung bản đó | 16 |

### 5.4 Build / tĩnh
- `npx tsc -b` + `npm run build` + `npx oxlint src` xanh.
- `node .impeccable/.../detect.mjs` trên `LeadsManagementPage`/`ContentLandingPage`.
- `git grep -nE "Google Sheets API Active|mockContent|mockAuth.*Lead"` → rỗng (trừ `MockSheetsClient`, cố ý).

---

## 6. Quyết định giữ nguyên từ bản gốc (2026-09-08, vẫn hợp lệ — chưa có code nào mâu thuẫn)

1. **Google Sheets**: chưa kết nối thật, dùng `MockSheetsClient` — kiến trúc sẵn sàng để cắm
   client thật sau mà không đổi queue/retry/RLS.
2. **Phân công Lead**: gán tay qua dropdown, không auto round-robin.
3. **Quy tắc trùng SĐT**: "Lead mới thắng" — ghi đè, `registration_count += 1`, giữ nguyên `id`.
4. **CMS rich text**: Markdown + textarea (đã có `react-markdown`+`remark-gfm` cài từ Nhóm 1).
5. **Lưu CMS**: publish ngay khi nhấn Lưu, không luồng Nháp → Duyệt.
6. **`customers` vs `leads`**: gộp 1 màn, lọc bằng chip — **xác nhận vẫn đúng**: 2 trang mock hiện
   tách riêng chính là trạng thái "chưa gộp" cần sửa ở bước 6 (§3), không phải đã lỡ tách theo
   hướng khác cần cân nhắc lại.
7. **Xoá Lead**: không cho xoá vĩnh viễn — chỉ `is_archived`/`archived_at`.
8. **Icon field CMS**: **cập nhật khác bản gốc** — dùng khoá Material Symbols (không phải
   lucide-react), khớp toàn bộ landing đã dùng `material-symbols-outlined` (xem §2.3).
