// MODULE 13: KHỐI BẢN ĐỒ & LIÊN HỆ ĐỊA CHỈ — port 1:1 từ docs/design export/code.html.
export default function MapContact() {
  return (
    <section className="w-full bg-surface-slate py-space-64 border-t border-hairline">
      <div className="max-w-[1240px] mx-auto px-space-20 md:px-space-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-48 items-center">
          {/* Cột trái: Thông tin cơ sở */}
          <div className="lg:col-span-5 space-y-space-24">
            <div>
              <span className="px-space-16 py-space-4 rounded-full bg-indigo-wash text-primary font-label-sm text-label-sm font-semibold mb-space-12 inline-block border border-primary/20">
                Trụ sở &amp; Cơ sở đào tạo
              </span>
              <h2 className="font-headline text-headline text-ink font-bold">Ghé thăm Huyway English</h2>
              <p className="font-body-md text-body-md text-ink-body mt-space-8 leading-relaxed text-justify">
                Môi trường học tập tiêu chuẩn, phòng học đa phương tiện hỗ trợ tối đa cho học viên ôn luyện và tham gia các kỳ thi thử mô phỏng thực tế.
              </p>
            </div>
            <div className="space-y-space-16 font-body-sm text-body-sm text-ink-body">
              <div className="flex items-start gap-space-12 p-space-16 bg-surface rounded-2xl border border-hairline shadow-xs">
                <span className="material-symbols-outlined text-primary text-[22px] flex-shrink-0 mt-0.5">location_on</span>
                <div>
                  <strong className="block text-ink font-semibold">Địa chỉ cơ sở:</strong>
                  <span>Số 9 LK11 Tổng Cục V, Yên Xá, Thanh Liệt, Thanh Trì, Hà Nội.</span>
                </div>
              </div>
              <div className="flex items-start gap-space-12 p-space-16 bg-surface rounded-2xl border border-hairline shadow-xs">
                <span className="material-symbols-outlined text-primary text-[22px] flex-shrink-0 mt-0.5">call</span>
                <div>
                  <strong className="block text-ink font-semibold">Hotline tư vấn tuyển sinh:</strong>
                  <a className="text-primary font-title-sm text-title-sm font-bold hover:underline" href="tel:0963073488">0963 073 488</a>
                  <span className="block font-label-sm text-label-sm text-ink-muted">Hỗ trợ 24/7 (Cả Thứ Bảy &amp; Chủ Nhật)</span>
                </div>
              </div>
              <div className="flex items-start gap-space-12 p-space-16 bg-surface rounded-2xl border border-hairline shadow-xs">
                <span className="material-symbols-outlined text-primary text-[22px] flex-shrink-0 mt-0.5">schedule</span>
                <div>
                  <strong className="block text-ink font-semibold">Giờ mở cửa đón tiếp:</strong>
                  <span>Thứ Hai – Chủ Nhật: 08:00 – 21:30</span>
                </div>
              </div>
            </div>
            <div className="pt-space-8">
              <a
                className="inline-flex items-center gap-space-8 px-space-24 py-space-12 rounded-xl bg-primary text-on-primary hover:bg-indigo-hover font-label-lg text-label-lg transition-colors shadow-xs"
                href="#dang-ky"
              >
                <span>Đặt lịch hẹn tư vấn trực tiếp</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>
            </div>
          </div>
          {/* Cột phải: Bản đồ */}
          <div className="lg:col-span-7">
            <div className="w-full h-[400px] md:h-[460px] rounded-3xl overflow-hidden shadow-md relative bg-surface border border-hairline">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAL0Q0Y1EPLUl4ZqvvV6SXPZ_wp_NLgAHOlmRamigv0PQwYWOgyoN-VPi440ae9EgEKi1DAICxAdE9cycAgmGv0XtkF02kfEvu_qLTCjWxs-lCWw2LEi-RymCxIH1Ct-P8j49R9FayAFJnK8HZOMzDMkQfzjPDofe8zSnFnKwrpmZywu0niLUdBSeI3SiyBewWfscFEUtyJTgGwXt29DLN5d84YyQuyMq9VskSIwytputkNZaWzBn9diQ")',
                }}
              />
              <div className="absolute bottom-space-16 left-space-16 right-space-16 md:right-auto md:max-w-xs bg-surface/95 backdrop-blur-md p-space-16 rounded-2xl shadow-md border border-hairline">
                <div className="flex items-center gap-space-8 mb-space-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
                  <span className="font-label-sm text-label-sm text-primary font-bold">Huyway English Center</span>
                </div>
                <p className="font-body-sm text-[12px] text-ink-body">Số 9 LK11 Tổng Cục V, Yên Xá, Thanh Trì</p>
                <a
                  className="mt-space-8 inline-flex items-center gap-space-4 font-label-sm text-[12px] text-primary hover:underline font-semibold"
                  href="https://maps.google.com"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Xem đường đi trên Google Maps <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
