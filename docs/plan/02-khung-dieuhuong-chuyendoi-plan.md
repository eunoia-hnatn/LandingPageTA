# Coding Plan — Nhóm 2: Khung điều hướng + Chuyển đổi + Liên hệ

> Nguồn yêu cầu: `docs/requirements/01-header-navigation-module.docx`,
> `02-hero-section-module.docx`, `03-trust-bar-module.docx`, `12-cta-band-form-module.docx`,
> `13-ban-do-footer-module.docx`.
> Phụ thuộc: **Nhóm 1** (component `<LeadForm>`, `AuthContext`, token `DESIGN.md`, Edge Function
> `submit-lead`, trang `/chinh-sach-bao-mat` — xem `docs/plan/01-nen-tang-plan.md`).
> Bản gốc của tài liệu này được duyệt với khách 2026-09-08 (tên cũ `02-khung-chuyendoi-plan.md`),
> bị xoá nhầm khỏi repo (commit `d6fbec4`), khôi phục từ git (`4d6ab6f`) 2026-09-09. Bản này viết
> lại theo đúng khung 4 mục khách yêu cầu, đồng thời **đối chiếu với code thực tế** — vì:
> 1) toàn bộ UI của Nhóm 2 đã được **port pixel-perfect từ `docs/design export/code.html`** ở một
>    đợt riêng (xem `docs/DECISIONS.md`), thay cho việc "viết lại theo DESIGN.md" như bản gốc dự tính;
> 2) lớp dữ liệu động (`site_content`, `useSiteContent`, `useScrollSpy`) **đã được code sẵn** khớp
>    gần đúng bản gốc, nhưng **chưa được nối vào** các component UI đã port — đây chính là phần
>    "logic" còn thiếu, đúng tinh thần quyết định "copy giao diện 100% trước, nối logic sau".
> Trạng thái: **UI xong 100%, logic (nối CMS + scroll-spy + CTA lặp lại + bản đồ thật) chưa nối**.

---

## 1. Mục tiêu Nhóm 2

| # | Hạng mục | Từ requirement | Trạng thái thực tế (2026-09-09) |
|---|----------|----------------|----------------------------------|
| A | Hợp đồng section-id dùng chung cho: section, menu Header, scroll-spy, smooth-scroll | 1.2 | ✅ `config/sections.ts` đã có, khớp id thật trong JSX (7 mục nav — xem §6 điểm 1 về lệch so với SRS) |
| B | Header sticky + logo + menu anchor cuộn mượt có offset + trạng thái active tự cập nhật + hamburger mobile | 1.1, 1.2 | ⚠️ Sticky + logo + cuộn mượt: ✅. **Trạng thái active theo scroll-spy: ❌ chưa nối** (`useScrollSpy` đã viết nhưng không nơi nào gọi). Hamburger mobile: ⚠️ cần kiểm tra riêng (xem §2.3) |
| C | Lớp nội dung động (`site_content`) — phía đọc của CMS (Module 16); section không hard-code, tự ẩn/fallback khi trống | 2.1, 3.1, 13.x | ⚠️ Bảng + hook đã có (`useSiteContent`, `contentDefaults`) nhưng **0 component nào gọi** — Hero/TrustBar/Footer/Map đang hard-code trực tiếp trong JSX |
| D | Hero: thông điệp above-the-fold từ CMS + form Lead đầy đủ field qua `<LeadForm>` + Thank-you + consent | 2.1, 2.2 | ⚠️ Layout/copy: ✅ (tĩnh). Form thật + CMS: ❌ — **trùng với bước B13 của `plan/01-nen-tang-plan.md`**, không lặp lại ở đây |
| E | Trust Bar: 4 số liệu từ CMS, có chú thích nguồn, định dạng nghìn, count-up tôn trọng reduced-motion | 3.1 | ⚠️ UI tĩnh đã đúng layout nhưng **hard-code 1 mảng `STATS` riêng, không khớp seed `site_content.trust_bar`** (số liệu lệch nhau — xem §2.1); không có count-up |
| F | CTA/Form lặp lại 3 vị trí, tái dùng `<LeadForm>` (không bản rút gọn), đổ về cùng nguồn Lead | 12.1 | ❌ `<CtaBand>` đã code nhưng **không được render ở bất kỳ đâu** trong `LandingPage.tsx` |
| G | Footer: liên hệ đa kênh (ẩn kênh thiếu) + link Chính sách + link chương trình đúng section | 13.2, 13.3 | ⚠️ UI đúng layout, link Chính sách đã đúng route; **liên hệ hard-code trong JSX** (không đọc `site_content.footer`, không thể tự ẩn kênh thiếu) |
| H | Bản đồ Google Maps nhúng + fallback text khi chặn/lỗi | 13.1 | ❌ `MapContact.tsx` đang dùng **ảnh nền tĩnh** (screenshot Google-hosted), không phải iframe thật, không có fallback |
| I | Dọn artifact mockup cũ (TopBar "9:41"/Signal/Battery, hover gradient tím FloatingCTA...) | — | ✅ **Đã tự hết** — UI được port lại hoàn toàn từ design export, không còn dấu vết mockup cũ; mục này coi như xong, không cần làm lại |

**Ngoài phạm vi Nhóm 2** (không đổi): các section nội dung 4–11 (Nhóm 3), UI CMS sửa nội dung
(Nhóm 4), đồng bộ Google Sheets (Nhóm 4). Module 18 "Công nghệ ứng dụng" (mới, xem
`docs/requirements/18-cong-nghe-ung-dung-module.docx`) — dựng section thuộc Nhóm 3B, Nhóm 2 chỉ
cần đảm bảo `sections.ts` có chỗ thêm mục nav khi Nhóm 3B xong (xem §6 điểm 1).

---

## 2. Kiến trúc

### 2.1 Schema DB — lớp nội dung động (đã tạo, seed cần đồng bộ lại)

`supabase/migrations/0002_site_content.sql` — **đã viết, đúng shape bản gốc**, bảng
`public.site_content(block text PK, data jsonb, is_published bool, updated_at, updated_by)`, RLS
anon SELECT khi `is_published`, `super_admin`/`marketing` ghi toàn quyền. **Chưa apply** (cùng lô
với migration Nhóm 1 — xem `plan/01-nen-tang-plan.md` bước B20).

**Vấn đề cần xử lý trước khi nối logic**: seed hiện tại trong migration **không khớp nội dung thật
đang hiển thị trên UI** (vì UI đã được port lại từ design export sau khi seed này được viết):

| Block | Seed hiện tại | UI thật đang hiển thị (design export) |
|-------|---------------|----------------------------------------|
| `trust_bar` | 10.000+ / 95% / +1.5 / 7.5+ | 10,000+ / 95% / 8.0+ / 10 năm |
| `footer.contact` | facebook có URL, tiktok rỗng | UI không phân biệt kênh thiếu (icon tĩnh, không ẩn) |
| `map` | `embed_url` tới Hà Nội chung chung | UI hiện dùng ảnh chụp tĩnh, chưa gắn địa chỉ cụ thể |

→ Cần **sửa migration seed** (hoặc thêm `0002b_site_content_resync.sql`) để khớp đúng số liệu/copy
thật trước khi component đọc từ CMS, tránh vừa nối xong vừa lộ số liệu sai trên trang thật.

### 2.2 Hợp đồng section-id — đã có, đã khớp JSX

`src/features/user/config/sections.ts` — 9 entries (`top`, `ve-chung-toi`, `lo-trinh-hoc`,
`quy-trinh`, `doi-ngu`, `cam-nhan-hoc-vien`, `cam-ket`, `faq`, `dang-ky`), export thêm
`navSections()` và `SPY_IDS`. Header.tsx hiện dùng đúng 7 id nav này trong `href`. **Không cần sửa
gì ở tầng hợp đồng** — chỉ còn thiếu bước nối `useScrollSpy(SPY_IDS)` vào Header (§2.3).

> Lưu ý lệch với tài liệu yêu cầu: `docs/requirements/01-header-navigation-module.docx` mô tả menu
> chỉ có **5 mục** (gồm cả "Công nghệ ứng dụng"), nhưng code thật có **7 mục** (thêm "Quy trình 3
> bước", "Cam kết đầu ra", "FAQ"; chưa có "Công nghệ ứng dụng"). Đây là quyết định để ngỏ — xem §6
> điểm 1, không tự ý sửa 1 trong 2 phía khi chưa chốt.

### 2.3 Component & hook — đã có phần khung, thiếu phần nối

```
src/features/user/
├── config/
│   ├── sections.ts             ✅ đã có (§2.2)
│   └── contentDefaults.ts      ✅ đã có — fallback cho hero/trust_bar/footer/map/seo
├── hooks/
│   ├── useSiteContent.ts       ✅ đã có — 0 nơi gọi thật (chỉ LandingPage.tsx nhắc tên trong comment)
│   ├── useScrollSpy.ts         ✅ đã có — 0 nơi gọi (dead code)
│   └── useSmoothScroll.ts      ✅ đã có, ĐANG DÙNG (`LandingPage.tsx`) — nhưng CHƯA tôn trọng
│                                  `prefers-reduced-motion` (luôn animate 900ms cứng)
├── components/
│   ├── Header.tsx              ✅ UI xong — ❌ chưa nối `useScrollSpy` (không có trạng thái active)
│   ├── Footer.tsx               ✅ UI xong — ❌ liên hệ hard-code, chưa đọc `site_content.footer`
│   ├── CtaBand.tsx              ✅ đã code (dùng `<LeadForm variant="inline">` + `scrollToHash`) — ❌ chưa render ở đâu
│   ├── FloatingCTA.tsx          ✅ xong, không cần sửa (mục I đã hết artifact cũ)
│   └── SectionAnchor.tsx        ✅ đã có
└── sections/
    ├── Hero.tsx                 ✅ UI xong — ❌ chưa đọc `site_content.hero`, form chưa thật (→ Nhóm 1 B13)
    ├── TrustBar.tsx              ✅ UI xong — ❌ hard-code mảng `STATS` riêng, không đọc `site_content.trust_bar`, không count-up
    └── MapContact.tsx            ✅ UI xong — ❌ dùng ảnh nền tĩnh thay vì iframe thật + fallback
```

**Cần viết mới**: `components/MapEmbed.tsx` (chưa tồn tại) — iframe `loading="lazy"` từ
`site_content.map.embed_url`, `onError`/timeout → fallback địa chỉ text + link "Xem trên Google
Maps"; nhúng vào đúng vị trí bản đồ trong `MapContact.tsx` (thay khối `background-image` tĩnh).

**`useScrollSpy(SPY_IDS)`** — gọi trong `Header.tsx`, dùng `activeId` trả về để thêm class active
(vd. `text-primary font-semibold`) lên đúng `<a>` đang khớp `href`.

**`useSiteContent()`** — gọi trong `Hero.tsx` (`content<HeroContent>('hero')`), `TrustBar.tsx`
(`content<TrustBarContent>('trust_bar')`, bỏ mảng `STATS` cứng), `Footer.tsx`
(`content<FooterContent>('footer')`, ẩn `<a>` kênh khi field rỗng), `MapContact.tsx`
(`content<MapContent>('map')`).

**`<CtaBand>`** — chèn vào `LandingPage.tsx` ở 3 vị trí, đúng 3 `source` đã có sẵn trong
`LEAD_SOURCES` (`src/shared/forms/rules.ts`) nhưng chưa dùng: `cta_after_hero` (sau `<TrustBar>`),
`cta_after_steps` (sau `<ProcessSteps>`), `cta_after_instructor` (sau `<Instructors>`).

### 2.4 SEO / responsive

- `<Seo routeKey="/">` đã gắn ở `LandingPage.tsx` (Nhóm 1), đọc `seoDefaults` tĩnh — **chưa đọc**
  `site_content.seo` để CMS ghi đè được (nối cùng đợt với Hero/TrustBar ở bước 3 dưới).
- Trust Bar: giữ nguyên grid 2×2 mobile / 4 cột desktop đã có; thêm `Intl.NumberFormat('vi-VN')`
  khi format số từ CMS (hiện số đang là chuỗi tĩnh viết tay, không cần format).

---

## 3. Trình tự triển khai (theo dependency)

| B | Việc | Phụ thuộc | Đầu ra kiểm chứng |
|---|------|-----------|-------------------|
| 1 | Viết `0002b_site_content_resync.sql`: cập nhật seed `trust_bar`/`footer`/`map` khớp đúng nội dung thật đang hiển thị trên UI (bảng đối chiếu §2.1). | Nhóm 1 B20 (apply) | Sau apply, `select data from site_content where block='trust_bar'` khớp 4 số đang hiển thị trên trang |
| 2 | Nối `useScrollSpy(SPY_IDS)` vào `Header.tsx`: thêm state active + class active lên `<a>` khớp `activeId`. | — | Cuộn tay qua từng section → đúng mục nav đổi màu active |
| 3 | Sửa `useSmoothScroll.ts`: kiểm `matchMedia('(prefers-reduced-motion: reduce)')` → nhảy tức thời thay vì animate 900ms; `console.warn` khi target không tồn tại. | — | Bật "Reduce motion" hệ điều hành → click anchor không animate |
| 4 | Nối `useSiteContent` vào `Hero.tsx` (headline/subheadline/proof_line/benefits) và `<Seo routeKey="/">` đọc `site_content.seo` khi có. | 1 | Sửa `site_content.hero` trong DB (SQL trực tiếp, chưa có UI CMS) → text trên trang đổi theo, không cần build lại |
| 5 | Nối `useSiteContent` vào `TrustBar.tsx`: bỏ mảng `STATS` cứng, đọc `trust_bar.items`, giữ nguyên hiển thị mọi item có `value` (không lọc theo `verified`), thêm count-up tôn trọng reduced-motion. | 1, 3 | Sửa 1 item trong DB → số trên trang đổi; reduced-motion → hiện số ngay không đếm |
| 6 | Nối `useSiteContent` vào `Footer.tsx`: contact/programs/description từ `footer` block, ẩn `<a>` khi field rỗng (vd. thiếu tiktok). | 1 | Xoá `tiktok` trong DB → icon Tiktok biến mất khỏi Footer |
| 7 | Viết `components/MapEmbed.tsx` + nối vào `MapContact.tsx`: iframe `site_content.map.embed_url`, `onError` → fallback text + link `maps_link`. | 1 | Chặn iframe (giả lập offline) → hiện fallback, không còn khung ảnh tĩnh |
| 8 | Chèn `<CtaBand source="cta_after_hero">`, `<CtaBand source="cta_after_steps">`, `<CtaBand source="cta_after_instructor">` vào đúng 3 vị trí trong `LandingPage.tsx`. | Nhóm 1 (`<LeadForm>` đã xong) | 3 vị trí đều submit ra đúng 3 `source` khác nhau trong `leads` |
| 9 | QA toàn bộ §5.3 bằng Playwright (skill `browser-automation`/`playwright-skill`) + `detect.mjs` đối chiếu `DESIGN.md`. | 1–8 | Không phát sinh P0/P1 mới trên các bề mặt Nhóm 2 |

> Bước B13 của `plan/01-nen-tang-plan.md` (nối `Hero.tsx` vào `submitLead` thật) **độc lập** với
> bước 4 ở trên (nối `Hero.tsx` vào `site_content` để đổi text) — có thể làm song song, không chặn
> nhau, nhưng cả hai đều sửa cùng 1 file nên nên gộp làm chung 1 commit để tránh conflict.

---

## 4. File sẽ tạo / sửa

### Tạo mới
```
supabase/migrations/0002b_site_content_resync.sql
src/features/user/components/MapEmbed.tsx
tests/unit/sections-contract.test.ts
tests/unit/useSiteContent.test.ts
tests/e2e/nav-scrollspy.spec.ts
tests/e2e/cta-band.spec.ts
tests/e2e/map-fallback.spec.ts
```

### Sửa
```
src/features/user/components/Header.tsx      # nối useScrollSpy → active state
src/features/user/hooks/useSmoothScroll.ts   # tôn trọng prefers-reduced-motion + warn target thiếu
src/features/user/sections/Hero.tsx          # đọc site_content.hero (song song B13 của Nhóm 1)
src/features/user/sections/TrustBar.tsx      # đọc site_content.trust_bar, bỏ mảng STATS cứng, count-up
src/features/user/components/Footer.tsx      # đọc site_content.footer, ẩn kênh rỗng
src/features/user/sections/MapContact.tsx    # thay ảnh nền tĩnh bằng <MapEmbed> đọc site_content.map
src/features/user/pages/LandingPage.tsx      # chèn 3 <CtaBand>, <Seo> đọc site_content.seo
```

### Không cần sửa (đã đúng, xác nhận lại để tránh làm lại)
```
src/features/user/config/sections.ts     # hợp đồng id đã khớp JSX
src/features/user/config/contentDefaults.ts
src/features/user/components/{FloatingCTA,SectionAnchor}.tsx
src/features/user/components/CtaBand.tsx  # chỉ cần RENDER thêm, không cần sửa logic
```

---

## 5. Test plan

### 5.1 Unit (Vitest — cần cài, xem `plan/01-nen-tang-plan.md` bước B17)
| File | Ca kiểm |
|------|---------|
| `sections-contract.test.ts` | mọi `SectionId` unique; `SPY_IDS` không chứa `'top'`/`'dang-ky'` (không phải điểm neo nội dung) |
| `useSiteContent.test.ts` | block thiếu field → merge `contentDefaults`; `is_published=false` → coi như trống; `trust_bar.items` giữ **nguyên** cả item `verified:false` (không lọc) |

### 5.2 SQL / RLS (sau khi apply — chung đợt Nhóm 1 B20)
- anon `SELECT site_content` → đủ 5 block; anon `UPDATE` → chặn.
- role `marketing` `UPDATE site_content` → OK; role `cskh` → chặn.

### 5.3 E2E (Playwright — skill `browser-automation`/`playwright-skill`)
| Mã | Kịch bản | Kỳ vọng | AC |
|----|----------|---------|----|
| N-01 | Bấm lần lượt từng mục menu desktop | Cuộn đúng section, không bị Header che | 1.2 |
| N-02 | Cuộn tay toàn trang | Mục nav active đổi theo section đang xem (scroll-spy) | 1.2 |
| N-03 | Mobile: mở hamburger, bấm 1 mục | Menu đóng + cuộn đúng section | 1.1 edge |
| N-04 | `prefers-reduced-motion` bật | Không animate 900ms, nhảy tức thời; count-up tắt | 1.x / 3.4 |
| C-01 | Submit ở CtaBand "sau Trust Bar" | Lead `source='cta_after_hero'` | 12.1 |
| C-02 | Submit ở CtaBand "sau Quy trình 3 bước" | Lead `source='cta_after_steps'` | 12.1 |
| C-03 | Submit ở CtaBand "sau Đội ngũ GV" | Lead `source='cta_after_instructor'` | 12.1 |
| C-04 | Đã submit ở Hero rồi submit lại CtaBand cùng SĐT | Không tạo bản ghi rác (dedupe server — đã có ở Nhóm 1) | 12.1 edge |
| T-01 | Sửa 1 item `trust_bar` trong DB | Số trên trang đổi mà không cần build lại | 3.1 |
| T-02 | Item `verified:false` trong CMS | Vẫn hiển thị số bình thường (verified chỉ là cờ nội bộ Admin) | 3.1 edge |
| F-01 | Xoá `tiktok` khỏi `site_content.footer` | Icon Tiktok ẩn khỏi Footer, không link trống | 13.2 edge |
| F-02 | Bấm link "Lộ trình học" ở Footer | Cuộn tới đúng section `lo-trinh-hoc` | 13.2 |
| M-01 | Bản đồ tải bình thường | iframe hiện marker đúng địa chỉ | 13.1 |
| M-02 | Chặn iframe (giả lập offline/CSP) | Fallback: địa chỉ text + link "Xem trên Google Maps" | 13.1 edge |
| S-01 | View-source `/` sau khi sửa `site_content.seo` | `<title>`/`meta description`/`og:image` đổi theo CMS | 17.3 |

### 5.4 Build / tĩnh
- `npx tsc -b` + `npm run build` + `npx oxlint src` xanh sau mỗi bước ở §3.
- `node .impeccable/.../detect.mjs`: Header/Hero/TrustBar/Footer/MapContact không phát sinh P0/P1 mới.

---

## 6. Việc cần chốt với khách

1. **Menu Header 7 mục vs 5 mục trong SRS**: `docs/requirements/01-header-navigation-module.docx`
   ghi 5 mục (có "Công nghệ ứng dụng", không có "Quy trình 3 bước"/"Cam kết đầu ra"/"FAQ"); code
   thật có 7 mục (ngược lại). Cần chốt: cập nhật lại tài liệu yêu cầu cho khớp code (khuyến nghị,
   vì 7 mục đang khớp đúng design export đã duyệt UI), hay sửa code về đúng 5 mục gốc? Khi Module 18
   (Công nghệ ứng dụng) dựng xong ở Nhóm 3B, cần thêm mục nav thứ 8 vào `sections.ts` — nên chốt
   luôn thứ tự chèn (đề xuất: giữa "Về chúng tôi" và "Lộ trình học", đúng vị trí trang đã bàn ở
   `docs/requirements/18-cong-nghe-ung-dung-module.docx`).
2. **Seed `site_content` lệch với UI thật** (§2.1) — xác nhận số liệu Trust Bar dùng bản nào làm
   chuẩn (bản trong migration cũ `10.000+/95%/+1.5/7.5+` hay bản đang hiển thị thật
   `10,000+/95%/8.0+/10 năm`) trước khi viết migration resync ở bước 1.
3. **Vị trí 3 `<CtaBand>`** — đề xuất giữ nguyên như bản gốc đã chốt (sau Hero/TrustBar, sau Quy
   trình 3 bước, sau Đội ngũ giáo viên); cần khách xác nhận lại vì thứ tự section trang hiện tại
   (TrustBar ngay sau Hero) hơi khác bản gốc (Hero → CenterCardCarousel → TrustBar).
