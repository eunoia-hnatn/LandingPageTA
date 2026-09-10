import { useRef, useState } from 'react';

// MODULE 9: TESTIMONIALS — port 1:1 từ docs/design-export/desktop/code.html (lưới 3 cột tĩnh)
// hợp nhất docs/design-export/mobile/code.html (carousel scroll-snap + Trước/Sau + dots).
const TESTIMONIALS = [
  {
    badge: '5.0 → 7.0 IELTS',
    quote:
      '"Trước đây mình mất gốc hoàn toàn ngữ pháp, học mẹo mãi không lên nổi 5.5. Nhờ lộ trình cá nhân hóa và phương pháp The Open Door, mình đã hiểu sâu bản chất và đạt 7.0 sau 5 tháng."',
    initials: 'HN',
    name: 'Nguyễn Hoàng Nam',
    role: 'Sinh viên ĐH Ngoại Thương - Khóa Intermediate',
  },
  {
    badge: '5.5 → 7.5 IELTS (Speaking 7.5)',
    quote:
      '"Giáo viên kèm 1-1 sửa chi tiết từng bài Writing và phản xạ Speaking hàng tuần. Lần đầu tiên mình thấy việc luyện thi không còn là áp lực mà như một thói quen học thuật thực thụ."',
    initials: 'TL',
    name: 'Trần Thảo Linh',
    role: 'Chuyên viên Marketing - Khóa Advanced',
  },
  {
    badge: 'Mất gốc → 6.5 IELTS',
    quote:
      '"Cam kết đầu ra rõ ràng bằng văn bản khiến mình rất yên tâm khi đăng ký. Đội ngũ giáo viên 8.0+ cực kỳ tận tâm, theo sát tiến độ học tập từng ngày."',
    initials: 'MQ',
    name: 'Lê Minh Quân',
    role: 'Học sinh THPT Chuyên Hà Nội - Amsterdam - Khóa Foundation',
  },
];

function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <div className="bg-surface rounded-[20px] p-6 border border-[#E2E8F0] shadow-xs flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="inline-block px-3 py-1 rounded-full bg-[#F1F2FC] text-[#2C3481] font-semibold text-xs">
            {t.badge}
          </span>
          <div className="flex items-center text-secondary-container">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="material-symbols-outlined text-[18px]">star</span>
            ))}
          </div>
        </div>
        <p className="text-justify text-slate-600 font-body-sm text-sm leading-relaxed mb-6">{t.quote}</p>
      </div>
      <div className="pt-4 border-t border-[#E2E8F0] flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-indigo-wash text-primary flex items-center justify-center font-headline font-bold text-sm flex-shrink-0">
          {t.initials}
        </div>
        <div>
          <h3 className="font-headline text-sm text-ink font-semibold">{t.name}</h3>
          <p className="text-xs text-[#8A8A8D] mt-0.5">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function scrollByCard(dir: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement | undefined;
    const gap = 16;
    const width = (card?.offsetWidth ?? el.clientWidth) + gap;
    el.scrollBy({ left: dir * width, behavior: 'smooth' });
  }

  function handleScroll() {
    const el = scrollerRef.current;
    if (!el || !el.children[0]) return;
    const width = (el.children[0] as HTMLElement).offsetWidth;
    setActiveIndex(Math.round(el.scrollLeft / width));
  }

  return (
    <section className="w-full bg-surface-slate py-space-64 border-t border-hairline" id="cam-nhan-hoc-vien">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-space-48 max-w-2xl mx-auto">
          <span className="px-space-16 py-space-4 rounded-full bg-indigo-wash text-[#2C3481] font-semibold text-label-sm mb-space-12 border border-[#2C3481]/20">
            Học viên nói gì
          </span>
          <h2 className="font-headline text-3xl md:text-4xl text-[#000000] font-semibold tracking-tight">
            Câu chuyện bứt phá band điểm từ học viên HuyWay
          </h2>
          <p className="font-body-md text-base text-[#717174] mt-space-8 leading-relaxed">
            Những trải nghiệm thực tế và kết quả cụ thể sau lộ trình học tập kỷ luật, cá nhân hóa tại HuyWay English.
          </p>
        </div>

        {/* Desktop (>= md): lưới tĩnh 3 cột */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </div>

        {/* Mobile (< md): carousel scroll-snap 1 thẻ/viewport + nút Trước/Sau + dots */}
        <div className="md:hidden relative">
          <div
            ref={scrollerRef}
            onScroll={handleScroll}
            className="overflow-x-auto snap-x snap-mandatory scrollbar-none flex gap-4 -mx-4 px-4 pb-2"
          >
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="w-[calc(100vw-32px)] max-w-[396px] flex-shrink-0 snap-center">
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
          {TESTIMONIALS.length > 1 && (
            <div className="flex items-center justify-between mt-3 px-1">
              <button
                aria-label="Xem cảm nhận trước"
                type="button"
                onClick={() => scrollByCard(-1)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-surface border border-hairline flex items-center justify-center text-primary shadow-xs hover:bg-surface-slate active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <div className="flex items-center gap-1.5">
                {TESTIMONIALS.map((t, i) => (
                  <span
                    key={t.name}
                    className={`h-1.5 rounded-full transition-all ${i === activeIndex ? 'w-5 bg-primary' : 'w-2 bg-hairline'}`}
                  />
                ))}
              </div>
              <button
                aria-label="Xem cảm nhận tiếp theo"
                type="button"
                onClick={() => scrollByCard(1)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-surface border border-hairline flex items-center justify-center text-primary shadow-xs hover:bg-surface-slate active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-[#8A8A8D] mt-6 font-normal">
          (*) 100% đánh giá được tổng hợp từ học viên thực tế tại HuyWay English kèm sự đồng thuận chia sẻ kết quả học tập.
        </p>
      </div>
    </section>
  );
}
