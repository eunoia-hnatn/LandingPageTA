// MODULE 6: QUY TRÌNH 3 BƯỚC — port 1:1 từ docs/design-export/desktop/code.html (lưới 3 cột)
// hợp nhất docs/design-export/mobile/code.html (vertical stepper có đường nối dọc).
const STEPS = [
  {
    n: '01',
    title: 'Bước 1: Điền thông tin',
    desc: 'Để lại họ tên, số điện thoại và band điểm mục tiêu bạn mong muốn. Thao tác đơn giản, bảo mật và chỉ mất chưa đầy 60 giây để hoàn tất.',
    icon: 'timer',
    tag: '60 giây hoàn tất',
  },
  {
    n: '02',
    title: 'Bước 2: Test & tư vấn 1-1',
    desc: 'Làm bài kiểm tra trình độ 4 kỹ năng và trao đổi trực tiếp cùng chuyên viên học thuật để đánh giá đúng năng lực và tháo gỡ điểm nghẽn.',
    icon: 'person',
    tag: '1-kèm-1 cùng giảng viên',
  },
  {
    n: '03',
    title: 'Bước 3: Nhận lộ trình trong 24h',
    desc: 'Nhận bản phân tích chi tiết điểm mạnh, điểm yếu và kế hoạch học tập cá nhân hóa được thiết kế riêng cho mục tiêu thi cử của bạn.',
    icon: 'bolt',
    tag: 'Phản hồi tối đa 24 giờ',
  },
];

export default function ProcessSteps() {
  return (
    <section className="w-full bg-surface py-space-64" id="quy-trinh">
      <div className="max-w-[1240px] mx-auto px-space-20 md:px-space-32">
        <div className="flex flex-col items-center text-center mb-space-48 max-w-2xl mx-auto">
          <span className="px-space-16 py-space-4 rounded-full bg-indigo-wash text-primary font-label-sm text-label-sm font-semibold mb-space-12 border border-primary/20">
            Quy trình tinh gọn
          </span>
          <h2 className="font-headline text-headline text-ink font-bold">3 bước để có lộ trình IELTS của riêng bạn</h2>
          <p className="font-body-md text-body-md text-ink-body mt-space-8 text-justify sm:text-center leading-relaxed">
            Hệ thống khảo thí và phân tích học lực chuẩn xác giúp bạn định vị đúng điểm xuất phát và vạch rõ chặng đường tới band mục tiêu.
          </p>
        </div>

        {/* Desktop (>= md): lưới 3 cột ngang */}
        <div className="hidden md:grid grid-cols-3 gap-space-24 lg:gap-space-32 mb-space-48">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="flex flex-col items-center text-center p-space-24 bg-surface-slate rounded-2xl border border-hairline shadow-xs h-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary font-headline text-title-lg font-bold flex items-center justify-center mb-space-20 shadow-sm flex-shrink-0">
                {s.n}
              </div>
              <h3 className="font-headline text-title-sm text-ink font-bold mb-space-12 min-h-[28px]">{s.title}</h3>
              <p className="font-body-sm text-body-sm text-ink-body leading-relaxed text-justify flex-1 mb-space-16">{s.desc}</p>
              <div className="mt-auto w-full pt-space-12 border-t border-hairline flex items-center justify-center gap-space-4 font-label-sm text-label-sm text-primary font-semibold">
                <span className="material-symbols-outlined text-[16px]">{s.icon}</span>
                <span>{s.tag}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile (< md): vertical stepper với đường nối dọc */}
        <div className="md:hidden relative pl-6 space-y-6 mb-space-48">
          <div className="absolute left-3.5 top-4 bottom-4 w-0.5 bg-primary/20 -translate-x-1/2" />
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-xs flex-shrink-0 ring-4 ring-surface relative z-10">
                {i + 1}
              </div>
              <div className="flex-1 bg-surface-slate p-4 rounded-2xl border border-hairline">
                <h3 className="text-sm font-semibold text-ink mb-1">{s.title}</h3>
                <p className="text-xs text-ink-body leading-relaxed text-justify mb-2 font-normal">{s.desc}</p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                  <span className="material-symbols-outlined text-[14px]">{s.icon}</span> {s.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Band */}
        <div className="w-full bg-primary-container text-on-primary rounded-3xl p-space-32 md:p-space-48 flex flex-col md:flex-row items-center justify-between gap-space-24 shadow-md">
          <div className="space-y-space-4 text-center md:text-left">
            <h3 className="font-headline text-title-lg md:text-headline text-on-primary font-bold">Sẵn sàng bắt đầu bứt phá IELTS?</h3>
            <p className="font-body-md text-body-md text-on-primary/80">
              Miễn phí • 60 giây đăng ký • Nhận phản hồi chuyên môn chi tiết trong 24 giờ.
            </p>
          </div>
          <a
            className="inline-flex items-center justify-center gap-space-8 bg-secondary-container hover:bg-orange-hover text-on-primary font-label-lg text-label-lg px-space-24 py-space-16 rounded-xl shadow-[0_8px_16px_rgba(255,147,39,0.28)] transition-all flex-shrink-0 active:scale-95"
            href="#dang-ky"
          >
            <span>Kiểm tra trình độ miễn phí</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </a>
        </div>
      </div>
    </section>
  );
}
