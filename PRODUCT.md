# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Existing codebase: Vite + React 18 + TypeScript + Tailwind CSS 3, React Router 7. Supabase JS client for lead capture. Recharts + Swiper in use. Single app with two feature areas under `src/features/`: `user/` (public landing) and `admin/` (protected dashboard), plus `src/shared/` for auth. Path aliases `@user/*`, `@admin/*`, `@shared/*`. Served from XAMPP htdocs locally; deploy target not yet decided.

## Users

- **Landing page (`/`) — prospective students.** Vietnamese learners (and parents) deciding whether to commit to an IELTS course. They arrive unsure where to start or stuck at a plateau, want to know their current level and a realistic path to a target band, and are evaluating whether this center is trustworthy before giving a phone number. Success = submitting the lead form (name + phone) for a free level check and roadmap consultation.
- **Admin dashboard (`/admin`) — internal staff.** Marketing, customer-care consultants (CSKH), and a super-admin role. They manage incoming leads, landing-page content, customer lists, budget and permissions, staff, courses, and reports. Success = seeing lead flow and conversion at a glance and acting on unhandled/overdue leads quickly.

## Product Purpose

Huyway English is a Vietnamese English-training center focused on IELTS. The landing page exists to convert cold traffic (paid social, search, referrals) into consultation leads by making the path from "current level" to "target band" feel concrete and low-risk. The admin dashboard exists to give the team operational visibility over that lead pipeline and the marketing that feeds it.

## Positioning

Two pillars a neighboring center could not truthfully copy in the same combination:

1. **Written output commitment.** A signed guarantee: full tuition refund or free re-study if the student does not reach the agreed target, subject to stated conditions (attendance, homework completion, mid/final assessments, enrollment within a set window).
2. **Personalized roadmap by band.** An entry-level check that places each student on a specific track (Foundation 3.5–4.5 / Intermediate 5.0–6.0 / Advanced 6.5–7.5+) with a plan agreed between teacher and student, rather than a one-size cohort.

Founder credibility and an 8.0+ instructor roster support trust but are not, on their own, the differentiator.

## Operating Context

- **Lead funnel:** ad/search/social click → landing page → lead form (name + phone) → stored in Supabase `leads` table (`status: 'new'`) → CSKH follow-up by phone. Consultants are measured on response time; leads unhandled past ~2 hours are flagged urgent.
- **Marketing channels referenced in the product:** Facebook Ads, Google Search (brand + SEO), TikTok, direct. Admin is intended to sync with a Google Sheets / external data source on a schedule.
- **Roadmap tracks** (Foundation / Intermediate / Advanced) are a fixed part of how courses and consultations are framed across landing page, footer, and admin.
- **Language:** all product copy and internal UI are Vietnamese.

## Capabilities and Constraints

- Landing page: single scrolling page — hero + lead form, stats, carousel, pain points, steps, courses/roadmap, instructor/founder, social proof + commitment modal, testimonials, FAQ, footer, floating CTA. Separate desktop and mobile markup in several sections.
- Lead form writes directly to Supabase from the client using `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`; on Supabase error it currently still shows a success message to the user (known gap).
- Admin: currently **mock data and mock auth** only. Login is `admin@huyway.com` + any password → admin role, stored in `localStorage`. No server-side protection, no real RBAC yet. Planned: Supabase Auth, real permission levels, API protection.
- Admin nav (planned sections, most not yet built): Tổng quan, Quản lý Content Landing, Danh sách khách hàng, Quản lý Ngân sách & Quyền, Quản lý nhân viên, Quản lý khóa học, Quản lý Leads, Báo cáo & Thống kê. Only the Dashboard/overview view is implemented.
- Terminology: "lead", "CSKH" (customer care / consultant), "band", "target", "lộ trình" (roadmap/track), "cam kết đầu ra" (output commitment).

## Brand Commitments

- **Name:** "HuyWay English" / "Huyway English" (rendered as `HuyWay` + `English`, the second word in orange). Also styled "HuyWayEnglish" in some places.
- **Founder:** Thầy Lưu Tiến Huy — real person, real portrait asset at `src/features/user/assets/ThayHuy1-removebg.png`. Nhà sáng lập Huyway English. Presented as the face of the brand. (Specific score claims — IELTS 8.5, R&L 9.0, TOEIC 990 — are not yet verified; confirm before featuring them as fact.)
- **Incumbent visual system** (documentation gap — no DESIGN.md yet): brand indigo `#2C3481` (`brand`/`indigo-900`), accent orange `#F68C1F`, Inter typeface loaded from Google Fonts, rounded cards with hairline outlines and soft shadows, brand gradients defined in `tailwind.config.js`. Admin uses CSS variables (`--color-primary`, etc.) and a lighter Inter UI. Treat existing code and `tailwind.config.js` as the current design authority until a redesign decides otherwise.
- **Voice:** direct, encouraging, plain Vietnamese; speaks to the anxious beginner ("Chưa biết nên bắt đầu IELTS từ đâu?"), low-pressure ("Chỉ 60 giây", "100% miễn phí").

## Evidence on Hand

- **Real:** Founder name and portrait (see Brand Commitments).
- **Placeholder / not verified — must NOT be treated as fact or fabricated further:**
  - All landing-page statistics: "10,000+ học viên", "95% đạt mục tiêu", "+1.5 điểm trung bình", "band 7.5+ / 850+ TOEIC", "5.5 → 7.5 sau 3 tháng".
  - All named instructor profiles (Nguyễn Hoàng Long, Trần Thu Hà, Lê Minh Khoa and their scores/certs) and their photos (`placehold.co` placeholders).
  - All testimonials.
  - Contact details as currently shown — hotline `0963 073 488`, email `contact@huywayenglish.edu.vn`, address "Số 9 LK11 Tổng Cục V, Yên Xá, Thanh Liệt, Thanh Trì", and social links `@huywayenglish` (Facebook/YouTube/Instagram) — are unconfirmed. Do not present as verified; get real values from the user before relying on them.
  - All admin dashboard numbers, charts, KPIs, lead sources, and the "Google Sheets API Active" status are mock.
  - The 4 output-commitment conditions in the modal are illustrative, not a confirmed published policy.
- Open decision: real proof assets (student results, verifiable testimonials, accreditation, real staff bios/photos) need to be supplied by the user before any surface leans on them.

## Product Principles

1. **The path is the product.** Every landing section should move the visitor toward "I can see my route from here to my target band" — level check, track, next step.
2. **Lower the risk of saying yes.** Free, fast, private, and backed by a written commitment; never pressure.
3. **Never invent proof.** Numbers, names, testimonials, and credentials appear only when the user has confirmed them; until then they are visibly provisional, not decoration presented as fact.
4. **Two audiences, one truth.** Landing (persuade) and admin (operate) share brand and data model but not tone or density; keep their concerns separated as the code already does.
5. **Vietnamese-first.** Copy, formatting, and examples are written for Vietnamese learners and staff, not translated from English.

## Accessibility & Inclusion

No formal standard established yet. Practical needs given the audience: readable Vietnamese typography with correct diacritics, comfortable tap targets and legibility on low-end Android phones (a large share of traffic), and forms that are usable one-handed on mobile.
