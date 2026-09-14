import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from "../../../lib/supabase";

// MODULE 2: HERO SECTION — port 1:1 từ docs/design export/code.html.
// Form hiện là UI tĩnh (chỉ đổi trạng thái hiển thị "Cảm ơn") — nối vào submit-lead/<LeadForm>
// thật ở lượt sau (logic), theo đúng yêu cầu "copy giao diện trước, thay logic sau".
export default function Hero() {
  const [submitted, setSubmitted] = useState(false);
  const [heroData, setHeroData] = useState<any>(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      const { data } = await supabase
        .from('landing_content')
        .select('*')
        .eq('section_name', 'hero')
        .single();

      if (data) setHeroData(data);
    };
    fetchHeroData();
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      className="w-full relative overflow-hidden pt-space-32 lg:pt-space-48 pb-space-64 bg-surface-slate border-b border-hairline"
      id="dang-ky"
    >
      {/* Subtle academic background decorative blur circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-tint/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-orange-wash/60 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-48 lg:gap-space-64 items-center">
          {/* Cột trái (~45%): ảnh placeholder tách nền, xuống dưới trên mobile */}
          <div className="lg:col-span-5 flex items-center justify-center w-full order-2 lg:order-1">
            <img
              alt="Hero Image Placeholder Tách Nền"
              className="w-full max-w-[420px] lg:max-w-full h-auto object-contain select-none drop-shadow-xl"
              src={heroData && heroData.image_url ? heroData.image_url : "https://lh3.googleusercontent.com/aida/AEtj01UXNU8Schzu0k_B_Ai1pwfAKEACXKLX41HXQXuDs3ATWUXAK5tC"}
            />
          </div>
          {/* Cột phải (~55%): Eyebrow, H1, mô tả, thẻ form */}
          <div className="lg:col-span-7 flex flex-col order-1 lg:order-2">
            <div className="inline-flex items-center gap-space-8 px-space-16 py-space-4 rounded-full bg-[#F1F2FC] text-[#2C3481] font-semibold text-label-sm mb-space-16 w-fit">
              <span>{heroData?.badge_text}</span>
            </div>
            <h1 className="font-headline text-[34px] lg:text-[40px] leading-[1.2] text-[#000000] font-semibold tracking-tight mb-space-12">
              {heroData?.headline}
            </h1>
            <p className="font-body-md text-base text-[#717174] leading-relaxed mb-space-24">
              {heroData?.subheadline}
            </p>
            <div className="bg-surface rounded-[20px] p-space-28 lg:p-space-32 border border-[#E2E8F0] shadow-sm relative">
              <div className="mb-space-20">
                <h2 className="font-headline text-lg text-[#000000] font-semibold">Nhận lộ trình IELTS miễn phí</h2>
                <p className="font-body-sm text-[12px] text-[#8A8A8D] mt-1">Đánh giá chuẩn xác &amp; phản hồi trong 24h</p>
              </div>
              {submitted ? (
                <div
                  className="p-space-12 rounded-lg bg-indigo-wash text-primary font-semibold text-label-sm text-center border border-primary/20"
                  id="form-feedback"
                >
                  Cảm ơn bạn! Chuyên viên học thuật Huyway sẽ liên hệ qua SĐT/Zalo trong vòng 24 giờ.
                </div>
              ) : (
                <form className="flex flex-col gap-space-16" id="hero-registration-form" onSubmit={handleSubmit}>
                  <div>
                    <label className="block font-semibold text-label-sm text-on-surface mb-space-4" htmlFor="fullname">
                      Họ và tên <span className="text-status-error">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-space-16 text-[#8A8A8D] text-[20px]">person</span>
                      <input
                        className="w-full h-12 pl-12 pr-space-16 rounded-xl bg-surface-slate border border-[#E2E8F0] text-ink font-body-sm text-body-sm focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        id="fullname"
                        placeholder="Nguyễn Văn A"
                        required
                        type="text"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-label-sm text-on-surface mb-space-4" htmlFor="phone">
                      Số điện thoại <span className="text-status-error">*</span>
                    </label>
                    <div className="relative flex items-center bg-surface-slate border border-[#E2E8F0] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:bg-surface focus-within:border-transparent transition-all">
                      <span className="material-symbols-outlined absolute left-space-16 text-[#8A8A8D] text-[20px]">call</span>
                      <span className="pl-12 font-semibold text-label-sm text-ink">+84</span>
                      <input
                        className="w-full h-12 px-space-8 bg-transparent text-ink font-body-sm text-body-sm focus:outline-none"
                        id="phone"
                        placeholder="963 073 488"
                        required
                        type="tel"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-label-sm text-on-surface mb-space-4" htmlFor="current-band">
                      Trình độ hiện tại hoặc mục tiêu
                    </label>
                    <select
                      className="w-full h-12 px-space-16 rounded-xl bg-surface-slate border border-[#E2E8F0] text-ink font-body-sm text-body-sm focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
                      defaultValue="intermediate"
                      id="current-band"
                    >
                      <option value="unknown">Chưa rõ trình độ (Cần test thử)</option>
                      <option value="lost">Mất gốc tiếng Anh (Mục tiêu 3.0 – 5.0)</option>
                      <option value="intermediate">Đang ở Band 4.5 – 5.5 (Mục tiêu 6.5+)</option>
                      <option value="advanced">Đang ở Band 6.0+ (Mục tiêu 7.0 – 8.0+)</option>
                    </select>
                  </div>
                  <div className="flex items-start gap-space-8 pt-space-4">
                    <input
                      className="mt-1 w-4 h-4 rounded text-secondary-container focus:ring-secondary-container border-[#E2E8F0] cursor-pointer"
                      id="consent"
                      required
                      type="checkbox"
                    />
                    <label className="font-body-sm text-[12px] leading-snug text-[#717174] select-none cursor-pointer" htmlFor="consent">
                      Tôi đồng ý để HuyWay English liên hệ tư vấn lộ trình học phù hợp và bảo mật thông tin theo{' '}
                      <a className="text-[#2C3481] underline hover:text-indigo-hover font-semibold" href="#">Chính sách quyền riêng tư</a>.
                    </label>
                  </div>
                  <button
                    className="w-full h-12 bg-secondary-container hover:bg-orange-hover text-white font-semibold text-label-lg rounded-xl shadow-[0_8px_16px_rgba(255,147,39,0.28)] transition-all flex items-center justify-center gap-space-8 active:scale-[0.98] mt-1"
                    type="submit"
                  >
                    {heroData?.cta_text}
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                  <p className="text-center font-normal text-[12px] text-[#8A8A8D] mt-3">
                    🔒 100% miễn phí • Bảo mật thông tin học viên
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
