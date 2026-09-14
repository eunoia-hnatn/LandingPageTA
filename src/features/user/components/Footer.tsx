import logoIconWhite from '@user/assets/logo-icon-white.png';

// FOOTER — port 1:1 từ docs/design export/code.html.
export default function Footer() {
  return (
    <footer className="w-full bg-primary-container text-on-primary border-t border-hairline/20">
      <div className="max-w-[1240px] mx-auto px-space-20 md:px-space-32 py-space-64">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-32 lg:gap-space-48">
          <div className="space-y-space-16">
            <div className="flex items-center gap-space-12">
              <img src={logoIconWhite} alt="HuyWay English" className="w-9 h-9 object-contain" />
              <span className="font-headline text-title-lg text-on-primary tracking-tight font-bold">HuyWay English</span>
            </div>
            <p className="text-body-sm font-body-sm text-on-primary/80 leading-relaxed">Học để dùng. Học để đi xa.</p>
            <p className="text-label-sm font-label-sm text-on-primary/65 leading-relaxed text-justify">
              Hệ thống đào tạo IELTS chuyên sâu xây dựng trên nền tảng tư duy ngôn ngữ học thuật thực chiến và kỷ luật khai phóng.
            </p>
            <div className="flex items-center gap-space-12 pt-space-8">
              <a aria-label="Facebook" className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary hover:bg-indigo-hover transition-colors" href="#">
                <span className="material-symbols-outlined text-[18px]">thumb_up</span>
              </a>
              <a aria-label="YouTube" className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary hover:bg-indigo-hover transition-colors" href="#">
                <span className="material-symbols-outlined text-[18px]">play_circle</span>
              </a>
              <a aria-label="Zalo" className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary hover:bg-indigo-hover transition-colors" href="#">
                <span className="material-symbols-outlined text-[18px]">chat</span>
              </a>
              <a aria-label="TikTok" className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary hover:bg-indigo-hover transition-colors" href="#">
                <span className="material-symbols-outlined text-[18px]">videocam</span>
              </a>
            </div>
          </div>
          <div className="space-y-space-16">
            <h3 className="text-title-sm font-title-sm text-on-primary uppercase tracking-wider font-bold">Liên hệ trung tâm</h3>
            <ul className="space-y-space-12 text-body-sm font-body-sm text-on-primary/80">
              <li className="flex items-start gap-space-8">
                <span className="material-symbols-outlined text-secondary-fixed text-[20px] flex-shrink-0 mt-0.5">call</span>
                <div>
                  <span className="block text-label-sm font-label-sm text-on-primary/60">Hotline tuyển sinh &amp; tư vấn</span>
                  <a className="text-on-primary font-semibold hover:underline" href="tel:0963073488">0963 073 488</a>
                </div>
              </li>
              <li className="flex items-start gap-space-8">
                <span className="material-symbols-outlined text-secondary-fixed text-[20px] flex-shrink-0 mt-0.5">mail</span>
                <div>
                  <span className="block text-label-sm font-label-sm text-on-primary/60">Hòm thư tiếp nhận</span>
                  <a className="text-on-primary hover:underline break-all" href="mailto:contact@huywayenglish.edu.vn">contact@huywayenglish.edu.vn</a>
                </div>
              </li>
              <li className="flex items-start gap-space-8">
                <span className="material-symbols-outlined text-secondary-fixed text-[20px] flex-shrink-0 mt-0.5">location_on</span>
                <div>
                  <span className="block text-label-sm font-label-sm text-on-primary/60">Cơ sở đào tạo chính</span>
                  <span className="leading-snug">Số 9 LK11 Tổng Cục V, Yên Xá, Thanh Liệt, Thanh Trì, Hà Nội.</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="space-y-space-16">
            <h3 className="text-title-sm font-title-sm text-on-primary uppercase tracking-wider font-bold">Lộ trình &amp; Khóa học</h3>
            <ul className="space-y-space-12 text-body-sm font-body-sm text-on-primary/80">
              <li><a className="hover:text-on-primary hover:underline flex items-center gap-space-8" href="#lo-trinh-hoc"><span className="material-symbols-outlined text-[14px]">arrow_forward</span>Khóa Nền tảng (3.0 - 5.0)</a></li>
              <li><a className="hover:text-on-primary hover:underline flex items-center gap-space-8" href="#lo-trinh-hoc"><span className="material-symbols-outlined text-[14px]">arrow_forward</span>Khóa Trung cấp (5.0 - 6.5)</a></li>
              <li><a className="hover:text-on-primary hover:underline flex items-center gap-space-8" href="#lo-trinh-hoc"><span className="material-symbols-outlined text-[14px]">arrow_forward</span>Khóa Nâng cao (7.0 - 7.5+)</a></li>
              <li><a className="hover:text-on-primary hover:underline flex items-center gap-space-8" href="#lo-trinh-hoc"><span className="material-symbols-outlined text-[14px]">arrow_forward</span>Luyện đề chuyên sâu Intensive</a></li>
              <li><a className="hover:text-on-primary hover:underline flex items-center gap-space-8" href="#lo-trinh-hoc"><span className="material-symbols-outlined text-[14px]">arrow_forward</span>Khóa 1 kèm 1 cá nhân hóa</a></li>
            </ul>
          </div>
          <div className="space-y-space-16">
            <h3 className="text-title-sm font-title-sm text-on-primary uppercase tracking-wider font-bold">Pháp lý &amp; Đào tạo</h3>
            <ul className="space-y-space-12 text-body-sm font-body-sm text-on-primary/80">
              <li><a className="hover:text-on-primary hover:underline flex items-center gap-space-8" href="#"><span className="material-symbols-outlined text-[14px]">verified</span>Cam kết chất lượng đào tạo</a></li>
              <li><a className="hover:text-on-primary hover:underline flex items-center gap-space-8" href="/chinh-sach-bao-mat"><span className="material-symbols-outlined text-[14px]">policy</span>Chính sách bảo vệ dữ liệu cá nhân</a></li>
              <li><a className="hover:text-on-primary hover:underline flex items-center gap-space-8" href="#"><span className="material-symbols-outlined text-[14px]">menu_book</span>Quy chế hoạt động học viên</a></li>
              <li><a className="hover:text-on-primary hover:underline flex items-center gap-space-8" href="#"><span className="material-symbols-outlined text-[14px]">shield</span>Tiêu chuẩn khảo thí &amp; kiểm định</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-space-64 pt-space-24 border-t border-on-primary/15 flex flex-col md:flex-row items-center justify-between gap-space-16 text-body-sm font-body-sm text-on-primary/60">
          <p>© {new Date().getFullYear()} Huyway English. Bảo lưu mọi quyền.</p>
          <div className="flex items-center gap-space-24">
            <a className="hover:text-on-primary transition-colors" href="#">Chính sách bảo mật</a>
            <a className="hover:text-on-primary transition-colors" href="#">Điều khoản dịch vụ</a>
            <a className="hover:text-on-primary transition-colors" href="#faq">Giải đáp thắc mắc</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
