import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase"; // Chú ý chỉnh lại đường dẫn cho đúng
// MODULE 7: LỘ TRÌNH KHÓA HỌC — port 1:1 từ docs/design export/code.html.
export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase
        .from('courses')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (data) setCourses(data);
    };
    fetchCourses();
  }, []);
  return (
    <section className="w-full bg-surface-slate py-space-64 border-y border-hairline" id="lo-trinh-hoc">
      <div className="max-w-[1240px] mx-auto px-space-20 md:px-space-32">
        <div className="flex flex-col items-center text-center mb-space-48 max-w-2xl mx-auto">
          <span className="px-space-16 py-space-4 rounded-full bg-indigo-wash text-primary font-label-sm text-label-sm font-semibold mb-space-12 border border-primary/20">
            Lộ trình theo trình độ
          </span>
          <h2 className="font-headline text-headline text-ink font-bold">Chọn lộ trình phù hợp với band điểm của bạn</h2>
          <p className="font-body-md text-body-md text-ink-body mt-space-8">
            Chưa chắc trình độ hiện tại?{' '}
            <a className="text-primary font-semibold hover:underline" href="#dang-ky">Kiểm tra trình độ miễn phí ngay</a>
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-24 items-stretch">
          {courses.map((course) => (
          <div 
            key={course.id} 
            className={`bg-surface rounded-3xl p-space-32 flex flex-col justify-between relative h-full transition-transform ${
              course.is_popular 
                ? "border-2 border-primary-container shadow-lg lg:-translate-y-2" 
                : "border border-hairline shadow-xs"
            }`}
          >
            {/* Nhãn Phổ biến nhất */}
            {course.is_popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-space-16 py-space-4 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold tracking-wide uppercase shadow-sm">
                Phổ biến nhất
              </div>
            )}

            <div>
              {/* Band điểm */}
              <div className={`inline-flex items-center gap-space-8 px-space-12 py-space-4 rounded-full font-label-sm text-label-sm font-semibold mb-space-16 ${
                course.is_popular ? "bg-indigo-wash text-primary" : "bg-surface-slate border border-hairline text-on-surface-variant"
              }`}>
                {course.target_band}
              </div>

              {/* Tên & Mô tả */}
              <h3 className={`font-headline text-title-lg font-bold mb-space-8 ${course.is_popular ? "text-primary" : "text-ink"}`}>
                {course.title}
              </h3>
              <p className="font-body-sm text-body-sm text-ink-muted mb-space-20 text-justify">
                {course.description}
              </p>

              {/* Danh sách quyền lợi */}
              <ul className="space-y-space-12 font-body-sm text-body-sm text-ink-body mb-space-24">
                {course.features?.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-space-8 text-justify">
                    <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 flex-shrink-0">check_circle</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nút bấm */}
            <a href="#dang-ky" className="w-full h-12 rounded-xl bg-primary text-on-primary hover:bg-indigo-hover font-label-lg text-label-lg transition-colors flex items-center justify-center shadow-xs">
              Nhận tư vấn khóa này
            </a>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}
