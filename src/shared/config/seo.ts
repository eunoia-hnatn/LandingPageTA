// Giá trị SEO mặc định theo route. Nhóm 4 (CMS) sẽ cho phép ghi đè từ site_content.
// KHÔNG hard-code trong JSX — component <Seo> đọc từ đây hoặc từ props/CMS.

export interface SeoValues {
  title: string;
  description: string;
  ogImage: string;
}

const SITE_NAME = "HUYWAY English";
const OG_DEFAULT = "/og-default.png";

export const seoDefaults: Record<string, SeoValues> = {
  "/": {
    title: `${SITE_NAME} — Học để dùng. Học để đi xa.`,
    description:
      "Trung tâm tiếng Anh HUYWAY: lộ trình IELTS cá nhân hoá, cam kết đầu ra bằng văn bản. Nhận đánh giá trình độ & lộ trình học miễn phí trong 24 giờ.",
    ogImage: OG_DEFAULT,
  },
  "/chinh-sach-bao-mat": {
    title: `Chính sách bảo vệ dữ liệu cá nhân — ${SITE_NAME}`,
    description:
      "Cách HUYWAY English thu thập, sử dụng và bảo vệ thông tin cá nhân của học viên và người đăng ký tư vấn.",
    ogImage: OG_DEFAULT,
  },
  "/login": {
    title: `Đăng nhập quản trị — ${SITE_NAME}`,
    description: "Khu vực quản trị nội bộ HUYWAY English.",
    ogImage: OG_DEFAULT,
  },
  "404": {
    title: `Không tìm thấy trang — ${SITE_NAME}`,
    description: "Trang bạn tìm không tồn tại hoặc đã được chuyển.",
    ogImage: OG_DEFAULT,
  },
};

export function getSeo(routeKey: string): SeoValues {
  return seoDefaults[routeKey] ?? seoDefaults["/"];
}
