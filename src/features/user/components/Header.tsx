import { useState } from 'react';
import logoIcon from '@user/assets/logo-icon-color.png';

// MODULE 1: HEADER — hợp nhất docs/design-export/desktop/code.html (thanh header 90px, nav đầy
// đủ 5 mục, không hamburger) với docs/design-export/mobile/code.html (thanh 56px, logo 2 tông
// màu, hamburger + drawer trượt 8 mục — trước đây hoàn toàn thiếu ở khoảng < xl).
export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-hairline/70 shadow-sm transition-all">
      {/* Thanh mobile/tablet (< xl): logo rút gọn 2 tông màu + hotline icon + hamburger */}
      <div className="flex xl:hidden h-14 px-4 items-center justify-between">
        <a className="flex items-center gap-2 group py-1" href="#top">
          <img src={logoIcon} alt="HuyWay English" className="w-8 h-8 object-contain flex-shrink-0" />
          <div className="flex items-baseline gap-1 text-[17px] font-semibold tracking-tight">
            <span className="text-primary font-semibold">HuyWay</span>
            <span className="text-secondary-container font-semibold">English</span>
          </div>
        </a>
        <div className="flex items-center gap-1">
          <a
            aria-label="Gọi hotline tư vấn"
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-primary rounded-xl hover:bg-indigo-wash active:scale-95 transition-all"
            href="tel:0963073488"
          >
            <span className="material-symbols-outlined text-[22px]">call</span>
          </a>
          <button
            aria-label="Mở menu điều hướng"
            aria-expanded={drawerOpen}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-ink rounded-xl hover:bg-surface-slate active:scale-95 transition-all"
            type="button"
            onClick={() => setDrawerOpen(true)}
          >
            <span className="material-symbols-outlined text-[26px]">menu</span>
          </button>
        </div>
      </div>

      {/* Thanh desktop (>= xl): logo đầy đủ + nav 5 mục + hotline + CTA */}
      <div className="hidden xl:flex h-[90px] max-w-[1240px] mx-auto px-space-20 md:px-space-32 items-center justify-between gap-space-24">
        <a className="flex items-center gap-space-12 group flex-shrink-0" href="#top">
          <img
            src={logoIcon}
            alt="HuyWay English"
            className="w-11 h-11 object-contain group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="font-headline text-title-lg text-primary tracking-tight font-bold group-hover:text-indigo-hover transition-colors">HuyWay English</span>
            <span className="text-label-sm font-label-sm text-ink-muted tracking-wide">IELTS &amp; Academic Core</span>
          </div>
        </a>
        <nav className="flex items-center gap-8">
          <a className="text-on-surface-variant hover:text-primary transition-colors text-[16px] font-semibold py-2" href="#ve-chung-toi">Về chúng tôi</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors text-[16px] font-semibold py-2" href="#cong-nghe-ung-dung">Công nghệ ứng dụng</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors text-[16px] font-semibold py-2" href="#lo-trinh-hoc">Lộ trình học</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors text-[16px] font-semibold py-2" href="#doi-ngu">Đội ngũ giáo viên</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors text-[16px] font-semibold py-2" href="#faq">FAQ</a>
        </nav>
        <div className="flex items-center gap-space-20 flex-shrink-0">
          <a className="hidden sm:flex items-center gap-space-8 text-on-surface-variant hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-indigo-wash/60" href="tel:0963073488">
            <span className="material-symbols-outlined text-[20px] text-primary">call</span>
            <span className="font-label-lg text-label-lg font-semibold tracking-wide">0963 073 488</span>
          </a>
          <a className="inline-flex items-center justify-center bg-primary-container hover:bg-indigo-hover text-on-primary px-space-24 py-[11px] rounded-xl text-label-lg font-label-lg transition-all shadow-sm hover:shadow active:scale-95" href="#dang-ky">
            Đăng ký tư vấn
          </a>
        </div>
      </div>
    </header>

      {/* Backdrop drawer mobile */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs transition-opacity duration-300 xl:hidden"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Drawer điều hướng mobile — 8 mục, trượt từ phải */}
      <aside
        aria-label="Menu chính"
        className={`fixed top-0 right-0 bottom-0 z-[60] w-[85%] max-w-[340px] bg-surface shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out border-l border-hairline xl:hidden ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-14 px-4 border-b border-hairline flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-1.5 text-base font-semibold">
            <span className="text-primary font-semibold">HuyWay</span>
            <span className="text-secondary-container font-semibold">Menu</span>
          </div>
          <button
            aria-label="Đóng menu điều hướng"
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-ink-muted hover:text-ink rounded-xl active:scale-95 transition-all"
            type="button"
            onClick={closeDrawer}
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          <a onClick={closeDrawer} className="flex items-center gap-3 min-h-[44px] px-3 rounded-xl text-[14px] font-semibold text-ink hover:bg-indigo-wash hover:text-primary transition-colors" href="#ve-chung-toi">
            <span className="material-symbols-outlined text-[20px] text-primary">info</span>
            <span>Về chúng tôi</span>
          </a>
          <a onClick={closeDrawer} className="flex items-center gap-3 min-h-[44px] px-3 rounded-xl text-[14px] font-semibold text-ink hover:bg-indigo-wash hover:text-primary transition-colors" href="#cong-nghe-ung-dung">
            <span className="material-symbols-outlined text-[20px] text-primary">laptop_chromebook</span>
            <span>Công nghệ ứng dụng</span>
          </a>
          <a onClick={closeDrawer} className="flex items-center gap-3 min-h-[44px] px-3 rounded-xl text-[14px] font-semibold text-ink hover:bg-indigo-wash hover:text-primary transition-colors" href="#rao-can">
            <span className="material-symbols-outlined text-[20px] text-primary">warning</span>
            <span>Rào cản học IELTS</span>
          </a>
          <a onClick={closeDrawer} className="flex items-center gap-3 min-h-[44px] px-3 rounded-xl text-[14px] font-semibold text-ink hover:bg-indigo-wash hover:text-primary transition-colors" href="#quy-trinh">
            <span className="material-symbols-outlined text-[20px] text-primary">format_list_numbered</span>
            <span>Quy trình 3 bước</span>
          </a>
          <a onClick={closeDrawer} className="flex items-center gap-3 min-h-[44px] px-3 rounded-xl text-[14px] font-semibold text-ink hover:bg-indigo-wash hover:text-primary transition-colors" href="#lo-trinh-hoc">
            <span className="material-symbols-outlined text-[20px] text-primary">route</span>
            <span>Lộ trình học</span>
          </a>
          <a onClick={closeDrawer} className="flex items-center gap-3 min-h-[44px] px-3 rounded-xl text-[14px] font-semibold text-ink hover:bg-indigo-wash hover:text-primary transition-colors" href="#doi-ngu">
            <span className="material-symbols-outlined text-[20px] text-primary">school</span>
            <span>Đội ngũ giảng viên</span>
          </a>
          <a onClick={closeDrawer} className="flex items-center gap-3 min-h-[44px] px-3 rounded-xl text-[14px] font-semibold text-ink hover:bg-indigo-wash hover:text-primary transition-colors" href="#cam-nhan-hoc-vien">
            <span className="material-symbols-outlined text-[20px] text-primary">forum</span>
            <span>Cảm nhận học viên</span>
          </a>
          <a onClick={closeDrawer} className="flex items-center gap-3 min-h-[44px] px-3 rounded-xl text-[14px] font-semibold text-ink hover:bg-indigo-wash hover:text-primary transition-colors" href="#faq">
            <span className="material-symbols-outlined text-[20px] text-primary">help</span>
            <span>FAQ &amp; Liên hệ</span>
          </a>
        </nav>
        <div className="p-4 border-t border-hairline bg-surface-slate flex flex-col gap-2.5 flex-shrink-0">
          <a className="w-full min-h-[44px] py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-semibold text-primary bg-surface rounded-xl border border-hairline" href="tel:0963073488">
            <span className="material-symbols-outlined text-[17px]">call</span>
            <span>0963 073 488 (Tư vấn 24/7)</span>
          </a>
          <a onClick={closeDrawer} className="w-full h-12 bg-secondary-container hover:bg-orange-hover text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(246,140,31,0.32)] active:scale-[0.98] transition-all" href="#dang-ky">
            <span>Kiểm tra trình độ miễn phí</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </a>
        </div>
      </aside>
    </>
  );
}
