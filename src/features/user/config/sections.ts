// HỢP ĐỒNG SECTION-ID — nguồn chân lý duy nhất cho menu Header, scroll-spy, smooth-scroll.
// Đã cập nhật khớp docs/design-export/desktop|mobile/code.html (2026-09-10): id/nhãn lấy verbatim
// từ export. Desktop chỉ hiện 5 mục trong `nav` (thanh header hẹp); drawer mobile (Header.tsx)
// hiện đủ 8 mục — không lấy từ mảng này (chưa nối, xem docs/plan/02-*.md).

export interface SectionDef {
  id: string;
  /** Nhãn menu Header desktop; null = anchor nội bộ, không có mục menu ở thanh desktop. */
  nav: string | null;
}

export const SECTIONS: readonly SectionDef[] = [
  { id: 'top', nav: null },
  { id: 've-chung-toi', nav: 'Về chúng tôi' },
  { id: 'cong-nghe-ung-dung', nav: 'Công nghệ ứng dụng' },
  { id: 'rao-can', nav: null },
  { id: 'quy-trinh', nav: null },
  { id: 'lo-trinh-hoc', nav: 'Lộ trình học' },
  { id: 'doi-ngu', nav: 'Đội ngũ giáo viên' },
  { id: 'cam-nhan-hoc-vien', nav: null },
  { id: 'cam-ket', nav: null },
  { id: 'faq', nav: 'FAQ' },
  { id: 'dang-ky', nav: null },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];

/** id neo tới form Lead ở Hero. */
export const LEAD_ANCHOR_ID: SectionId = 'dang-ky';

const byId = new Map(SECTIONS.map((s) => [s.id, s]));

export function getSection(id: string): SectionDef | undefined {
  return byId.get(id);
}

export function navSections(): SectionDef[] {
  return SECTIONS.filter((s) => s.nav);
}

/** Toàn bộ id để useScrollSpy quan sát (trừ 'top'). */
export const SPY_IDS: string[] = SECTIONS.filter((s) => s.id !== 'top').map((s) => s.id);
