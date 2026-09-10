import { useState } from 'react';

// MODULE 18: CÔNG NGHỆ ỨNG DỤNG — port 1:1 từ docs/design-export/desktop/code.html
// (khung 4 tab + card 2 cột) hợp nhất với docs/design-export/mobile/code.html (grid tab 2x2 +
// nội dung chi tiết từng tab — bản mobile có nội dung đầy đủ hơn bản desktop nên dùng làm
// nguồn dữ liệu chung cho cả 2 kích thước màn hình, chỉ đổi bố cục theo breakpoint).
// Đây là teaser tĩnh giới thiệu định hướng công nghệ tương lai (PWA — Phase 2), ảnh minh hoạ
// CHƯA CÓ THẬT nên luôn hiện trạng thái "Chưa có ảnh" — xem docs/requirements/18-*.docx.

interface TechTab {
  tag: string;
  title: string;
  desc: string;
  bullets: string[];
}

const TABS: TechTab[] = [
  {
    tag: 'Định hướng phát triển',
    title: 'Không gian học tập số tương tác 1-1',
    desc: 'Đồng bộ hóa toàn bộ kho bài tập, ghi chú giảng viên cùng tiến trình rèn luyện 4 kỹ năng theo thời gian thực chuẩn tiêu chí IDP/BC.',
    bullets: [
      'Kho tài liệu và phản hồi học thuật tập trung',
      'Theo dõi biểu đồ tiến độ chuẩn IDP/BC',
      'Báo cáo rèn luyện & thi thử định kỳ chi tiết',
    ],
  },
  {
    tag: 'Hệ thống khảo thí số',
    title: 'Phân tích điểm nghẽn Reading & Listening',
    desc: 'Tự động thống kê các bẫy đề thi Cambridge mà học viên thường mắc phải, đưa ra gợi ý rèn luyện từ vựng đúng trọng tâm.',
    bullets: [
      'Phân loại lỗi sai theo từng dạng bài cụ thể',
      'Đo lường thời gian làm bài từng câu hỏi',
      'Kho đề thi cập nhật theo quý mới nhất',
    ],
  },
  {
    tag: 'Chấm chữa chuyên sâu',
    title: 'Phòng luyện Speaking & Writing 1-1',
    desc: 'Ghi âm và lưu vết toàn bộ bài nói, bài viết được chấm chữa trực tiếp bởi giảng viên 8.0+ theo 4 tiêu chí khắt khe.',
    bullets: [
      'Sửa lỗi phát âm ngữ âm IPA chi tiết',
      'Nâng cấp cấu trúc câu và từ vựng band 7.5+',
      'Barem điểm phân tích rõ ràng từng tiêu chí',
    ],
  },
  {
    tag: 'Báo cáo minh bạch',
    title: 'Dashboard theo dõi mục tiêu học tập',
    desc: 'Cập nhật chỉ số chuyên cần, tỷ lệ hoàn thành bài tập về nhà và dự báo band điểm thi thực tế trước ngày thi chính thức.',
    bullets: [
      'Dự báo band điểm thực chiến chính xác 95%',
      'Thông báo lịch học và nhắc nhở ôn tập tự động',
      'Ký duyệt cam kết tiến độ trực tuyến',
    ],
  },
];

export default function TechShowcase() {
  const [active, setActive] = useState(0);
  const current = TABS[active];

  return (
    <section
      className="w-full bg-surface-slate py-space-64 border-t border-hairline"
      id="cong-nghe-ung-dung"
    >
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
        {/* Header section */}
        <div className="flex flex-col items-center text-center mb-space-32 max-w-2xl mx-auto">
          <span className="px-space-16 py-space-4 rounded-full bg-[#F1F2FC] text-[#2C3481] border border-[#E2E8F0] font-semibold text-label-sm mb-space-12 inline-block">
            Công nghệ ứng dụng
          </span>
          <h2 className="font-headline text-3xl lg:text-4xl text-[#000000] font-semibold tracking-tight mb-space-8">
            Trải nghiệm không gian học thuật số
          </h2>
          <p className="font-body-md text-base text-[#717174] leading-relaxed">
            Hệ thống PWA đồng hành cùng học viên ngoài giờ lên lớp — đang trong giai đoạn phát triển.
          </p>
        </div>

        {/* 4 Tab điều hướng: pill hàng ngang trên desktop, lưới 2x2 trên mobile */}
        <div
          aria-label="Danh sách tính năng công nghệ"
          role="tablist"
          className="grid grid-cols-2 lg:flex lg:flex-wrap lg:justify-center gap-2 lg:gap-3 mb-space-32"
        >
          {TABS.map((tab, i) => {
            const isActive = i === active;
            return (
              <button
                key={tab.title}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                className={
                  isActive
                    ? 'min-h-[44px] px-5 py-2.5 rounded-lg bg-[#2C3481] text-white font-semibold text-label-lg shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2C3481]'
                    : 'min-h-[44px] px-5 py-2.5 rounded-lg bg-surface border border-[#E2E8F0] text-[#717174] font-semibold text-label-lg hover:bg-slate-50 hover:text-[#2C3481] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2C3481]'
                }
              >
                Tính năng {i + 1}
              </button>
            );
          })}
        </div>

        {/* Card nội dung chi tiết (2 cột desktop, xếp dọc mobile) */}
        <div className="bg-surface rounded-[20px] border border-[#E2E8F0] p-6 lg:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Cột trái */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#F1F2FC] text-[#2C3481] font-semibold text-xs mb-space-12">
                  {current.tag}
                </span>
                <h3 className="font-headline text-2xl lg:text-3xl text-[#000000] font-semibold tracking-tight mb-space-12">
                  {current.title}
                </h3>
                <p className="font-body-md text-base text-[#717174] leading-relaxed mb-space-20 text-justify">
                  {current.desc}
                </p>
                <ul className="space-y-space-12 font-body-sm text-body-sm text-[#717174] mb-space-24">
                  {current.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-space-8 text-justify">
                      <span className="w-5 h-5 rounded-full bg-[#F1F2FC] text-[#2C3481] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <a
                  className="inline-flex items-center gap-space-8 px-space-20 py-2.5 rounded-lg border border-[#2C3481] text-[#2C3481] bg-surface hover:bg-[#2C3481] hover:text-white font-semibold text-label-lg transition-colors"
                  href="#dang-ky"
                >
                  <span>Tìm hiểu thêm</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </a>
              </div>
            </div>
            {/* Cột phải: khung 16:9 trạng thái "Chưa có ảnh" (chưa có tài sản truyền thông thật) */}
            <div className="lg:col-span-7">
              <div className="w-full aspect-video rounded-2xl border border-[#E2E8F0] bg-surface-slate flex flex-col items-center justify-center p-6 text-center shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-[#E2E8F0] text-[#8A8A8D] flex items-center justify-center mb-space-12">
                  <span className="material-symbols-outlined text-[28px]">dashboard</span>
                </div>
                <div className="font-headline text-base font-semibold text-[#8A8A8D] mb-1">Chưa có ảnh</div>
                <p className="font-body-sm text-xs text-[#8A8A8D] max-w-sm">
                  Khung minh họa giao diện không gian số (16:9) — Đang cập nhật
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
