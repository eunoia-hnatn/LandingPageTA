# Coding Plan — Nhóm 3B: Section nội dung Landing (phần có tương tác) + Module 18

> Nguồn yêu cầu: `docs/requirements/08-doi-ngu-giao-vien-module.docx`,
> `09-testimonials-module.docx`, `10-cam-ket-dau-ra-module.docx`, `11-faq-module.docx`,
> `18-cong-nghe-ung-dung-module.docx` (mới, chưa có trong bản gốc).
> Phụ thuộc: **Nhóm 1** (`PolicyModal`, `DESIGN.md`), **Nhóm 2** (`site_content`,
> `useSiteContent`, `config/sections.ts`), **Nhóm 3A** (`useSectionContent` — nếu đã có, xem
> `docs/plan/03-section-tinh-plan.md`).
> Bản gốc (`03b-section-tuong-tac.md`, duyệt 2026-09-08) khôi phục từ git (`4d6ab6f`) được viết
> cho prototype cũ (`CenterCardCarousel`, `Instructor.tsx`, `SocialProof.tsx`, `MentorTeam.tsx`,
> đổi id `ve-huyway`↔`gia-tri-khac-biet`) — **toàn bộ không còn tồn tại**. Bản này viết lại từ
> code thật (`Instructors.tsx`, `Testimonials.tsx`, `Commitment.tsx`, `FAQ.tsx`) + thêm Module 18
> (không có trong bản gốc, xuất hiện sau khi khách yêu cầu bổ sung 2026-09-09).
> Trạng thái: **UI tĩnh xong cho Module 8–11 (khớp phần lớn AC, có vài lỗi/thiếu — xem §1);
> Module 18 chưa có UI, cần dựng mới hoàn toàn.**

---

## 1. Mục tiêu Nhóm 3B

| Module | File hiện tại | Trạng thái thực tế (2026-09-09) |
|--------|----------------|-----------------------------------|
| 8 — Đội ngũ giáo viên | `sections/Instructors.tsx`, `id="doi-ngu"` | ⚠️ UI card đúng AC 8.1 (ảnh+tên+chứng chỉ+KN+mô tả) nhưng là **lưới tĩnh 3 cột, KHÔNG có carousel** — AC 8.2 (nút Trước/Sau, dots, keyboard, swipe, aria-label) **chưa có gì**. Ảnh dùng URL Google-hosted tạm (rủi ro chặn tải như Hero — xem `plan/01-nen-tang-plan.md` mục F) |
| 9 — Testimonials | `sections/Testimonials.tsx`, `id="cam-nhan-hoc-vien"` | ⚠️ UI đúng AC (tên/avatar chữ cái, nội dung, kết quả band) nhưng **luôn hiển thị cứng, không có cơ chế ẩn khi rỗng** (9.1 AC), và mục nav "Cảm nhận học viên" **không** tự ẩn theo. Phát hiện thêm: `useSiteContent.ts` (Nhóm 2) đã có sẵn logic `emptyBlocks.add("hoc-vien")` nhưng **sai id** — section thật là `cam-nhan-hoc-vien`, không phải `hoc-vien` (bug tồn đọng từ Nhóm 2, sửa ở đây) |
| 10 — Cam kết đầu ra | `sections/Commitment.tsx`, `id="cam-ket"` | ⚠️ Modal đã có Esc + click-outside + nút X + scroll-lock (có cleanup đúng) + đủ 4 nhóm điều kiện (10.1 AC) — **thiếu focus-trap + trả focus về nút mở khi đóng** (10 "Ràng buộc kỹ thuật" bắt buộc). `PolicyModal` (Nhóm 1) cũng thiếu đúng 2 điểm này — sửa chung 1 lần |
| 11 — FAQ | `sections/FAQ.tsx`, `id="faq"` | ⚠️ Dùng **native `<details>/<summary>`** (accessible, keyboard/toggle miễn phí từ trình duyệt, không cần tự viết Accordion) — nhưng có **bug**: 2 câu hỏi đầu set cứng `open: true`, vi phạm AC "mỗi câu hỏi đóng mặc định". Đã "cho phép mở nhiều mục" tự nhiên (mỗi `<details>` độc lập) — khớp đề xuất mặc định của yêu cầu, không cần hỏi lại khách |
| 18 — Công nghệ ứng dụng (mới) | Chưa có file | ❌ Chưa dựng — xem `docs/requirements/18-cong-nghe-ung-dung-module.docx`: section "Trải nghiệm không gian học thuật số", 4 tab, trái là nội dung/phải là ảnh (placeholder "Chưa có ảnh") |

**Ngoài phạm vi Nhóm 3B:**
- Ảnh giáo viên/học viên thật, nội dung tab Module 18 thật → Marketing nhập qua CMS (Nhóm 4).
- Storage bucket `landing-media` cho upload ảnh → dời sang **Nhóm 4** (`docs/plan/04-mini-admin-plan.md`) vì 3B chỉ seed URL tĩnh, chưa có UI upload nào cần bucket ngay.
- Quy trình xin phép dùng tên/ảnh học viên (Module 9 phi CN) → vận hành, ngoài code.

---

## 2. Kiến trúc

### 2.1 Schema DB

`supabase/migrations/0004_landing_content_3b.sql` — không bảng mới, `INSERT ... ON CONFLICT` 5
block vào `public.site_content` (bảng đã có ở Nhóm 2), seed **nguyên văn nội dung thật** đang có
trong 4 file hiện tại (không seed placeholder mới) + 1 block mới cho Module 18.

```
instructors {
  heading, subheading,
  members: [ { name, role, score, tags: [string], bio, photo_url } ]  // 0 → ẩn cả section? Không —
}                                                                       // theo AC 8, luôn có ít nhất
                                                                        // đội ngũ thật; <=1 → ẩn nút/dots
testimonials {
  heading, subheading, note,                        // note: dòng "(*) 100% đánh giá..."
  items: [ { badge, quote, initials, name, role } ] // [] → section + mục nav "Cảm nhận học viên" ẩn
}
commitment {
  heading, headline, summary,
  highlights: [ { icon, title, description } ],      // 3 mục hiện tại
  cta_label,
  conditions: [ { title, body } ]                    // đúng 4 nhóm bắt buộc (10.1 AC)
}
faq {
  heading, subheading,
  items: [ { question, answer } ]                    // [] → section ẩn; KHÔNG có field `open` mặc định true nữa
}
tech_showcase {                                       // MỚI — Module 18
  heading,                                            // "Trải nghiệm không gian học thuật số"
  tabs: [ { label, title, body, image_url | null } ] // 4 tab; image_url null → placeholder "Chưa có ảnh"
}
```
- `photo_url`/`image_url` là URL text thường (không dùng Storage bucket ở 3B — xem §1 ngoài phạm vi).
- Field/khối rỗng → section hoặc phần tương ứng tự ẩn, theo đúng khuôn `useSectionContent` (Nhóm 3A).

**Không có Edge Function / API endpoint mới.**

### 2.2 Việc cần viết mới (nhẹ hơn nhiều so với bản gốc — xem lý do ở từng mục)

```
src/features/user/components/
├── ProfileCarousel.tsx   # MỚI — dùng swiper (đã có sẵn trong package.json, chưa dùng ở landing):
│                         #   modules Navigation+Pagination+Keyboard+A11y; nút Trước/Sau aria-label
│                         #   VI đầy đủ; ẩn control khi <=1 slide; debounce swipe.
├── RemoteImage.tsx       # MỚI (nhẹ) — <img> + onError → fallback avatar chữ cái/khung xám,
│                         #   dùng cho Instructors (ảnh Google-hosted tạm) + tech_showcase tab image.
└── TabPanel.tsx          # MỚI — cho Module 18: danh sách tab (role="tablist"/"tab"/"tabpanel"
                          #   theo WAI-ARIA Tabs pattern), keyboard mũi tên trái/phải đổi tab.
src/shared/hooks/
└── useFocusTrap.ts       # MỚI (nhẹ, ~30 dòng) — bọc 1 ref, Tab/Shift+Tab quẩn trong modal,
                          #   dùng chung cho PolicyModal (Nhóm 1) VÀ Commitment modal.
```

**Không cần viết** (khác bản gốc — lý do):
- ~~`Accordion.tsx`~~ — `FAQ.tsx` dùng native `<details>/<summary>`, đã accessible & hỗ trợ
  "mở nhiều mục" miễn phí; viết lại bằng `<div>`/`<button>` tự chế sẽ **thụt lùi** so với hiện tại.
  Chỉ sửa bug `open: true` cứng (§1).
- ~~`Modal.tsx` (component riêng)~~ — 2 modal hiện có (`PolicyModal`, `Commitment`) đã tự đủ Esc +
  backdrop + scroll-lock; chỉ thiếu **1 hành vi chung** (focus-trap + trả focus) → tách thành
  **1 hook `useFocusTrap`** dùng lại ở cả 2 nơi, không cần bọc lại toàn bộ JSX modal thành
  component chung (tránh sửa 2 nơi thành rebuild lớn không cần thiết).
- ~~`SocialProofStats`/`ket-qua-thuc-te`~~ — không tồn tại trong thiết kế hiện tại; số liệu
  95%/10.000+ đã nằm trong Trust Bar (Nhóm 2), không có section trùng lặp cần tách.
- ~~Đổi `ve-huyway`↔`gia-tri-khac-biet`, xoá `MentorTeam.tsx`/`CenterCardCarousel.tsx`~~ — các
  file/id này không tồn tại trong code thật, không có gì để đổi/xoá.

### 2.3 Chi tiết từng module

**Module 8 — `Instructors.tsx` (`id="doi-ngu"`, giữ nguyên id)**
- Bọc mảng `TEACHERS` (đổi tên `members` từ CMS) trong `<ProfileCarousel>`: `slidesPerView` 1
  (mobile) / 3 (desktop, khớp layout 3 cột hiện tại) — khi đúng 3 phần tử và đủ chỗ desktop có thể
  hiện cả 3 không cần trượt, nhưng **vẫn phải có** carousel control theo đúng AC 8.2 (yêu cầu không
  điều kiện theo số lượng, trừ trường hợp `<=1` thì ẩn hẳn control).
- Ảnh qua `<RemoteImage>` thay `<img>` trực tiếp — fallback khi URL Google-hosted bị chặn (đồng bộ
  vấn đề đã ghi nhận ở Hero, `plan/01-nen-tang-plan.md` mục F).

**Module 9 — `Testimonials.tsx` (`id="cam-nhan-hoc-vien"`, giữ nguyên id)**
- `items.length === 0` → `return null`.
- Sửa `useSiteContent.ts` (Nhóm 2): đổi `emptyBlocks.add("hoc-vien")` → `add("cam-nhan-hoc-vien")`
  (bug id sai — xem §1). Việc Header thực sự lọc nav theo `emptyBlocks` vẫn phụ thuộc Header nối
  `useSiteContent`/`useScrollSpy` (đã ghi trong `plan/02-khung-dieuhuong-chuyendoi-plan.md` bước 2)
  — 3B chỉ đảm bảo tín hiệu đúng, không lặp lại việc sửa Header.

**Module 10 — `Commitment.tsx` (`id="cam-ket"`, giữ nguyên id)**
- Thêm `useFocusTrap` (giữ nguyên state `open`/Esc/scroll-lock hiện có, không viết lại toàn bộ).
- Khi mở: focus vào nút X (giống `PolicyModal` đã làm); khi đóng: trả focus về nút "Xem chi tiết
  điều kiện áp dụng" đã bấm mở modal (dùng `useRef` lưu trigger).
- Refactor `PolicyModal.tsx` (Nhóm 1) dùng cùng `useFocusTrap` — sửa 1 chỗ, khớp cả 2 modal.

**Module 11 — `FAQ.tsx` (`id="faq"`, giữ nguyên id)**
- Bỏ `open: true` cứng ở 2 item đầu → mọi câu hỏi mặc định đóng (đúng AC 11.1).
- Giữ nguyên `<details>/<summary>` + icon xoay — không đổi sang Accordion tự chế.
- `items.length === 0` → `return null`.

**Module 18 — `TechShowcase.tsx` (mới, `id="cong-nghe"`)**
- Section mới hoàn toàn theo đúng mô tả `18-cong-nghe-ung-dung-module.docx`: heading "Trải nghiệm
  không gian học thuật số"; `<TabPanel>` 4 tab; trái = `title`+`body` của tab đang chọn, phải =
  `<RemoteImage>` hoặc khối "Chưa có ảnh" (`image_url == null`) kích thước cố định (không layout
  shift khi thêm ảnh thật sau).
- Đặt vị trí trong `LandingPage.tsx` giữa `AboutValues` và `PainPoints` (đúng đề xuất đã ghi trong
  `plan/02-khung-dieuhuong-chuyendoi-plan.md` §6 điểm 1: giữa "Về chúng tôi" và "Lộ trình học").
- Thêm mục nav "Công nghệ ứng dụng" vào `config/sections.ts` ở đúng vị trí thứ tự này (mở khoá
  mục menu thứ 8 — cần khách xác nhận lại theo đúng điểm đang để ngỏ ở §6 Nhóm 2).

### 2.4 Ghép vào trang

`LandingPage.tsx` thứ tự sau 3B: `Hero → TrustBar → AboutValues → TechShowcase(mới, Module 18) →
PainPoints → ProcessSteps → Courses → Instructors → Testimonials → Commitment → FAQ → MapContact`.

---

## 3. Trình tự triển khai (theo dependency)

| B | Việc | Phụ thuộc | Đầu ra kiểm chứng |
|---|------|-----------|-------------------|
| 1 | `0004_landing_content_3b.sql`: seed 5 block (4 nội dung thật + `tech_showcase` mới theo yêu cầu Module 18). Apply. `contentDefaults.ts` + 5 shape. `supabase gen types`. | Nhóm 2 B1 | `GET site_content` anon → đủ 5 block |
| 2 | `src/shared/hooks/useFocusTrap.ts`. Refactor `PolicyModal.tsx` + `Commitment.tsx` dùng hook này. | — | Tab quẩn trong modal; đóng modal → focus về đúng nút đã mở |
| 3 | `components/RemoteImage.tsx`. Nối vào `Instructors.tsx` (thay `<img>` trực tiếp). | — | Chặn URL ảnh (giả lập) → hiện fallback, không icon vỡ ảnh |
| 4 | `components/ProfileCarousel.tsx` (bọc `swiper`). Nối `Instructors.tsx`: `members` từ CMS, carousel đủ nút/dots/keyboard/swipe theo AC 8.2. | 3 | `<=1` thành viên → ẩn control; mũi tên bàn phím đổi slide khi focus |
| 5 | Nối `Testimonials.tsx` vào `testimonials` block; sửa bug id `hoc-vien`→`cam-nhan-hoc-vien` trong `useSiteContent.ts`. | 1 | Seed `items:[]` → section ẩn; `emptyBlocks` chứa đúng id thật |
| 6 | Sửa `FAQ.tsx`: bỏ `open:true` cứng, nối `faq` block. | 1 | Tải trang → mọi câu hỏi đóng mặc định |
| 7 | `components/TabPanel.tsx` (WAI-ARIA Tabs pattern). Viết `TechShowcase.tsx` (Module 18) dùng `TabPanel` + `RemoteImage`. Thêm `id="cong-nghe"` + mục nav vào `config/sections.ts`. Chèn vào `LandingPage.tsx`. | 1, 3 | 4 tab chuyển đúng nội dung; tab chưa có ảnh → hiện "Chưa có ảnh"; mục nav "Công nghệ ứng dụng" cuộn đúng |
| 8 | QA a11y: Playwright §5.3 + `detect.mjs` + kiểm keyboard/focus-trap/ARIA. | 2–7 | Không P0/P1 a11y còn lại |

---

## 4. File sẽ tạo / sửa

### Tạo mới
```
supabase/migrations/0004_landing_content_3b.sql
src/shared/hooks/useFocusTrap.ts
src/features/user/components/RemoteImage.tsx
src/features/user/components/ProfileCarousel.tsx
src/features/user/components/TabPanel.tsx
src/features/user/sections/TechShowcase.tsx
tests/unit/useFocusTrap.test.ts
tests/unit/content-3b-shape.test.ts
tests/e2e/sections-3b-a11y.spec.ts
```

### Sửa
```
src/features/user/config/contentDefaults.ts   # + shape instructors/testimonials/commitment/faq/tech_showcase
src/features/user/config/sections.ts          # + 'cong-nghe' (nav: 'Công nghệ ứng dụng'), đúng thứ tự
src/shared/components/PolicyModal.tsx         # dùng useFocusTrap
src/features/user/sections/Instructors.tsx    # ProfileCarousel + RemoteImage + CMS
src/features/user/sections/Testimonials.tsx   # CMS + ẩn khi rỗng
src/features/user/sections/Commitment.tsx     # useFocusTrap + CMS
src/features/user/sections/FAQ.tsx            # bỏ open:true cứng + CMS
src/features/user/hooks/useSiteContent.ts     # sửa id 'hoc-vien' → 'cam-nhan-hoc-vien'
src/features/user/pages/LandingPage.tsx       # chèn <TechShowcase>
database.types.ts                             # regen sau 0004
```

---

## 5. Test plan

### 5.1 Unit (Vitest + @testing-library/react)
| File | Ca kiểm |
|------|---------|
| `useFocusTrap.test.ts` | Tab ở phần tử cuối → quay lại phần tử đầu trong modal; Shift+Tab ở đầu → nhảy tới cuối; unmount → không còn giữ focus lỗi |
| `content-3b-shape.test.ts` | `commitment.conditions.length === 4`; `faq.items[].answer` không rỗng; `tech_showcase.tabs.length === 4`; `testimonials.items:[]` → `isEmpty` |

### 5.2 SQL / RLS
- anon `SELECT site_content` 5 block mới → OK; anon `UPDATE` → chặn.

### 5.3 E2E (Playwright — skill `browser-automation`/`playwright-skill`)
| Mã | Kịch bản | Kỳ vọng | AC |
|----|----------|---------|-----|
| I-01 | Bấm nút "Xem giáo viên tiếp theo" / dots | Đổi slide đúng; dots phản ánh vị trí | 8.2 |
| I-02 | Focus carousel, nhấn `→`/`←` | Đổi slide | 8.2 |
| I-03 | Vuốt trên mobile (emulate) | Đổi slide; vuốt nhanh không nhảy nhiều slide | 8.2 edge |
| I-04 | Nút Trước/Sau bằng screen reader | Đọc "Xem giáo viên trước/tiếp theo" | 8.2 |
| I-05 | Seed `members` chỉ 1 GV | Ẩn nút Trước/Sau + dots | 8.2 edge |
| I-06 | Ảnh GV tải chậm/lỗi | Fallback hiện, không layout shift | 8.1 edge |
| TS-01 | Seed `testimonials.items:[]` | Section ẩn **và** mục nav "Cảm nhận học viên" ẩn | 9.1 edge |
| CM-01 | Bấm "Xem điều kiện áp dụng" → Tab liên tục | Focus quẩn trong modal, không thoát ra ngoài | 10.1 phi CN |
| CM-02 | Đóng modal (X/Esc/click ngoài) | Focus trả về đúng nút đã mở | 10.1 phi CN |
| CM-03 | Nội dung modal | Đủ 4 nhóm điều kiện | 10.1 |
| FQ-01 | Tải trang, chưa bấm gì | **Mọi** câu hỏi đóng | 11.1 |
| FQ-02 | Bấm mở 2 câu hỏi | Cả hai cùng mở (không tự đóng câu kia) | 11.1 |
| FQ-03 | Seed `faq.items:[]` | Section ẩn | 11.1 edge |
| TC-01 | Xem section Module 18 | Heading "Trải nghiệm không gian học thuật số", 4 tab | 18 |
| TC-02 | Bấm từng tab | Nội dung trái đổi; phải đổi ảnh hoặc "Chưa có ảnh" nếu `image_url=null` | 18 |
| TC-03 | Bấm mục nav "Công nghệ ứng dụng" | Cuộn đúng tới `TechShowcase` | 18 |
| TC-04 | Tab bằng bàn phím (mũi tên trái/phải khi tab đang focus) | Đổi tab đúng WAI-ARIA Tabs pattern | 18 |

### 5.4 Build / tĩnh
- `npx tsc -b` + `npm run build` + `npx oxlint src` xanh.
- `node .impeccable/.../detect.mjs`: không P0/P1 mới.
- axe/Lighthouse a11y trên `/` — carousel/modal/tabs là điểm dễ rớt điểm, kiểm riêng.

---

## 6. Lưu ý khác với bản gốc

1. Thiết kế hiện tại **không có** section "Kết quả thực tế" (`SocialProofStats`) tách riêng như
   bản gốc dự tính — số liệu 95%/10.000+ đã nằm sẵn trong Trust Bar (Nhóm 2). Không cần dựng lại.
2. `Accordion.tsx`/`Modal.tsx` dùng chung theo bản gốc bị thay bằng giải pháp nhẹ hơn (native
   `<details>` + hook `useFocusTrap`) vì code thật đã đi theo hướng đơn giản hơn — giữ nguyên
   hướng đó thay vì rebuild lớn.
3. Vị trí + việc mở khóa mục nav "Công nghệ ứng dụng" (Module 18) cần khách xác nhận cuối cùng —
   đã nêu ở `plan/02-khung-dieuhuong-chuyendoi-plan.md` §6 điểm 1, nhắc lại ở đây vì Module 18
   thuộc phạm vi triển khai của Nhóm 3B.
