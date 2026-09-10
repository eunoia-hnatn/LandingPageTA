export type ContentStatus = "published" | "draft";

export interface FieldSchema {
  key: string;
  label: string;
  type: "text" | "textarea";
  maxLength?: number;
  /** Fields sharing the same row key render side by side (2-column). */
  row?: string;
}

export interface ImageAsset {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

interface BlockMeta {
  id: string;
  name: string;
  status: ContentStatus;
  updatedAt: string;
  updatedBy: string;
}

export interface FormBlock extends BlockMeta {
  kind: "form";
  description: string;
  fields: FieldSchema[];
  values: Record<string, string>;
  hasImage?: boolean;
  image?: ImageAsset | null;
}

export interface ListBlock extends BlockMeta {
  kind: "list";
  description: string;
  itemLabel: string;
  fields: FieldSchema[];
  items: Record<string, string>[];
}

export type LandingBlock = FormBlock | ListBlock;

// Short bracketed label shown inside each section card's preview placeholder,
// matching the wireframe (e.g. "[ Hero Section Banner ]").
export const BLOCK_PREVIEW_LABEL: Record<string, string> = {
  hero: "Hero Section Banner",
  "trust-bar": "Trust Bar Stats",
  "pain-points": "Pain Points List",
  "course-roadmap": "Course Roadmap Steps",
  "teacher-team": "Teacher Profiles",
  testimonials: "Testimonials Carousel",
  faq: "FAQ Accordion",
  "outcome-commitment": "Outcome Commitment List",
  "social-links": "Social Links Row",
  "hotline-email": "Contact Info Card",
};

export const INITIAL_LANDING_BLOCKS: LandingBlock[] = [
  {
    id: "hero",
    kind: "form",
    name: "Hero Section (Trang Chủ)",
    description: "Tiêu đề chính, tagline banner, nút Đăng Ký Tư Vấn & hình ảnh Hero chính.",
    status: "published",
    updatedAt: "10 phút trước",
    updatedBy: "Admin HuyWay",
    hasImage: true,
    image: null,
    fields: [
      { key: "headline", label: "Tiêu Đề Chính (Hero Headline)", type: "text", maxLength: 80 },
      { key: "subheadline", label: "Mô Tả Ngắn (Subheadline)", type: "textarea", maxLength: 150 },
      { key: "ctaText", label: "Text Nút CTA Chính", type: "text", maxLength: 30, row: "cta" },
      { key: "promoBadge", label: "Text Badge Khuyến Mãi", type: "text", maxLength: 40, row: "cta" },
      { key: "ctaLink", label: "Liên kết nút CTA", type: "text" },
    ],
    values: {
      headline: "Bứt Phá Tiếng Anh Cùng HuyWay English",
      subheadline: "Cam kết đầu ra IELTS 7.0+ & TOEIC 750+ bằng phương pháp cá nhân hóa chuẩn quốc tế. Đăng ký test trình độ miễn phí ngay hôm nay!",
      ctaText: "Đăng Ký Tư Vấn Ngay",
      promoBadge: "🔥 Ưu đãi 30% Học Phí Tháng Này",
      ctaLink: "/dang-ky",
    },
  },
  {
    id: "about",
    kind: "form",
    name: "Giới Thiệu HuyWay",
    description: "Phương pháp học độc quyền, tầm nhìn sứ mệnh, con số ấn tượng.",
    status: "draft",
    updatedAt: "",
    updatedBy: "Phạm Gia Bảo",
    fields: [
      { key: "title", label: "Tiêu đề", type: "text", maxLength: 80 },
      { key: "body", label: "Nội dung giới thiệu", type: "textarea", maxLength: 400 },
      { key: "highlight", label: "Con số ấn tượng nổi bật", type: "text", maxLength: 60 },
    ],
    values: {
      title: "Phương Pháp Học Độc Quyền HuyWay",
      body: "8 năm nghiên cứu chuyên sâu về khảo thí IELTS/TOEIC, kết hợp lộ trình cá nhân hóa theo từng học viên và đội ngũ giáo viên bản địa hoá.",
      highlight: "1.200+ học viên đã đạt mục tiêu đầu ra",
    },
  },
  {
    id: "courses",
    kind: "list",
    name: "Khóa Học Nổi Bật",
    description: "Lộ trình IELTS, TOEIC, Giao tiếp, Tiếng Anh Nền Tảng.",
    status: "published",
    updatedAt: "2 ngày trước",
    updatedBy: "Admin HuyWay",
    itemLabel: "khóa học",
    fields: [
      { key: "name", label: "Tên khóa học", type: "text" },
      { key: "description", label: "Mô tả ngắn", type: "textarea" },
    ],
    items: [
      { name: "IELTS Intensive", description: "Luyện thi cấp tốc, cam kết đầu ra bằng văn bản." },
      { name: "TOEIC 550+", description: "Đột phá điểm số trong 3 tháng cho người đi làm." },
      { name: "Giao tiếp Doanh nghiệp", description: "Tự tin giao tiếp trong môi trường công sở quốc tế." },
      { name: "Tiếng Anh Nền Tảng", description: "Xây lại gốc cho người mất căn bản hoàn toàn." },
    ],
  },
  {
    id: "teacher-team",
    kind: "list",
    name: "Đội Ngũ Giáo Viên",
    description: "Chân dung giảng viên, bằng cấp 8.5 IELTS, kinh nghiệm giảng dạy.",
    status: "published",
    updatedAt: "1 tuần trước",
    updatedBy: "Admin HuyWay",
    itemLabel: "giáo viên",
    fields: [
      { key: "name", label: "Họ tên", type: "text" },
      { key: "role", label: "Chức danh", type: "text" },
      { key: "bio", label: "Giới thiệu ngắn", type: "textarea" },
    ],
    items: [
      { name: "Lưu Tiến Huy", role: "Founder & Giáo viên chính", bio: "8.5 IELTS Overall, 8 năm luyện thi IELTS chuyên sâu." },
      { name: "Vũ Hoài Nam", role: "Giáo viên IELTS Speaking", bio: "Cựu giám khảo chấm thi nội bộ, chuyên trị phát âm & phản xạ." },
    ],
  },
  {
    id: "testimonials",
    kind: "list",
    name: "Cảm Nhận Học Viên",
    description: "Testimonials thực tế từ học viên đã đạt mục tiêu đầu ra.",
    status: "draft",
    updatedAt: "3 tuần trước",
    updatedBy: "Phạm Gia Bảo",
    itemLabel: "cảm nhận",
    fields: [
      { key: "name", label: "Tên học viên", type: "text" },
      { key: "result", label: "Kết quả đạt được", type: "text" },
      { key: "content", label: "Nội dung cảm nhận", type: "textarea" },
    ],
    items: [
      { name: "Nguyễn Minh Anh", result: "5.5 → 7.0 sau 4 tháng", content: "Lộ trình rất sát đề thi thật, giáo viên chữa bài kỹ từng câu." },
      { name: "Trần Bảo Châu", result: "6.0 → 7.5", content: "Học phí hợp lý, cam kết đầu ra rõ ràng nên yên tâm học." },
    ],
  },
  {
    id: "faq",
    kind: "list",
    name: "Câu Hỏi Thường Gặp",
    description: "Giải đáp thắc mắc phổ biến trước khi khách đăng ký.",
    status: "published",
    updatedAt: "1 tháng trước",
    updatedBy: "Admin HuyWay",
    itemLabel: "câu hỏi",
    fields: [
      { key: "question", label: "Câu hỏi", type: "text" },
      { key: "answer", label: "Câu trả lời", type: "textarea" },
    ],
    items: [
      { question: "Học mất gốc có theo kịp không?", answer: "Có lộ trình riêng bắt đầu từ 0, không cần nền tảng trước đó." },
      { question: "Không đạt đầu ra thì sao?", answer: "Học viên được học bổ sung miễn phí đến khi đạt mục tiêu cam kết." },
    ],
  },
  {
    id: "hotline-email",
    kind: "form",
    name: "Hotline / Email",
    description: "Thông tin liên hệ trực tiếp hiển thị trên toàn trang.",
    status: "published",
    updatedAt: "1 tháng trước",
    updatedBy: "Admin HuyWay",
    fields: [
      { key: "hotline", label: "Số Hotline", type: "text" },
      { key: "email", label: "Email liên hệ", type: "text" },
      { key: "workingHours", label: "Giờ làm việc", type: "text" },
    ],
    values: {
      hotline: "1900 6868",
      email: "hotro@huyway.edu.vn",
      workingHours: "8:00 - 21:00, Thứ 2 - Chủ nhật",
    },
  },
];
