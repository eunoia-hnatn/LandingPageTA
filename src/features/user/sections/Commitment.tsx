import { useEffect, useState } from 'react';

// MODULE 10: CAM KẾT ĐẦU RA — port 1:1 từ docs/design export/code.html.
// Modal mở/đóng bằng state cục bộ (là hành vi UI, không phải "logic nghiệp vụ" — giữ nguyên
// theo yêu cầu copy giao diện trước).
const CONDITIONS = [
  {
    title: '1. Thời hạn áp dụng',
    body: 'Áp dụng cho học viên đăng ký kỳ thi IELTS chính thức trong vòng tối đa 45 ngày kể từ ngày kết thúc khóa học tại Huyway English.',
  },
  {
    title: '2. Yêu cầu chuyên cần',
    body: 'Học viên tham gia tối thiểu 90% thời lượng các buổi học trên lớp và hoàn thành 100% bài tập về nhà được giảng viên giao.',
  },
  {
    title: '3. Điều kiện thi cử',
    body: 'Học viên làm đầy đủ các bài thi thử định kỳ giữa kỳ và cuối kỳ do trung tâm tổ chức để đánh giá năng lực thực tế.',
  },
  {
    title: '4. Phạm vi áp dụng',
    body: 'Áp dụng cho các khóa luyện thi trọng điểm theo lộ trình được ký kết bằng văn bản tại trung tâm Huyway English.',
  },
];

export default function Commitment() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <section className="w-full bg-surface-slate py-space-64 border-t border-hairline" id="cam-ket">
        <div className="max-w-[1240px] mx-auto px-space-20 md:px-space-32">
          <div className="w-full bg-primary-container text-on-primary rounded-3xl p-space-32 sm:p-space-48 lg:p-space-64 shadow-xl relative overflow-hidden">
            <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-primary/40 rounded-full blur-2xl pointer-events-none" />
            <div className="max-w-3xl relative z-10">
              <div className="inline-flex items-center gap-2 px-space-16 py-space-4 rounded-full bg-on-primary/10 text-on-primary font-label-sm text-label-sm font-semibold mb-space-20 border border-on-primary/15">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span>Cam kết đầu ra chính thức</span>
              </div>
              <h2 className="font-headline text-headline md:text-[36px] font-bold text-on-primary leading-tight mb-space-16">
                Không đạt mục tiêu — hoàn 100% học phí hoặc học lại miễn phí
              </h2>
              <p className="font-body-md text-body-md text-on-primary/85 mb-space-32 leading-relaxed text-justify">
                Huyway English bảo vệ toàn diện quyền lợi học viên bằng hợp đồng đào tạo có giá trị pháp lý rõ ràng. Bạn hoàn toàn an tâm tập trung vào việc học mà không phải bận tâm về rủi ro chất lượng giảng dạy.
              </p>
              <div className="space-y-space-20 mb-space-40">
                {[
                  { icon: 'verified', title: 'Hợp đồng đào tạo chính thức', desc: 'Ký kết điều khoản điểm đầu ra cụ thể bằng văn bản có giá trị pháp lý ngay trước buổi học đầu tiên của khóa.' },
                  { icon: 'replay', title: 'Học lại miễn phí 100% hoặc hoàn phí', desc: 'Nếu thi không đạt band cam kết, học viên được học lại toàn bộ khóa hoàn toàn miễn phí không giới hạn hoặc nhận hoàn tiền học phí.' },
                  { icon: 'assignment_turned_in', title: 'Theo dõi chuyên cần định lượng minh bạch', desc: 'Báo cáo tiến trình làm bài tập và kết quả bài thi thử định kỳ được gửi chi tiết đến học viên hàng tuần nhằm điều chỉnh nhịp học kịp thời.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-space-16">
                    <div className="w-9 h-9 rounded-xl bg-on-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-secondary-fixed text-[22px]">{item.icon}</span>
                    </div>
                    <div>
                      <strong className="block text-on-primary font-title-sm text-title-sm font-semibold mb-1">{item.title}</strong>
                      <p className="font-body-sm text-body-sm text-on-primary/85 leading-relaxed text-justify">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 flex flex-wrap items-center gap-space-16">
                <button
                  className="inline-flex items-center gap-space-8 px-space-24 py-space-12 rounded-xl bg-on-primary/10 hover:bg-on-primary/20 text-on-primary font-label-lg text-label-lg transition-colors border border-on-primary/20"
                  onClick={() => setOpen(true)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">info</span>
                  <span>Xem chi tiết điều kiện áp dụng</span>
                </button>
                <span className="text-on-primary/60 text-label-sm font-label-sm">Được tư vấn chi tiết trước khi ghi danh</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL ĐIỀU KIỆN CAM KẾT */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-space-16 bg-black/60 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            className="bg-surface rounded-t-3xl sm:rounded-3xl max-w-[640px] w-full p-space-32 shadow-2xl h-[90vh] sm:h-auto max-h-[90vh] overflow-y-auto border border-hairline"
            role="dialog"
            aria-modal="true"
            aria-label="Điều kiện cam kết đầu ra"
          >
            <div className="flex items-center justify-between pb-space-16 border-b border-hairline">
              <h3 className="font-headline text-title-lg text-ink font-bold">Điều kiện cam kết đầu ra</h3>
              <button
                className="w-9 h-9 rounded-full bg-surface-slate flex items-center justify-center text-ink-muted hover:text-ink transition-colors"
                onClick={() => setOpen(false)}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="py-space-20 space-y-space-16 font-body-sm text-body-sm text-ink-body">
              {CONDITIONS.map((c) => (
                <div key={c.title}>
                  <h4 className="font-label-lg text-label-lg text-primary font-semibold mb-space-4">{c.title}</h4>
                  <p className="text-justify">{c.body}</p>
                </div>
              ))}
            </div>
            <div className="pt-space-16 border-t border-hairline flex justify-end">
              <button
                className="px-space-24 py-space-10 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg hover:bg-indigo-hover transition-colors"
                onClick={() => setOpen(false)}
                type="button"
              >
                Đã hiểu rõ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
