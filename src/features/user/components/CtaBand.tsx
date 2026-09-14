import { ArrowDown } from "lucide-react";
import { LeadForm } from "@/shared/LeadForm/LeadForm";
import { scrollToHash } from "@user/hooks/useSmoothScroll";
import { LEAD_ANCHOR_ID } from "@user/config/sections";
import type { LeadSource } from "@/shared/forms/rules";

interface CtaBandProps {
  source: LeadSource;
  heading?: string;
  subtext?: string;
  /** Trên mobile: true → nhúng form; false (mặc định) → nút cuộn tới form Hero. */
  formOnMobile?: boolean;
}

/**
 * Dải CTA lặp lại giữa các section (Module 12). Bọc <LeadForm> — cùng nguồn Lead,
 * chống trùng server-side. Không có bản rút gọn field.
 */
export function CtaBand({
  source,
  heading = "Sẵn sàng bắt đầu lộ trình của bạn?",
  subtext = "Để lại thông tin — đội ngũ HUYWAY liên hệ tư vấn miễn phí trong 24 giờ.",
  formOnMobile = false,
}: CtaBandProps) {
  return (
    <section className="bg-[var(--color-indigo-wash,#f1f2fc)] px-4 py-12 sm:py-16">
      <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--color-ink,#000)] sm:text-3xl">{heading}</h2>
          <p className="mt-2 text-[15px] text-[var(--color-ink-body,#717174)]">{subtext}</p>
          {!formOnMobile && (
            <button
              type="button"
              onClick={() => scrollToHash(`#${LEAD_ANCHOR_ID}`)}
              className="mt-5 inline-flex h-12 items-center gap-2 rounded-[10px] bg-[var(--color-wayfinder-orange,#f68c1f)] px-6 text-[15px] font-semibold text-white hover:bg-[var(--color-wayfinder-orange-deep,#d86f0c)] md:hidden"
            >
              Kiểm tra trình độ miễn phí <ArrowDown className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className={formOnMobile ? "" : "hidden md:block"}>
          <LeadForm source={source} variant="inline" />
        </div>
      </div>
    </section>
  );
}
