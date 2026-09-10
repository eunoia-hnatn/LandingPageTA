// MODULE 5: NHẬN DIỆN VẤN ĐỀ (PAIN POINTS) — port 1:1 từ docs/design export/code.html.
const PAINS = [
  {
    icon: 'explore_off',
    title: 'Không biết bắt đầu từ đâu',
    desc: 'Quá nhiều tài liệu trên mạng và ma trận phương pháp khiến bạn hoang mang không rõ nên học kỹ năng nào trước và phân bổ quỹ thời gian ra sao cho hiệu quả.',
    tag: 'Lãng phí trung bình 3-6 tháng',
  },
  {
    icon: 'trending_flat',
    title: 'Học mãi không lên band',
    desc: 'Giải hàng chục bộ đề Cambridge nhưng điểm số vẫn giậm chân tại mức 5.0 - 5.5. Càng giải nhiều đề càng cảm giác đuối sức và bế tắc về phương pháp tư duy.',
    tag: 'Sai phương pháp tư duy đề',
  },
  {
    icon: 'menu_book',
    title: 'Mất gốc ngữ pháp & từ vựng',
    desc: 'Nền tảng phát âm chuẩn IPA và hệ thống cấu trúc ngữ pháp học thuật chưa vững khiến việc rèn luyện cả 4 kỹ năng Nghe - Nói - Đọc - Viết rơi vào trạng thái quá tải.',
    tag: 'Cần xây gốc chuẩn mực',
  },
  {
    icon: 'support_agent',
    title: 'Không có người kèm sát',
    desc: 'Tự học thiếu người chỉnh sửa chi tiết bài Speaking và Writing theo barem chấm của giám khảo IDP/BC, dẫn đến việc liên tục lặp lại các lỗi sai cố hữu mà không tự phát hiện.',
    tag: 'Cần phản hồi 1-1 chuyên sâu',
  },
];

export default function PainPoints() {
  return (
    <section className="w-full bg-surface-slate py-space-64 border-y border-hairline" id="rao-can">
      <div className="max-w-[1240px] mx-auto px-space-20 md:px-space-32">
        <div className="flex flex-col items-center text-center mb-space-48 max-w-2xl mx-auto">
          <span className="px-space-16 py-space-4 rounded-full bg-indigo-wash text-primary font-label-sm text-label-sm font-semibold mb-space-12 border border-primary/20">
            Bạn có đang gặp phải?
          </span>
          <h2 className="font-headline text-headline text-ink font-bold">Những rào cản thường gặp khi tự học IELTS</h2>
          <p className="font-body-md text-body-md text-ink-body mt-space-8 text-justify sm:text-center leading-relaxed">
            Tự học IELTS không sai, nhưng thiếu định hướng bài bản khiến hơn 80% người học mất trung bình từ 6 đến 18 tháng mà không đạt được mốc điểm mong muốn.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-20">
          {PAINS.map((p) => (
            <div
              key={p.title}
              className="p-space-24 bg-surface rounded-2xl border border-hairline shadow-xs flex flex-col h-full hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-wash text-primary flex items-center justify-center mb-space-16 border border-primary/10 flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">{p.icon}</span>
              </div>
              <h3 className="font-headline text-title-sm text-ink font-semibold mb-space-8 min-h-[50px] flex items-center">
                {p.title}
              </h3>
              <p className="font-body-sm text-body-sm text-ink-body leading-relaxed text-justify flex-1">{p.desc}</p>
              <div className="mt-auto pt-space-16 border-t border-hairline font-label-sm text-label-sm text-secondary-container flex items-center gap-space-4 font-semibold">
                <span className="material-symbols-outlined text-[16px]">priority_high</span>
                <span>{p.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
