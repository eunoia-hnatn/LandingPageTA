import type { PolicyDocument } from "@/shared/hooks/usePolicyDocument";

// NỘI DUNG TẠM — CHƯA PHẢI BẢN CHÍNH THỨC.
// Khách cập nhật bản chữ chính thức sau qua CMS (Nhóm 4) → ghi vào bảng policy_documents.
export const POLICY_FALLBACK: PolicyDocument = {
  slug: "data-privacy",
  version: "0.1-draft",
  title: "Chính sách bảo vệ dữ liệu cá nhân",
  published_at: null,
  body_md: `> **NỘI DUNG TẠM — CHƯA PHẢI BẢN CHÍNH THỨC.** Bản đầy đủ sẽ được HUYWAY English công bố sau.

## 1. Thông tin chúng tôi thu thập
Khi bạn đăng ký tư vấn hoặc để lại thông tin trên website, chúng tôi thu thập: họ tên, số điện thoại,
email (nếu có), khóa học quan tâm, trình độ hiện tại và nhu cầu học tập do bạn cung cấp.

## 2. Mục đích sử dụng
- Liên hệ tư vấn lộ trình học phù hợp.
- Gửi thông tin về khóa học, lịch khai giảng, ưu đãi mà bạn quan tâm.
- Cải thiện chất lượng dịch vụ và nội dung website.

## 3. Chia sẻ thông tin
Chúng tôi **không** bán hoặc cho thuê thông tin cá nhân của bạn. Thông tin chỉ được chia sẻ nội bộ
với đội ngũ tư vấn của HUYWAY English và các đơn vị cung cấp hạ tầng kỹ thuật cần thiết để vận hành dịch vụ.

## 4. Lưu trữ và bảo mật
Dữ liệu được lưu trên hạ tầng có mã hoá và kiểm soát truy cập. Chúng tôi lưu trữ trong thời gian cần
thiết cho mục đích tư vấn, hoặc cho tới khi bạn yêu cầu xoá.

## 5. Quyền của bạn
Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xoá thông tin cá nhân của mình, và rút lại sự đồng ý bất cứ lúc nào.

## 6. Liên hệ
Mọi yêu cầu liên quan đến dữ liệu cá nhân, vui lòng liên hệ hotline hoặc email được công bố ở chân trang.`,
};
