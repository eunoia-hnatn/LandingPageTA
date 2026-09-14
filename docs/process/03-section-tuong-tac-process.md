# Process log — Nhóm 3B: Section nội dung Landing (phần có tương tác)

> Nguồn: `docs/plan/03b-section-tuong-tac.md`.
> Format mỗi dòng: `[timestamp] - [bước] - [trạng thái] - [ghi chú]`

## Bối cảnh (2026-09-09)
03b phụ thuộc **Nhóm 1 + Nhóm 2 + Nhóm 3A**. Cần: `<Modal>`/`PolicyModal` (N1 ✅ có PolicyModal),
`useSiteContent` + `config/sections.ts` + `useScrollSpy` + `<CtaBand>` (N2 — CHƯA),
`SectionShell` + `CtaLink` + `useSectionContent` + `iconMap` (N3A — CHƯA), `swiper` (✅ đã cài).

Tình trạng: Nhóm 1 xong Auth + Phase B prereq. Nhóm 2 mới xong Phase A (port). Nền N2/N3A chưa có.

→ 03b **BLOCKED** sau 03a. Thứ tự: Phase C (nền Nhóm 2) → Nhóm 2 §3 → 3A → **3B**.
Tiến độ nền ghi ở `docs/process/02-khung-chuyendoi-process.md`.

---

[2026-09-09 06:55] - B0 - blocked - 03b là mắt xích cuối chuỗi N1→N2→N3A→N3B. Ưu tiên làm Phase C (nền Nhóm 2) — unblock cả 3A lẫn 3B.
[2026-09-09 07:40] - Phase C (nền Nhóm 2) - done - config/sections.ts, contentDefaults.ts, useSiteContent, useScrollSpy, SectionAnchor, CtaBand, migration 0002_site_content. Build xanh. Chi tiết ở docs/process/02-khung-chuyendoi-process.md.
[2026-09-09 07:42] - 03b - blocked - Còn cần: (a) N2 §3 viết lại Header/Hero/TrustBar/Footer/MapEmbed/FloatingCTA; (b) N3A shared kit: SectionShell, CtaLink, EqualHeightCards, useSectionContent, iconMap + 4 section 3A. Rồi 03b mới bắt đầu (Modal, Accordion, ProfileCarousel, RemoteImage + 4 section).
