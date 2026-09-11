import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase"; // Nhớ kiểm tra lại đường dẫn
// MODULE 11: FAQ — port 1:1 từ docs/design export/code.html (native <details>/<summary>).
// const FAQS = [
//   {
//     q: 'Tôi mất gốc thì bắt đầu như thế nào?',
//     a: 'Học viên mất gốc sẽ bắt đầu bằng bài test kiểm tra nền tảng ngữ pháp và ngữ âm IPA. Sau đó bạn sẽ theo học khóa Nền tảng (Foundation 3.0 - 5.0) kéo dài 3 tháng, tập trung củng cố lại từ vựng thông dụng, phát âm chuẩn và các dạng ngữ pháp chủ chốt trước khi bước vào luyện đề IELTS chuyên sâu.',
//     open: true,
//   },
//   {
//     q: 'Hình thức học là online hay offline?',
//     a: 'Huyway English triển khai cả 2 hình thức: Offline tại cơ sở Yên Xá, Thanh Trì, Hà Nội và Online tương tác trực tiếp 100% qua nền tảng phòng học số có video recording. Dù học online hay offline, học viên đều được sửa bài Writing & Speaking 1-kèm-1 với giảng viên hàng tuần.',
//     open: true,
//   },
//   {
//     q: 'Cam kết đầu ra được bảo đảm bằng văn bản như thế nào?',
//     a: 'Trước khi đóng học phí và nhập học, trung tâm sẽ ký kết văn bản cam kết bảo đảm đầu ra. Nếu học viên đáp ứng điều kiện chuyên cần nhưng không đạt điểm mục tiêu trong kỳ thi thật, bạn được quyền lựa chọn: Hoàn trả 100% học phí hoặc học lại khóa đó hoàn toàn miễn phí cho đến khi thi đỗ.',
//     open: false,
//   },
//   {
//     q: 'Học phí các khóa học được tính ra sao?',
//     a: 'Học phí tại Huyway phụ thuộc vào trình độ xuất phát điểm và band điểm mục tiêu của bạn (tương ứng với thời lượng 2.5 - 3.5 tháng). Sau khi bạn làm bài test kiểm tra trình độ, chuyên viên tư vấn sẽ gửi bảng chi phí minh bạch trọn gói gồm toàn bộ giáo trình bản quyền và lệ phí kiểm tra mô phỏng.',
//     open: false,
//   },
//   {
//     q: 'Bao lâu sau khi đăng ký tôi sẽ nhận được kết quả test và lộ trình?',
//     a: 'Ngay khi bạn để lại thông tin hoặc hoàn thành bài test trực tuyến, chuyên viên học thuật sẽ liên hệ trong vòng 60 phút để xác nhận và gửi bản đồ lộ trình chi tiết qua Zalo/Email trong tối đa 24 giờ làm việc.',
//     open: false,
//   },
// ];

export default function FAQ() {
  const [sectionData, setSectionData] = useState<any>(null);
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    const fetchSection = async () => {
      const { data } = await supabase
        .from('landing_content')
        .select('*')
        .eq('section_name', 'faq')
        .single();
      if (data) setSectionData(data);
    };

    const fetchFaqs = async () => {
      const { data } = await supabase
        .from('faqs')
        .select('*')
        .order('order_index', { ascending: true });
      if (data) setFaqs(data);
    };

    fetchSection();
    fetchFaqs();
  }, []);
  return (
    <section className="w-full bg-surface py-space-64" id="faq">
      <div className="max-w-[840px] mx-auto px-space-20 md:px-space-32">
        <div className="flex flex-col items-center text-center mb-space-48">
          <span className="px-space-16 py-space-4 rounded-full bg-indigo-wash text-primary font-label-sm text-label-sm font-semibold mb-space-12 border border-primary/20">
            Câu hỏi thường gặp
          </span>
          <h2 className="font-headline text-headline text-ink font-bold">{sectionData?.headline}</h2>
          <p className="font-body-md text-body-md text-ink-body mt-space-8 text-justify sm:text-center leading-relaxed">
            {sectionData?.subheadline}
          </p>
        </div>
        <div className="flex flex-col gap-space-16">
          {faqs.map((item, index) => (
              <details
                key={item.id} // Dùng id của database làm key cho chuẩn
                className="group bg-surface-slate rounded-2xl p-space-20 border border-hairline shadow-xs transition-all"
                open={index === 0} // Tự động mở câu hỏi đầu tiên
              >
                <summary className="flex items-center justify-between cursor-pointer font-headline text-title-md text-ink">
                  <span>{item.question}</span>
                  <span className="material-symbols-outlined text-ink-muted group-open:rotate-180 transition-transform">
                    keyboard_arrow_down
                  </span>
                </summary>
                <p className="mt-space-12 font-body-sm text-body-sm text-ink-body leading-relaxed text-justify">
                  {item.answer}
                </p>
              </details>
            ))}
        </div>
      </div>
    </section>
  );
}
