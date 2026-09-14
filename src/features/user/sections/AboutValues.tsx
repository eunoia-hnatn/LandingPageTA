import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
// MODULE 4: VỀ CHÚNG TÔI & GIÁ TRỊ KHÁC BIỆT — port 1:1 từ docs/design export/code.html.
export default function AboutValues() {
  const [sectionData, setSectionData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('landing_content')
        .select('*')
        .eq('section_name', 'about') 
        .single();

      if (data) setSectionData(data);
    };
    fetchData();
  }, []);
  return (
    <section className="w-full bg-surface py-space-64" id="ve-chung-toi">
      <div className="max-w-[1240px] mx-auto px-space-20 md:px-space-32">
        <div className="flex flex-col items-center text-center mb-space-48 max-w-3xl mx-auto">
          <span className="px-space-16 py-space-4 rounded-full bg-indigo-wash text-primary font-label-sm text-label-sm font-semibold mb-space-12 border border-primary/20">
            Về Huyway English
          </span>
          <h2 className="font-headline text-headline text-ink font-bold">{sectionData?.headline}</h2>
          <p className="font-body-md text-body-md text-ink-body mt-space-8 text-justify sm:text-center leading-relaxed">
            {sectionData?.subheadline}
          </p>
        </div>
        {/* Sứ mệnh & Tầm nhìn */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-24 mb-space-32">
          <div className="p-space-32 bg-surface-slate rounded-2xl border border-hairline flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center mb-space-16 shadow-xs">
                <span className="material-symbols-outlined text-[24px]">flag</span>
              </div>
              <h3 className="font-headline text-title-lg text-primary font-bold mb-space-8">Sứ mệnh đào tạo</h3>
              <p className="font-body-md text-body-md text-ink-body leading-relaxed text-justify">
                Giải phóng tiềm năng học thuật của người Việt qua phương pháp tiếp cận IELTS dựa trên hiểu bản chất, giúp người học không chỉ đạt điểm chứng chỉ mà có thể tự tin sử dụng tiếng Anh trong nghiên cứu, làm việc và định cư quốc tế.
              </p>
            </div>
            <div className="mt-space-24 pt-space-16 border-t border-hairline flex items-center gap-space-8 text-primary font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Phương pháp The Open Door độc quyền</span>
            </div>
          </div>
          <div className="p-space-32 bg-surface-slate rounded-2xl border border-hairline flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center mb-space-16 shadow-xs">
                <span className="material-symbols-outlined text-[24px]">visibility</span>
              </div>
              <h3 className="font-headline text-title-lg text-primary font-bold mb-space-8">Tầm nhìn dài hạn</h3>
              <p className="font-body-md text-body-md text-ink-body leading-relaxed text-justify">
                Trở thành biểu tượng uy tín hàng đầu trong lĩnh vực đào tạo chứng chỉ học thuật tiếng Anh tại Việt Nam, nơi tiêu chuẩn chất lượng được định lượng minh bạch và kết quả thực tế của từng học viên là thước đo giá trị cao nhất.
              </p>
            </div>
            <div className="mt-space-24 pt-space-16 border-t border-hairline flex items-center gap-space-8 text-primary font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
              <span>Hơn 95% học viên đạt hoặc vượt band mục tiêu</span>
            </div>
          </div>
        </div>
        {/* 3 Card Giá trị cốt lõi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-24">
          {[
            {
              icon: 'contract',
              title: 'Cam kết đầu ra bằng văn bản',
              desc: 'Mỗi học viên khi bắt đầu lộ trình đều ký hợp đồng bảo đảm quyền lợi. Hoàn 100% học phí hoặc đào tạo lại miễn phí không giới hạn nếu không đạt mục tiêu đã đề ra theo điều kiện cam kết.',
              tag: 'Rõ ràng • Pháp lý minh bạch',
            },
            {
              icon: 'route',
              title: 'Lộ trình cá nhân hóa',
              desc: 'Thiết kế riêng biệt dựa trên kết quả kiểm tra 4 kỹ năng chi tiết. Tuyệt đối không bắt học viên học lại kiến thức đã nắm vững, tiết kiệm tối đa thời gian và chi phí ôn luyện.',
              tag: 'Tập trung điểm yếu cốt lõi',
            },
            {
              icon: 'school',
              title: 'Giảng viên 8.0+ IELTS',
              desc: 'Đội ngũ giàu kinh nghiệm thực chiến từ 6 đến 10 năm, sở hữu chứng chỉ giảng dạy quốc tế (TESOL, CELTA). Sửa bài Writing & Speaking chi tiết từng tiêu chí chấm thi của IDP/BC.',
              tag: 'Đồng hành sát sao 1-kèm-1',
            },
          ].map((v) => (
            <div
              key={v.title}
              className="p-space-24 bg-surface rounded-2xl border border-hairline shadow-xs hover:border-primary/40 hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-wash text-primary flex items-center justify-center mb-space-20 border border-primary/10">
                  <span className="material-symbols-outlined text-[24px]">{v.icon}</span>
                </div>
                <h4 className="font-headline text-title-sm text-ink font-semibold mb-space-8">{v.title}</h4>
                <p className="font-body-sm text-body-sm text-ink-body leading-relaxed text-justify">{v.desc}</p>
              </div>
              <div className="mt-space-20 pt-space-16 border-t border-hairline flex items-center text-primary font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[16px] mr-1">check_circle</span>
                <span>{v.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
