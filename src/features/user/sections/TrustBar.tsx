// MODULE 3: TRUST BAR — port 1:1 từ docs/design export/code.html.
const STATS = [
  { value: '10,000+', label: 'Học viên đã đồng hành', note: 'Khảo sát tích lũy nội bộ' },
  { value: '95%', label: 'Học viên đạt mục tiêu', note: 'Đạt hoặc vượt band cam kết' },
  { value: '8.0+', label: 'IELTS trung bình GV', note: '100% chứng chỉ quốc tế TESOL/CELTA' },
  { value: '10 năm', label: 'Kinh nghiệm đào tạo', note: 'Giảng dạy & luyện thi học thuật' },
];

export default function TrustBar() {
  return (
    <section className="w-full bg-surface py-space-32 border-y border-hairline">
      <div className="max-w-[1240px] mx-auto px-space-20 md:px-space-32">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-20 lg:gap-space-24 items-stretch">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center p-space-20 bg-surface-slate rounded-2xl border border-hairline shadow-xs"
            >
              <span className="font-headline text-[34px] lg:text-[40px] leading-tight text-primary font-bold tracking-tight">
                {stat.value}
              </span>
              <span className="font-label-lg text-label-lg text-ink font-semibold mt-2">{stat.label}</span>
              <span className="font-body-sm text-[12px] text-ink-muted mt-1 leading-snug">{stat.note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
