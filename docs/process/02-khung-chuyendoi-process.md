# Process log — Nhóm 2: Khung Landing + Điều hướng + Chuyển đổi + Liên hệ

> Nguồn: `docs/plan/02-khung-chuyendoi-plan.md`.
> Format mỗi dòng: `[timestamp] - [bước] - [trạng thái] - [ghi chú]`

## Bối cảnh (2026-09-09)
- Plan 02 viết cho baseline `feat/admin-dashboard` (React 18 / Tailwind 3 / react-router / `src/features/{admin,user}`).
  `main` là reboot khác (React 19 / Tailwind 4 / oxlint / admin phẳng). **Không merge được** nhánh đó.
- Chốt với khách:
  1. **Port tối thiểu** landing từ `feat/admin-dashboard` sang `main`: bưng các section 4–11 làm nền;
     Hero/Header/TopBar/Footer/TrustBar dựng mới trong Nhóm 2.
  2. Làm nốt prerequisite Nhóm 1 (`<LeadForm>` + fields + `submit-lead` + `rules.ts` + token DESIGN.md
     + `/chinh-sach-bao-mat` + `<Seo>` + `react-helmet-async`) TRƯỚC, rồi mới Nhóm 2.
- Blocker chung: Supabase MCP chưa uỷ quyền → migration 0001 + 0002 + Edge Functions viết file, khách tự apply.

---

[2026-09-09 05:20] - B0 khảo sát + chốt hướng - done - Xác định feat/admin-dashboard là baseline cũ khác toolchain; hỏi khách 2 câu. Chốt: port tối thiểu + làm prereq Nhóm 1 trước.

## Phase A — Port landing skeleton sang main
[2026-09-09 05:35] - PA.1 deps + alias - done - npm i react-router-dom + swiper. Thêm alias @user/@admin/@shared vào vite.config.ts + tsconfig.app.json.
[2026-09-09 05:40] - PA.2 port file landing - done - git checkout feat/admin-dashboard -- các file: sections (Hero, Stats, PainPoints, Steps, Courses, Instructor, Testimonials, FAQ, SocialProof, MentorTeam, CenterCardCarousel), components (Header, TopBar, Footer, FloatingCTA), hooks (useSmoothScroll, useScrollAnimation), user.css, assets/ThayHuy1. Sửa user.css: bỏ directive Tailwind v3, bỏ rule font toàn cục, thêm @media reduced-motion.
[2026-09-09 05:45] - PA.3 routing - done - src/RootApp.tsx (BrowserRouter: /admin/* → AdminApp, /* → UserApp; AuthProvider nâng lên trên router). src/features/user/UserApp.tsx. main.tsx → RootApp. App.tsx bỏ wrapper AuthProvider (giữ ProtectedRoute).
[2026-09-09 05:48] - PA.4 fix build - done - Bỏ 5 unused var trong file port (Share2, mobileExpanded, toggle/openIndex PainPoints, Star). `tsc -b` + `npm run build` + `oxlint src` xanh.
[2026-09-09 05:52] - PA.5 QA browser - done - `/` render 10 section, hero "Chưa biết nên bắt đầu IELTS từ đâu?", header+footer, 0 lỗi console/network. `/admin` → LoginPage (ProtectedRoute). Supabase getSession() chạy OK với anon key .env.

> ⚠ Các file landing đang là MOCKUP nguyên trạng từ nhánh cũ (font-['Inter'] hardcode, w-[1200px], form giả, chưa nối Supabase, id anchor rời rạc). Nhóm 2 viết lại theo plan 02.

## Phase B — Prereq Nhóm 1 (XONG phần cốt lõi 2026-09-09)
[2026-09-09 06:00] - PB.1 token DESIGN.md - done - index.html: Inter→Montserrat + meta description/OG + title thật. index.css @theme: --font-sans/display Montserrat, thêm token brand (scholar-indigo, wayfinder-orange, ink, hairline…), --color-primary admin #2563eb→#2C3481, rule h1-h6 Montserrat 600 #000.
[2026-09-09 06:05] - PB.2 Seo - done - React 19 hoist <title>/<meta> native → KHÔNG cần react-helmet-async. src/shared/components/Seo.tsx + src/shared/config/seo.ts (seoDefaults per route). Gắn <Seo> vào LandingPage + PrivacyPolicyPage.
[2026-09-09 06:15] - PB.3 forms layer - done - src/shared/forms/{rules,validators,useFormState}.ts + fields/{TextField,SelectField,TextAreaField,ConsentCheckbox}.tsx. rules.ts = nguồn chân lý (VN_PHONE_RE, EMAIL_RE, normalizePhone, validateLead). useFormState: idle/loading/success/error + timeout 15s + chống double-submit.
[2026-09-09 06:22] - PB.4 LeadForm - done - src/shared/LeadForm/{LeadForm,LeadFormSuccess}.tsx + submitLead.ts (gọi Edge Function). Props: source, variant(card|inline), onSuccess. Đủ field Module 2.2, consent không tick sẵn + link mở PolicyModal.
[2026-09-09 06:30] - PB.5 submit-lead Edge - done - supabase/functions/submit-lead/index.ts + _shared/rules.ts (bản sao khớp client). Validate lại server-side, normalize phone, "Lead mới thắng" (ghi đè theo phone_normalized, giữ id/created_at). config.toml verify_jwt=false.
[2026-09-09 06:35] - PB.6 migration leads+policy - done - supabase/migrations/0001b_leads_policy.sql: enum lead_status/lead_source, normalize_phone(), bảng leads (CHECK phone/email/consent/len) + trigger, bảng policy_documents + seed bản 0.1-draft, RLS (anon KHÔNG insert leads trực tiếp; cskh/super_admin đọc leads; marketing KHÔNG thấy leads). CHƯA apply.
[2026-09-09 06:42] - PB.7 policy UI - done - src/shared/hooks/usePolicyDocument.ts (fetch + fallback tĩnh + timeout 6s), src/shared/config/policyFallback.ts, src/shared/components/PolicyModal.tsx (Esc/backdrop/scroll-lock, react-markdown), src/features/user/pages/PrivacyPolicyPage.tsx + route /chinh-sach-bao-mat trong UserApp. npm i react-markdown remark-gfm.
[2026-09-09 06:48] - PB QA - done - `tsc -b` + `npm run build` + `oxlint src` xanh. Browser: `/` title từ Seo OK; `/chinh-sach-bao-mat` render policy (fallback vì DB chưa seed), font Montserrat, 0 lỗi console (404 policy_documents là do migration chưa apply).

### Phase B — còn lại (không chặn Phase C)
- [ ] `public/og-default.png`, `public/robots.txt`, `public/sitemap.xml` (plan 01 B10)
- [ ] Unit test validators/useFormState/rules-parity (vitest chưa cài)
- [ ] Migration 0001b + submit-lead deploy → KHÁCH tự apply (Supabase MCP chưa uỷ quyền). Xem supabase/README.md.

## Phase C — Nhóm 2: NỀN TẢNG (XONG 2026-09-09) — unblock 3A/3B
[2026-09-09 07:05] - PC.1 section-id contract - done - src/features/user/config/sections.ts: SECTIONS (top, ve-huyway, cong-nghe[comingSoon], lo-trinh-hoc, giang-vien, hoc-vien[hideWhenEmpty], cam-ket, ket-qua-thuc-te, faq, dang-ky) + navSections(emptyIds) + SPY_IDS + LEAD_ANCHOR_ID.
[2026-09-09 07:10] - PC.2 contentDefaults - done - src/features/user/config/contentDefaults.ts: shape + fallback tĩnh cho hero/trust_bar/footer/map/seo (nội dung placeholder). Interface ContentBlocks mở rộng cho 3A/3B.
[2026-09-09 07:18] - PC.3 useSiteContent - done - src/features/user/hooks/useSiteContent.ts: 1 request site_content, cache module-level, content(block) deep-merge lên default, isBlockEmpty(block,itemsKey), emptyBlocks set, timeout 6s. __resetSiteContentCache cho test.
[2026-09-09 07:22] - PC.4 useScrollSpy - done - src/features/user/hooks/useScrollSpy.ts: IntersectionObserver, rootMargin bù header, trả activeId theo tỉ lệ hiển thị + thứ tự tài liệu.
[2026-09-09 07:25] - PC.5 SectionAnchor - done - src/features/user/components/SectionAnchor.tsx: <section id> + scroll-mt, cảnh báo dev nếu id ngoài hợp đồng.
[2026-09-09 07:30] - PC.6 CtaBand - done - src/features/user/components/CtaBand.tsx: dải CTA bọc <LeadForm variant=inline>; mobile mặc định render nút cuộn tới #dang-ky.
[2026-09-09 07:35] - PC.7 migration 0002 - done - supabase/migrations/0002_site_content.sql: bảng site_content + trigger updated_at + RLS (anon đọc is_published; super_admin/marketing ghi) + seed 5 block. CHƯA apply.
[2026-09-09 07:40] - PC QA - done - tsc + build + oxlint xanh.

### Phase C — CÒN LẠI (Nhóm 2 §3 — các bước viết lại section, KHÔNG chặn 3A/3B nền)
- [ ] B5 TopBar viết lại (bỏ artifact 9:41/Signal/Battery, nền indigo, hotline CMS)
- [ ] B6 Header viết lại: nav từ SECTIONS + useScrollSpy active + hamburger + nút "Đăng ký tư vấn"→#dang-ky
- [ ] B7 Hero viết lại: 1 cây responsive, nội dung useSiteContent('hero'), <LeadForm source=landing_hero> trong wrapper id="dang-ky"
- [ ] B8 TrustBar.tsx thay Stats.tsx: 4 số từ CMS + Intl.NumberFormat + count-up honor reduced-motion
- [ ] B9 chèn 3 <CtaBand> (sau CenterCard / Steps / Instructor)
- [ ] B10 Footer viết lại: useSiteContent('footer'), ẩn kênh rỗng, link section, năm động
- [ ] B11 MapEmbed.tsx trong Footer: iframe lazy + fallback text
- [ ] B12 FloatingCTA: bỏ hover gradient tím, back-to-top DESIGN.md
- [ ] B3 sửa useSmoothScroll: reduced-motion + offset TopBar+Header + warn; useScrollAnimation bỏ rủi ro kẹt opacity:0

## (cũ) Nhóm 2 (CHƯA BẮT ĐẦU) — 14 bước theo plan 02 §3 — xem checklist Phase C ở trên

---
## Nhật ký auto-edit (hook)
[2026-09-09 04:45] - auto-edit - done - vite.config.ts
[2026-09-09 04:45] - auto-edit - done - tsconfig.app.json
[2026-09-09 04:46] - auto-edit - done - src/features/user/user.css
[2026-09-09 04:47] - auto-edit - done - src/features/user/UserApp.tsx
[2026-09-09 04:47] - auto-edit - done - src/RootApp.tsx
[2026-09-09 04:47] - auto-edit - done - src/App.tsx
[2026-09-09 04:47] - auto-edit - done - src/App.tsx
[2026-09-09 04:48] - auto-edit - done - src/main.tsx
[2026-09-09 04:48] - auto-edit - done - src/features/user/sections/PainPoints.tsx
[2026-09-09 04:48] - auto-edit - done - src/features/user/sections/PainPoints.tsx
[2026-09-09 04:48] - auto-edit - done - src/features/user/components/Footer.tsx
[2026-09-09 04:49] - auto-edit - done - src/features/user/components/Header.tsx
[2026-09-09 04:49] - auto-edit - done - src/features/user/sections/Testimonials.tsx
[2026-09-09 04:54] - auto-edit - done - index.html
[2026-09-09 04:54] - auto-edit - done - src/index.css
[2026-09-09 04:55] - auto-edit - done - src/index.css
[2026-09-09 04:55] - auto-edit - done - src/shared/config/seo.ts
[2026-09-09 04:55] - auto-edit - done - src/shared/components/Seo.tsx
[2026-09-09 04:56] - auto-edit - done - src/shared/forms/rules.ts
[2026-09-09 04:56] - auto-edit - done - src/shared/forms/validators.ts
[2026-09-09 04:56] - auto-edit - done - src/shared/forms/useFormState.ts
[2026-09-09 04:56] - auto-edit - done - src/shared/forms/fields/TextField.tsx
[2026-09-09 04:56] - auto-edit - done - src/shared/forms/fields/TextAreaField.tsx
[2026-09-09 04:56] - auto-edit - done - src/shared/forms/fields/SelectField.tsx
[2026-09-09 04:57] - auto-edit - done - src/shared/forms/fields/ConsentCheckbox.tsx
[2026-09-09 04:57] - auto-edit - done - src/shared/forms/fields/ConsentCheckbox.tsx
[2026-09-09 04:57] - auto-edit - done - src/shared/LeadForm/submitLead.ts
[2026-09-09 04:57] - auto-edit - done - src/shared/hooks/usePolicyDocument.ts
[2026-09-09 04:58] - auto-edit - done - src/shared/config/policyFallback.ts
[2026-09-09 04:58] - auto-edit - done - src/shared/components/PolicyModal.tsx
[2026-09-09 04:58] - auto-edit - done - src/shared/LeadForm/LeadFormSuccess.tsx
[2026-09-09 04:59] - auto-edit - done - src/shared/LeadForm/LeadForm.tsx
[2026-09-09 04:59] - auto-edit - done - supabase/migrations/0001b_leads_policy.sql
[2026-09-09 04:59] - auto-edit - done - supabase/functions/_shared/rules.ts
[2026-09-09 05:00] - auto-edit - done - supabase/functions/submit-lead/index.ts
[2026-09-09 05:00] - auto-edit - done - supabase/config.toml
[2026-09-09 05:00] - auto-edit - done - src/features/user/pages/PrivacyPolicyPage.tsx
[2026-09-09 05:00] - auto-edit - done - src/features/user/UserApp.tsx
[2026-09-09 05:00] - auto-edit - done - src/features/user/pages/LandingPage.tsx
[2026-09-09 05:02] - auto-edit - done - src/shared/hooks/usePolicyDocument.ts
[2026-09-09 05:04] - auto-edit - done - supabase/README.md
[2026-09-09 05:05] - auto-edit - done - docs/DECISIONS.md
[2026-09-09 05:07] - auto-edit - done - src/features/user/config/sections.ts
[2026-09-09 05:08] - auto-edit - done - src/features/user/config/contentDefaults.ts
[2026-09-09 05:08] - auto-edit - done - src/features/user/hooks/useSiteContent.ts
[2026-09-09 05:08] - auto-edit - done - src/features/user/hooks/useScrollSpy.ts
[2026-09-09 05:08] - auto-edit - done - src/features/user/components/SectionAnchor.tsx
[2026-09-09 05:09] - auto-edit - done - src/features/user/components/CtaBand.tsx
[2026-09-09 05:09] - auto-edit - done - supabase/migrations/0002_site_content.sql
[2026-09-09 05:09] - auto-edit - done - src/features/user/hooks/useSiteContent.ts
[2026-09-09 05:12] - auto-edit - done - supabase/README.md
[2026-09-09 05:50] - auto-edit - done - tailwind.config.js
[2026-09-09 05:52] - auto-edit - done - src/index.css
[2026-09-09 05:53] - auto-edit - done - index.html
[2026-09-09 05:53] - auto-edit - done - src/features/user/components/Header.tsx
[2026-09-09 05:54] - auto-edit - done - src/features/user/sections/Hero.tsx
[2026-09-09 05:54] - auto-edit - done - src/features/user/sections/TrustBar.tsx
[2026-09-09 05:55] - auto-edit - done - src/features/user/sections/AboutValues.tsx
[2026-09-09 05:55] - auto-edit - done - src/features/user/sections/PainPoints.tsx
[2026-09-09 05:55] - auto-edit - done - src/features/user/sections/ProcessSteps.tsx
[2026-09-09 05:56] - auto-edit - done - src/features/user/sections/Courses.tsx
[2026-09-09 05:56] - auto-edit - done - src/features/user/sections/Instructors.tsx
[2026-09-09 05:57] - auto-edit - done - src/features/user/sections/Testimonials.tsx
[2026-09-09 05:57] - auto-edit - done - src/features/user/sections/Commitment.tsx
[2026-09-09 05:57] - auto-edit - done - src/features/user/sections/FAQ.tsx
[2026-09-09 05:58] - auto-edit - done - src/features/user/sections/MapContact.tsx
[2026-09-09 05:58] - auto-edit - done - src/features/user/components/Footer.tsx
[2026-09-09 05:58] - auto-edit - done - src/features/user/components/FloatingCTA.tsx
[2026-09-09 05:59] - auto-edit - done - src/features/user/pages/LandingPage.tsx
[2026-09-09 05:59] - auto-edit - done - src/features/user/config/sections.ts
[2026-09-09 06:02] - auto-edit - done - src/features/user/UserApp.tsx
[2026-09-09 06:05] - auto-edit - done - docs/DECISIONS.md
[2026-09-09 06:12] - auto-edit - done - docs/BAO_CAO_TIEN_DO.md
[2026-09-09 07:50] - auto-edit - done - .tmp-logo-extract/render-page.mjs
[2026-09-09 07:51] - auto-edit - done - .tmp-logo-extract/crop.mjs
[2026-09-09 07:52] - auto-edit - done - .tmp-logo-extract/make-transparent.mjs
[2026-09-09 07:53] - auto-edit - done - .tmp-logo-extract/trim-pad.mjs
[2026-09-09 07:54] - auto-edit - done - .tmp-logo-extract/keyout-bg.mjs
[2026-09-09 07:57] - auto-edit - done - .tmp-logo-extract/build-assets.mjs
[2026-09-09 07:58] - auto-edit - done - index.html
[2026-09-09 07:59] - auto-edit - done - src/features/user/components/Header.tsx
[2026-09-09 07:59] - auto-edit - done - src/features/user/components/Header.tsx
[2026-09-09 07:59] - auto-edit - done - src/features/user/components/Footer.tsx
[2026-09-09 07:59] - auto-edit - done - src/features/user/components/Footer.tsx
[2026-09-09 13:04] - auto-edit - done - .tmp-docx-read/extract.py
[2026-09-09 13:06] - auto-edit - done - .tmp-docx-read/extract.py
[2026-09-09 13:09] - auto-edit - done - .tmp-docx-read/build-module18.cjs
[2026-09-09 13:11] - auto-edit - done - .tmp-docx-read/tq-edit/word/document.xml
[2026-09-09 13:15] - auto-edit - done - .tmp-docx-read/zipdir.py
[2026-09-09 22:54] - auto-edit - done - docs/plan/01-nen-tang-plan.md
[2026-09-09 23:02] - auto-edit - done - docs/plan/02-khung-dieuhuong-chuyendoi-plan.md
[2026-09-09 23:07] - auto-edit - done - .tmp-req-read/extract.py
[2026-09-09 23:10] - auto-edit - done - docs/plan/03-section-tinh-plan.md
[2026-09-09 23:14] - auto-edit - done - .tmp-req2/extract.py
[2026-09-09 23:16] - auto-edit - done - docs/plan/03b-section-tuongtac-plan.md
[2026-09-09 23:19] - auto-edit - done - docs/plan/04-mini-admin-plan.md
[2026-09-10 00:14] - auto-edit - done - prompts/ui/18-cong-nghe-ung-dung.md
[2026-09-10 00:42] - auto-edit - done - prompts/ui/mobile-responsive-landing.md
[2026-09-10 01:52] - auto-edit - done - src/features/user/sections/TechShowcase.tsx
[2026-09-10 01:52] - auto-edit - done - src/features/user/pages/LandingPage.tsx
[2026-09-10 01:52] - auto-edit - done - src/features/user/pages/LandingPage.tsx
[2026-09-10 01:53] - auto-edit - done - src/features/user/components/Header.tsx
[2026-09-10 01:54] - auto-edit - done - src/features/user/sections/PainPoints.tsx
[2026-09-10 01:54] - auto-edit - done - src/features/user/config/sections.ts
[2026-09-10 01:54] - auto-edit - done - src/features/user/config/sections.ts
[2026-09-10 01:55] - auto-edit - done - src/features/user/sections/Instructors.tsx
[2026-09-10 01:55] - auto-edit - done - src/features/user/sections/Instructors.tsx
[2026-09-10 01:56] - auto-edit - done - src/features/user/sections/Testimonials.tsx
[2026-09-10 01:56] - auto-edit - done - src/features/user/sections/ProcessSteps.tsx
[2026-09-10 01:56] - auto-edit - done - src/features/user/sections/Commitment.tsx
[2026-09-10 01:56] - auto-edit - done - src/features/user/components/FloatingCTA.tsx
[2026-09-10 02:00] - auto-edit - done - src/features/user/components/Header.tsx
[2026-09-10 02:01] - auto-edit - done - src/features/user/components/Header.tsx
[2026-09-10 02:02] - auto-edit - done - src/features/user/components/Header.tsx
[2026-09-10 02:02] - auto-edit - done - src/features/user/components/Header.tsx
[2026-09-10 02:02] - auto-edit - done - src/features/user/components/Header.tsx
[2026-09-11 01:09] - auto-edit - done - src/pages/ContentLandingPage.tsx
[2026-09-11 01:09] - auto-edit - done - src/pages/ContentLandingPage.tsx
[2026-09-11 01:10] - auto-edit - done - src/pages/ContentLandingPage.tsx
