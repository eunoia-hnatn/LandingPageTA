# Coding Plan — Nhóm 3A: Section nội dung Landing (phần tĩnh)

> Nguồn yêu cầu: `docs/requirements/04-gia-tri-khac-biet-module.docx`,
> `05-pain-points-module.docx`, `06-quy-trinh-3-buoc-module.docx`, `07-lo-trinh-khoa-hoc-module.docx`.
> Phụ thuộc: **Nhóm 1** (`<LeadForm>`, `DESIGN.md`) + **Nhóm 2** (`site_content` +
> `useSiteContent` + `contentDefaults` + hợp đồng `config/sections.ts` + `<CtaBand>` +
> `SectionAnchor` — xem `docs/plan/02-khung-dieuhuong-chuyendoi-plan.md`).
> Bản gốc của tài liệu này được duyệt với khách 2026-09-08 (tên cũ `03a-section-tinh-plan.md`),
> bị xoá nhầm khỏi repo (commit `d6fbec4`), khôi phục từ git (`4d6ab6f`) 2026-09-09. Bản này viết
> lại theo đúng khung 4 mục khách yêu cầu, đối chiếu lại với code thật — vì bản gốc được viết dựa
> trên prototype cũ (`CenterCardCarousel.tsx`, `Steps.tsx`, id `ve-huyway`) đã **không còn tồn
> tại**: toàn bộ UI Nhóm 3A hiện đã là bản port pixel-perfect từ `docs/design export/code.html`
> (`AboutValues.tsx`, `PainPoints.tsx`, `ProcessSteps.tsx`, `Courses.tsx`), tên file/id khác hẳn
> bản gốc. Khác với Nhóm 1–2, **chưa có mảnh hạ tầng CMS nào của riêng Nhóm 3A được code** — đây
> là nhóm ít dở dang nhất, gần với "chưa code" nhất trong 3 plan đã viết lại.
> Trạng thái: **UI tĩnh xong 100% (đã khớp đúng nội dung yêu cầu), lớp CMS/khuôn dựng section
> dùng chung — chưa code.**

---

## 1. Mục tiêu Nhóm 3A

4 module có **cùng một khuôn**: render 1 khối nội dung từ `site_content`, 1 cây markup responsive,
tuân `DESIGN.md`, tự ẩn/fallback khi CMS trống. 3A **thiết lập khuôn dựng section** để Nhóm 3B
(Module 8–11, 18) tái dùng.

| Module | Requirement | File hiện tại | Trạng thái |
|--------|-------------|----------------|------------|
| 4 | Giá trị khác biệt (4.1 Sứ mệnh–Tầm nhìn, 4.2 3 giá trị cốt lõi) | `sections/AboutValues.tsx`, `id="ve-chung-toi"` | ✅ UI đúng AC 4.1/4.2 (equal-height 3 card đã đúng nhờ Tailwind `h-full`+`flex`) — ❌ hard-code trong JSX, chưa qua CMS (4.1/4.2 AC "chỉnh sửa được qua CMS") |
| 5 | Pain Points (5.1 danh sách) | `sections/PainPoints.tsx`, **chưa có `id`** | ✅ UI đúng AC 5.1 (4 item, tiêu đề+mô tả, không còn dead-code toggle) — ❌ hard-code, chưa CMS; chưa gắn `id` để `SectionAnchor` neo được |
| 6 | Quy trình 3 bước (6.1–6.3) | `sections/ProcessSteps.tsx`, `id="quy-trinh"` | ✅ UI đúng AC (3 bước, số/icon, heading đầy đủ, CTA cuối cuộn `#dang-ky`) — ❌ hard-code; đồng bộ Google Sheets/CSKH **ngoài phạm vi 3A** (Nhóm 4) |
| 7 | Lộ trình khóa học (7.1–7.3) | `sections/Courses.tsx`, `id="lo-trinh-hoc"` | ✅ UI đúng AC, **band điểm ĐÃ ĐÚNG theo yêu cầu** (3.0–5.0/5.0–6.5/7.0–7.5, khớp `07-lo-trinh-khoa-hoc-module.docx` §3) — ❌ hard-code, chưa CMS |

**Ngoài phạm vi Nhóm 3A** (không đổi so với bản gốc):
- Đồng bộ Google Sheets + chuyển CSKH (Module 6 AC) → vận hành/Nhóm 4. 3A chỉ hiển thị + nối CTA
  bước 1 tới `#dang-ky`.
- UI CMS sửa nội dung (Module 16) → Nhóm 4. 3A chỉ **seed** đúng convention Nhóm 2.
- Section 8–11 và Module 18 (Công nghệ ứng dụng) → Nhóm 3B.

---

## 2. Kiến trúc

### 2.1 Schema DB — thêm 4 hàng vào `site_content` đã có

`supabase/migrations/0003_landing_content_3a.sql` — không bảng mới, chỉ `INSERT ... ON CONFLICT`
4 block vào `public.site_content` (bảng + RLS đã có ở Nhóm 2).

**Khác với bản gốc: seed đúng nguyên văn nội dung ĐANG HIỂN THỊ THẬT** trên
`AboutValues.tsx`/`PainPoints.tsx`/`ProcessSteps.tsx`/`Courses.tsx` (không seed placeholder từ
`PRODUCT.md` như bản gốc — tránh lặp lại vấn đề số liệu lệch đã gặp ở Nhóm 2 §2.1). Shape `data`
(bổ sung vào `contentDefaults.ts`):

```
values {
  mission: { title, body } | null,        // "Sứ mệnh đào tạo" + nội dung thật
  vision:  { title, body } | null,        // "Tầm nhìn dài hạn" + nội dung thật
  core_values: [ { icon, title, description, tag } ]   // đúng 3; <3 → ẩn phần thiếu
}
pain_points {
  heading, subheading,
  items: [ { icon, title, description, tag } ]         // đúng 4 hiện tại, giới hạn khuyến nghị 3–6
}
process_steps {
  heading, subheading,
  steps: [ { n, icon, title, description, tag } ],      // đúng 3
  cta: { heading, subheading, label }                   // dải CTA cuối section, cuộn #dang-ky
}
courses {
  heading,
  groups: [ { band_label, band_target, name, description, features: [string], popular: bool, cta_label } ], // 3
}
```
- `icon`: lưu **chuỗi khoá Material Symbols** (project đã dùng `material-symbols-outlined` xuyên
  suốt UI hiện có, không phải `lucide-react` như bản gốc dự tính — giữ nguyên icon set đang dùng
  để không đổi giao diện). Không cần `iconMap.ts` sang lucide; chỉ cần validate chuỗi khoá hợp lệ.
- Field/khối `null` hoặc mảng rỗng → section (hoặc phần trong section) tự ẩn (4.1/5.1 edge).
  `is_published=false` toàn block → section trả `null`.

**Không có Edge Function / API endpoint mới.** Đọc: `useSiteContent()` (Nhóm 2). CTA: `<LeadForm>`
(Nhóm 1) hoặc cuộn tới `#dang-ky` (Nhóm 2 `useSmoothScroll`/`scrollToHash`).

### 2.2 Khuôn dựng section dùng chung (đóng góp chính của 3A — chưa có, cần viết mới)

```
src/features/user/
├── components/
│   ├── SectionShell.tsx        # MỚI: bọc <SectionAnchor id> + auto-hide khi `isEmpty`
│   ├── CtaLink.tsx              # MỚI: link/nút inline "Kiểm tra trình độ miễn phí" → #dang-ky
│   └── EqualHeightCards.tsx    # MỚI: grid `auto-rows-fr` + `h-full` (chuẩn hoá, các section hiện
│                                #      đã tự làm equal-height bằng `h-full`/`flex-col` rời rạc)
└── hooks/
    └── useSectionContent.ts    # MỚI (mỏng): bọc useSiteContent → { data, isEmpty } cho 1 block
```

**Quy ước khuôn** (áp dụng khi nối logic — KHÔNG đổi markup/class Tailwind hiện có):
1. `const { data, isEmpty } = useSectionContent('<block>');`
2. `if (isEmpty) return null;` — section biến mất hoàn toàn, không để vùng trắng.
3. Giữ nguyên `<section id="...">` hiện có (không đổi sang `<SectionShell>` bắt buộc — chỉ dùng
   `SectionShell` cho section MỚI ở Nhóm 3B; 4 section 3A đã có `id` đúng, không cần bọc lại).
4. Thay mảng hard-code (`STATS`, `PAINS`, `STEPS`, card cứng trong JSX) bằng `data.items`/`data.steps`/`data.groups` — **giữ nguyên className/JSX layout**, chỉ đổi nguồn dữ liệu.
5. CTA trong section dùng `<CtaLink>` cho chỗ lặp lại nhiều (thay vì sửa từng `<a href="#dang-ky">` rời rạc) — không bắt buộc, có thể giữ `<a>` hiện tại nếu đã đúng hành vi.

### 2.3 Chi tiết từng section (đối chiếu code thật — không có bước "viết lại" lớn, chỉ "nối")

**Module 4 — `AboutValues.tsx` (`id="ve-chung-toi"`, đã đúng, không đổi id)**
- Đã gộp Sứ mệnh+Tầm nhìn+3 giá trị trong 1 section (khác bản gốc: bản gốc tách riêng
  `ValuesSection` cạnh `CenterCardCarousel` — **không còn áp dụng** vì carousel không tồn tại).
  Không cần đổi cấu trúc trang, chỉ đổi nguồn dữ liệu 2 khối + mảng 3 card.
- Khối `mission`/`vision` là `null` → ẩn khối đó, khối còn lại chiếm full width (đổi
  `grid-cols-2` → `grid-cols-1` khi 1 khối ẩn — cần thêm logic điều kiện nhỏ trong JSX, hiện
  code cứng `md:grid-cols-2`).

**Module 5 — `PainPoints.tsx` (chưa có `id` — cần thêm `id="pain-points"`)**
- Thêm `id="pain-points"` vào `<section>` để `SectionAnchor`/dev có thể trỏ trực tiếp (hiện không
  có nav item, chỉ cần id để định vị/test, không đổi hành vi hiển thị).
- Thay mảng `PAINS` cứng bằng `data.items`; giữ đúng UI (4 item hiện tại, giới hạn khuyến nghị 6).
- `items` rỗng → `return null` (5.1 edge).

**Module 6 — `ProcessSteps.tsx` (`id="quy-trinh"`, đã đúng)**
- Thay mảng `STEPS` cứng bằng `data.steps`; heading/subheading/dải CTA cuối từ `data.cta`.
- Bước 1 đã liên kết đúng AC 6.1 (CTA chung của section cuộn `#dang-ky`) — không cần sửa hành vi.
- SLA 24h: giữ nguyên text hiện tại "Phản hồi tối đa 24 giờ" làm giá trị seed mặc định; câu hỏi
  "giờ hành chính hay giờ thực tế" trong AC edge case của `06-quy-trinh-3-buoc-module.docx` là
  **quyết định vận hành nội bộ (CSKH/Nhóm 4)**, không chặn việc nối UI ở 3A — xem §6.
- Đồng bộ Google Sheets + chuyển CSKH: **ngoài phạm vi 3A**, không code ở đây.

**Module 7 — `Courses.tsx` (`id="lo-trinh-hoc"`, đã đúng)**
- Band điểm hiện tại (**3.0–5.0 / 5.0–6.5 / 7.0–7.5**) **khớp đúng**
  `07-lo-trinh-khoa-hoc-module.docx` §3 — **không sửa**. (Lưu ý: bản `plan/03a` gốc từng chốt dải
  khác 3.5–4.5/5.0–6.0/6.5–7.5+ theo `PRODUCT.md` cũ — dải đó **không dùng nữa**, coi như bị
  yêu cầu chính thức ghi đè; xem §6.)
- Thay 3 khối card cứng bằng `data.groups`; giữ nguyên badge "Phổ biến nhất" cho nhóm
  `popular:true`, giữ style card giữa nổi bật (`border-2 border-primary-container`,
  `-translate-y-2`).
- Footnote "Chưa chắc trình độ hiện tại? Kiểm tra..." đã là link thật (`href="#dang-ky"`) — không
  cần sửa, chỉ chuyển câu chữ sang seed nếu Marketing cần đổi qua CMS sau.

### 2.4 Ghép vào trang + điều hướng

- Thứ tự `LandingPage.tsx` **giữ nguyên hoàn toàn** (Hero → TrustBar → AboutValues → PainPoints →
  ProcessSteps → Courses → Instructors → …) — không cần sắp xếp lại như bản gốc dự tính (không có
  carousel chen giữa).
- `config/sections.ts`: **không cần sửa** — 3/4 id (`ve-chung-toi`, `quy-trinh`, `lo-trinh-hoc`)
  đã có sẵn và khớp đúng; `pain-points` không cần vào `SECTIONS` vì không có mục menu (theo đúng
  yêu cầu 5.1, không có AC nào đòi hỏi mục nav riêng).
- `<Seo>` không đổi.

---

## 3. Trình tự triển khai (theo dependency)

| B | Việc | Phụ thuộc | Đầu ra kiểm chứng |
|---|------|-----------|-------------------|
| 1 | `0003_landing_content_3a.sql`: seed 4 block, lấy nguyên văn nội dung thật từ 4 file section hiện tại. Apply. Bổ sung `contentDefaults.ts` 4 shape (§2.1). `supabase gen types`. | Nhóm 2 B1 (site_content) | `GET site_content` bằng anon → có đủ 4 block mới, nội dung khớp UI hiện tại |
| 2 | `hooks/useSectionContent.ts`; `components/SectionShell.tsx`, `CtaLink.tsx`, `EqualHeightCards.tsx` (dùng cho Nhóm 3B, 3A có thể dùng `CtaLink` ngay). | 1, Nhóm 2 (`useSiteContent`) | Unit test `useSectionContent` (empty/merge) |
| 3 | Nối `AboutValues.tsx` vào `values` block; thêm logic ẩn khối mission/vision rỗng (đổi grid cols động). | 1, 2 | Seed `vision:null` → khối Tầm nhìn ẩn, Sứ mệnh full width |
| 4 | Nối `PainPoints.tsx` vào `pain_points` block; thêm `id="pain-points"`. | 1, 2 | Seed `items:[]` → section biến mất |
| 5 | Nối `ProcessSteps.tsx` vào `process_steps` block. | 1, 2 | Sửa 1 bước trong DB → step đổi trên trang, không cần build lại |
| 6 | Nối `Courses.tsx` vào `courses` block — **giữ nguyên band điểm hiện tại**, chỉ đổi nguồn dữ liệu. | 1, 2 | Band hiển thị vẫn đúng 3.0–5.0/5.0–6.5/7.0–7.5 sau khi đọc từ CMS |
| 7 | QA: Playwright §5.3 + `detect.mjs`; xác nhận band điểm nhất quán với Footer/Trust Bar. | 3–6 | Không P0/P1 mới; band nhất quán toàn trang |

---

## 4. File sẽ tạo / sửa

### Tạo mới
```
supabase/migrations/0003_landing_content_3a.sql
src/features/user/hooks/useSectionContent.ts
src/features/user/components/SectionShell.tsx
src/features/user/components/CtaLink.tsx
src/features/user/components/EqualHeightCards.tsx
tests/unit/useSectionContent.test.ts
tests/unit/content-3a-shape.test.ts
tests/e2e/sections-3a.spec.ts
```

### Sửa
```
src/features/user/config/contentDefaults.ts   # + 4 shape values/pain_points/process_steps/courses
src/features/user/sections/AboutValues.tsx    # nối useSectionContent('values'), grid động khi 1 khối rỗng
src/features/user/sections/PainPoints.tsx     # nối useSectionContent('pain_points'), thêm id="pain-points"
src/features/user/sections/ProcessSteps.tsx   # nối useSectionContent('process_steps')
src/features/user/sections/Courses.tsx        # nối useSectionContent('courses') — không đổi band điểm
database.types.ts                             # regen sau 0003
```

> **Không có file nào cần xoá** — khác với bản gốc (từng dự tính xoá `Steps.tsx`/sửa
> `CenterCardCarousel.tsx`), vì các file đó không còn tồn tại trong code thật.

---

## 5. Test plan

### 5.1 Unit (Vitest — cần cài, xem `plan/01-nen-tang-plan.md` bước B17)
| File | Ca kiểm |
|------|---------|
| `useSectionContent.test.ts` | block `is_published=false` → `isEmpty=true`; `items:[]`/`groups:[]` → `isEmpty=true`; merge default khi thiếu field |
| `content-3a-shape.test.ts` | `values.core_values.length <= 3`; `courses.groups.length === 3`; `process_steps.steps.length === 3`; `pain_points.items.length` trong khoảng 3–6 |

### 5.2 SQL / RLS
- anon `SELECT site_content where block in ('values','pain_points','process_steps','courses')` → 4 hàng.
- role `cskh` `UPDATE` các block này → chặn; `marketing` → OK (chuẩn bị cho Nhóm 4).

### 5.3 E2E (Playwright — skill `browser-automation`/`playwright-skill`)
| Mã | Kịch bản | Kỳ vọng | AC |
|----|----------|---------|-----|
| V-01 | Xem section "Vì sao chọn Huyway" | Hiện đúng 2 khối Sứ mệnh + Tầm nhìn + đúng 3 card | 4.1, 4.2 |
| V-02 | Seed `vision:null` | Khối Tầm nhìn ẩn, không để ô trống; Sứ mệnh full width | 4.1 edge |
| V-03 | 1 card giá trị có mô tả dài gấp đôi | 3 card vẫn bằng chiều cao (equal-height) | 4.2 edge |
| P-01 | Xem Pain Points | Mỗi item có tiêu đề + mô tả; đúng thứ tự seed | 5.1 |
| P-02 | Seed `items:[]` | Section **không** render, không vùng trắng | 5.1 edge |
| S-01 | Xem Quy trình 3 bước | Đúng 3 bước, có số + icon, đúng thứ tự, có heading | 6.1–6.3 |
| S-02 | Bấm CTA cuối section | Cuộn tới `<LeadForm>` (`#dang-ky`) | 6.1 |
| R-01 | Xem Lộ trình khóa học | 3 nhóm **3.0–5.0 / 5.0–6.5 / 7.0–7.5**, mỗi nhóm có mô tả + CTA | 7.1–7.3 |
| R-02 | Bấm CTA 1 nhóm + footnote | Cuộn tới form tư vấn (`#dang-ky`) | 7.1–7.3 |
| R-03 | So band điểm | `courses.groups[].band_target` khớp Footer (Trust Bar hiện không hiển thị band, không cần so) | 7 ràng buộc |
| R-04 | Nhóm `popular` | Badge "Phổ biến nhất" + viền nổi bật đúng `DESIGN.md` | 7 |

### 5.4 Build / tĩnh
- `npx tsc -b` + `npm run build` + `npx oxlint src` xanh sau mỗi bước ở §3.
- `node .impeccable/.../detect.mjs` trên 4 section: không P0/P1 mới.

---

## 6. Việc cần chốt / lưu ý (khác với quyết định cũ trong bản gốc)

1. **Band điểm khóa học**: bản gốc (2026-09-08) từng chốt dải 3.5–4.5/5.0–6.0/6.5–7.5+ theo
   `PRODUCT.md`. Tài liệu yêu cầu chính thức `07-lo-trinh-khoa-hoc-module.docx` (viết sau, dựa
   trên SRS.docx) lại ghi rõ **3.0–5.0/5.0–6.5/7.0–7.5** — đúng bằng dải đang hiển thị trên UI
   thật. **Dùng dải trong yêu cầu chính thức (khớp UI hiện tại), coi quyết định cũ trong
   `PRODUCT.md`/bản gốc là lỗi thời — không cần khách chốt lại, chỉ cần xác nhận lại 1 lần cho
   chắc trước khi seed.**
2. **Mốc "24h" ở Module 6** — vẫn là câu hỏi mở trong chính tài liệu yêu cầu (giờ hành chính hay
   giờ thực tế), thuộc phạm vi vận hành CSKH (Nhóm 4), **không chặn** việc nối UI ở Nhóm 3A.
3. **Icon set**: dùng tiếp `material-symbols-outlined` (đã có sẵn toàn site) thay vì đổi sang
   `lucide-react` như bản gốc — tránh phải đổi hàng loạt icon đang đúng thiết kế.
