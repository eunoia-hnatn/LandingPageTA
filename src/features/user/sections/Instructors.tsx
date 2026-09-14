import { useRef, useState } from 'react';

// MODULE 8: ĐỘI NGŨ GIÁO VIÊN — port 1:1 từ docs/design-export/desktop/code.html (lưới 3 cột
// tĩnh) hợp nhất docs/design-export/mobile/code.html (carousel scroll-snap + nút Trước/Sau + dots
// — đáp ứng AC 8.2 vốn chỉ khả thi khi 1 thẻ/viewport, nên chỉ bật carousel dưới `lg`).
const TEACHERS = [
  {
    name: 'Cô Mai Phương',
    role: 'Chuyên gia luyện Speaking & Writing',
    score: 'IELTS 8.5',
    tags: ['TESOL Quốc tế', '8 năm kinh nghiệm'],
    bio: 'Đã đồng hành cùng hơn 2,000 học viên đạt band 7.0+. Tác giả phương pháp tiếp cận tư duy cấu trúc bài thi IELTS The Open Door độc quyền tại trung tâm.',
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDVXtILpj94zKoRkQLkE1y84zVV7AWJ6WB6v2MCgT-kVmk_XocGT244Ox9XsehciNCoAbYhJ7d3jIc1P-GvEkfAGVhU7zgAxjB_Q5RC6W-lGZyCXNxgFXy8UZTMivLpDdKUqebsc_TFOm4hx_hBLUgqZUZE3tyJN8iSy_3ejGnUIi3Bo5BElC5ZV4LWw_Qk2vwt9JrUu2FSwpZBQCvgldPzB8J0nyE9fUvMix5-MS9zHWN2QVeoixBN_A',
    objectPosition: 'object-top',
  },
  {
    name: 'Cô Mai Anh',
    role: 'Chuyên gia luyện thi IELTS & Thạc sĩ Ngôn ngữ',
    score: 'IELTS 8.0',
    tags: ['CELTA Pass A', '6 năm chuyên sâu'],
    bio: 'Chuyên gia luyện phát âm chuẩn và phản xạ hội thoại tự nhiên. Chấm chữa chi tiết từng lỗi dùng từ và cấu trúc ngữ pháp theo tiêu chí chấm quốc tế IDP/BC.',
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBg0MDMeneebaiQJH2kTHQ-e9Mr8zT6V12tWoN7HJrAljPu8DOj1N53lrI-QV5am8xSGsQU0qBzK1cWUJkmzQXIDCDPO0eQeeDp4FqvTKklYoRE2l56XDeCnpNYN6iiLIQHHMhKAV9_XJGzD5AtomYx9qELzNLYA_IcDli22ehjclt3pWFPs-Gsn4zeZBclr8pTxqYuI5fTP96MO2JdDC2xJynoWp_oebvHkcsuN4SrzwOHU_t9fmAnUw',
    objectPosition: '',
  },
  {
    name: 'Thầy Quốc Tuấn',
    role: 'Chuyên gia luyện Reading & Listening',
    score: 'IELTS 8.5',
    tags: ['Reading 9.0', 'Cố vấn cá nhân hóa'],
    bio: 'Chuyên gia luyện tư duy đọc hiểu và bẫy đề thi Cambridge. Hướng dẫn kỹ thuật quản trị thời gian phòng thi giúp học viên đạt điểm tối đa ở 2 kỹ năng nghe đọc.',
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBYqayjJP_IOge4Q_TFYdm0yCUnYix-xWGq64UR3mYjYYoXIRtWod3Naj-zu_uB8b22TnfOFi_eqgubK-wfNN8LdyQPY942WRjC3X_1oXjlswdQ1L-UPdMWD8xPo4VxPl_l3hLkYTG9iKH1w1fZLfPPITzE7fUo5ACqob27Ty1ryoEDddOuH4iFHGhUsoV9P0PdxcThH60VU0CiXblS4neheSkpyBmTTBVYEKqEomLVVhfWo6tvdwTboA',
    objectPosition: '',
  },
];

function TeacherCard({ t }: { t: (typeof TEACHERS)[number] }) {
  return (
    <div className="bg-surface rounded-2xl overflow-hidden border border-hairline shadow-xs flex flex-col hover:shadow-md transition-shadow">
      <div className="h-64 w-full bg-surface-slate relative overflow-hidden">
        <img
          alt={`${t.name} - Chuyên gia luyện thi IELTS`}
          className={`w-full h-full object-cover ${t.objectPosition}`}
          src={t.photo}
        />
        <div className="absolute top-space-16 right-space-16 px-space-12 py-space-4 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-semibold shadow-sm">
          {t.score}
        </div>
      </div>
      <div className="p-space-24 flex flex-col flex-1 justify-between bg-surface">
        <div>
          <h3 className="font-headline text-title-sm text-ink font-semibold">{t.name}</h3>
          <p className="font-body-sm text-body-sm text-ink-muted mb-space-12">{t.role}</p>
          <div className="flex flex-wrap gap-space-8 mb-space-16">
            {t.tags.map((tag) => (
              <span key={tag} className="px-space-8 py-space-4 rounded-md bg-indigo-wash text-primary font-label-sm text-[12px] font-semibold">
                {tag}
              </span>
            ))}
          </div>
          <p className="font-body-sm text-body-sm text-ink-body leading-relaxed text-justify">{t.bio}</p>
        </div>
      </div>
    </div>
  );
}

export default function Instructors() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function scrollByCard(dir: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement | undefined;
    const gap = 16; // gap-4
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
    <section className="w-full bg-surface py-space-64" id="doi-ngu">
      <div className="max-w-[1240px] mx-auto px-space-20 md:px-space-32">
        <div className="flex flex-col items-center text-center mb-space-48 max-w-2xl mx-auto">
          <span className="px-space-16 py-space-4 rounded-full bg-indigo-wash text-primary font-label-sm text-label-sm font-semibold mb-space-12 border border-primary/20">
            Đội ngũ giảng viên
          </span>
          <h2 className="font-headline text-headline text-ink font-bold">Học cùng giảng viên 8.0+ IELTS</h2>
          <p className="font-body-md text-body-md text-ink-body mt-space-8 text-justify sm:text-center leading-relaxed">
            100% giảng viên tại Huyway English đạt chứng chỉ IELTS từ 8.0 trở lên cùng chứng chỉ sư phạm quốc tế, tận tâm theo dõi sự tiến bộ của từng học viên.
          </p>
        </div>

        {/* Desktop (>= lg): lưới tĩnh 3 cột */}
        <div className="hidden lg:grid grid-cols-3 gap-space-24">
          {TEACHERS.map((t) => (
            <TeacherCard key={t.name} t={t} />
          ))}
        </div>

        {/* Mobile/Tablet (< lg): carousel scroll-snap 1 thẻ/viewport + nút Trước/Sau + dots (AC 8.2) */}
        <div className="lg:hidden relative">
          <div
            ref={scrollerRef}
            onScroll={handleScroll}
            className="overflow-x-auto snap-x snap-mandatory scrollbar-none flex gap-4 -mx-4 px-4 pb-2"
          >
            {TEACHERS.map((t) => (
              <div key={t.name} className="w-[calc(100vw-32px)] max-w-[396px] flex-shrink-0 snap-center">
                <TeacherCard t={t} />
              </div>
            ))}
          </div>
          {TEACHERS.length > 1 && (
            <div className="flex items-center justify-between mt-3 px-1">
              <button
                aria-label="Xem giáo viên trước"
                type="button"
                onClick={() => scrollByCard(-1)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-surface border border-hairline flex items-center justify-center text-primary shadow-xs hover:bg-surface-slate active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <div className="flex items-center gap-1.5">
                {TEACHERS.map((t, i) => (
                  <span
                    key={t.name}
                    className={`h-1.5 rounded-full transition-all ${i === activeIndex ? 'w-5 bg-primary' : 'w-2 bg-hairline'}`}
                  />
                ))}
              </div>
              <button
                aria-label="Xem giáo viên tiếp theo"
                type="button"
                onClick={() => scrollByCard(1)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-surface border border-hairline flex items-center justify-center text-primary shadow-xs hover:bg-surface-slate active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
