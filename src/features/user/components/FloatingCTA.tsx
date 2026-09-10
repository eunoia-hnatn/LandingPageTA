// Floating Action Button — port 1:1 từ docs/design export/code.html.
export default function FloatingCTA() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <a
        aria-label="Cuộn lên đầu trang"
        className="hidden sm:flex w-10 h-10 rounded-full bg-surface shadow-md border border-hairline items-center justify-center text-primary hover:bg-surface-slate transition-all"
        href="#top"
      >
        <span className="material-symbols-outlined text-[20px]">keyboard_arrow_up</span>
      </a>
      <a
        className="inline-flex items-center gap-space-8 bg-secondary-container hover:bg-orange-hover text-on-primary font-label-lg text-label-lg px-space-24 py-space-16 rounded-full shadow-[0_8px_16px_rgba(255,147,39,0.3)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
        href="#dang-ky"
      >
        <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
        <span>Kiểm tra trình độ</span>
      </a>
    </div>
  );
}
