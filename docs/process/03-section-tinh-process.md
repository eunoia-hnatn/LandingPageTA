# Process log — Nhóm 3A: Section nội dung Landing (phần tĩnh)

> Nguồn: `docs/plan/03a-section-tinh-plan.md`.
> Format mỗi dòng: `[timestamp] - [bước] - [trạng thái] - [ghi chú]`

## Bối cảnh (2026-09-09)
Plan 03a **phụ thuộc hoàn toàn** vào Nhóm 1 + Nhóm 2 — **mọi bước** dùng `useSiteContent`,
`config/sections.ts`, `SectionShell`, `<CtaBand>`, `<LeadForm>`, token DESIGN.md, `<Seo>`.
Hiện trạng: Nhóm 1 mới xong Auth (A+B); Nhóm 2 mới xong Phase A (port skeleton). Các nền tảng
`useSiteContent`/`contentDefaults`/`config/sections.ts`/`<LeadForm>`/tokens/`<Seo>` **chưa có**.

→ 03a **BLOCKED**. Phải làm xong:
  - Phase B (prereq Nhóm 1): tokens DESIGN.md, `<LeadForm>` + forms, `submit-lead` + bảng `leads`,
    `<Seo>` + helmet, PolicyModal + `/chinh-sach-bao-mat`.
  - Phase C (nền Nhóm 2): `config/sections.ts`, `contentDefaults.ts`, `useSiteContent`,
    `useScrollSpy`, `SectionAnchor`, `CtaBand`, migration `0002_site_content`.
Tiến độ Phase B/C ghi ở `docs/process/02-khung-chuyendoi-process.md`.

---

[2026-09-09 05:55] - B0 - blocked - 03a downstream toàn bộ Nhóm 1+2. Chuyển sang làm Phase B (prereq Nhóm 1) trước; 03a chờ.
[2026-09-09 06:48] - Phase B (prereq Nhóm 1) - done - Xong: token DESIGN.md, `<Seo>`, forms layer + `<LeadForm>`, `submit-lead` Edge + migration `0001b_leads_policy`, PolicyModal + `/chinh-sach-bao-mat`. Chi tiết ở `docs/process/02-khung-chuyendoi-process.md` Phase B. Build xanh.
[2026-09-09 07:40] - Phase C (nền Nhóm 2) - done - config/sections.ts, contentDefaults.ts, useSiteContent, useScrollSpy, SectionAnchor, CtaBand, migration 0002_site_content. Build xanh. Chi tiết: docs/process/02-khung-chuyendoi-process.md.
[2026-09-09 07:42] - 03a - ready-next - Nền Nhóm 2 xong. 03a bước 2 (shared kit: iconMap, useSectionContent, SectionShell, CtaLink, EqualHeightCards) giờ làm được. Bước 1 (migration 0003 seed) chờ khách apply 0002 trước.
