// Fallback tĩnh cho từng block site_content. useSiteContent merge sâu block DB
// lên trên default này → section LUÔN có dữ liệu để render (Module 3/16 edge).
// Nhóm 3A/3B bổ sung shape của mình vào đây theo cùng convention.

export interface HeroContent {
  headline: string;
  subheadline: string;
  proof_line: string;
  benefits: string[];
}

export interface TrustBarItem {
  value: string;
  label: string;
  note: string;
  /** Cờ NỘI BỘ cho Admin — KHÔNG ảnh hưởng hiển thị (chốt 2026-09-08). */
  verified: boolean;
}
export interface TrustBarContent {
  items: TrustBarItem[];
}

export interface FooterContact {
  hotline: string;
  zalo: string;
  facebook: string;
  tiktok: string;
  email: string;
  address: string;
}
export interface FooterContent {
  description: string;
  programs: { label: string; sectionId: string }[];
  contact: FooterContact;
  copyright_name: string;
}

export interface MapContent {
  embed_url: string;
  address: string;
  maps_link: string;
}

export interface SeoContent {
  title: string;
  description: string;
  og_image: string;
}

export interface ContentBlocks {
  hero: HeroContent;
  trust_bar: TrustBarContent;
  footer: FooterContent;
  map: MapContent;
  seo: SeoContent;
  // Nhóm 3A/3B mở rộng ở đây (values, pain_points, process_steps, courses, instructors, ...)
  [block: string]: unknown;
}

export const contentDefaults: ContentBlocks = {
  hero: {
    headline: "Học để dùng. Học để đi xa.",
    subheadline:
      "Lộ trình IELTS cá nhân hoá theo trình độ và mục tiêu của bạn — cam kết đầu ra bằng văn bản.",
    proof_line: "Đồng hành cùng hàng nghìn học viên chinh phục IELTS",
    benefits: [
      "Đánh giá trình độ & lộ trình miễn phí trong 24 giờ",
      "Giáo viên IELTS 7.5+ kèm sát từng buổi",
      "Cam kết đầu ra bằng văn bản",
    ],
  },
  trust_bar: {
    items: [
      { value: "10.000+", label: "Học viên đã đồng hành", note: "Luỹ kế từ khi thành lập", verified: false },
      { value: "95%", label: "Đạt band mục tiêu", note: "Trên học viên hoàn thành lộ trình", verified: false },
      { value: "+1.5", label: "Band cải thiện trung bình", note: "Sau 3 tháng", verified: false },
      { value: "7.5+", label: "Trình độ giáo viên", note: "IELTS Academic", verified: true },
    ],
  },
  footer: {
    description:
      "HUYWAY English — trung tâm luyện thi IELTS với lộ trình cá nhân hoá và cam kết đầu ra bằng văn bản.",
    programs: [
      { label: "Lộ trình học", sectionId: "lo-trinh-hoc" },
      { label: "Đội ngũ giáo viên", sectionId: "giang-vien" },
      { label: "Cảm nhận học viên", sectionId: "hoc-vien" },
    ],
    contact: {
      hotline: "0963 073 488",
      zalo: "0963 073 488",
      facebook: "https://facebook.com/huywayenglish",
      tiktok: "",
      email: "contact@huywayenglish.edu.vn",
      address: "Hà Nội, Việt Nam",
    },
    copyright_name: "HUYWAY English",
  },
  map: {
    embed_url: "https://www.google.com/maps?q=Ha+Noi,+Viet+Nam&output=embed",
    address: "Hà Nội, Việt Nam",
    maps_link: "https://www.google.com/maps?q=Ha+Noi,+Viet+Nam",
  },
  seo: {
    title: "HUYWAY English — Học để dùng. Học để đi xa.",
    description:
      "Trung tâm tiếng Anh HUYWAY: lộ trình IELTS cá nhân hoá, cam kết đầu ra bằng văn bản. Nhận đánh giá trình độ & lộ trình học miễn phí trong 24 giờ.",
    og_image: "/og-default.png",
  },
};
