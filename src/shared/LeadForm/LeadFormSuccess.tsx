import { CheckCircle2 } from "lucide-react";

interface LeadFormSuccessProps {
  onReset?: () => void;
  name?: string;
}

/** Trạng thái "Thank You" inline sau khi gửi Lead thành công. */
export function LeadFormSuccess({ onReset, name }: LeadFormSuccessProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--color-hairline,#e2e8f0)] bg-white px-6 py-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-indigo-wash,#f1f2fc)] text-[var(--color-scholar-indigo,#2c3481)]">
        <CheckCircle2 className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-ink,#000)]">
        Đã nhận thông tin{name ? `, ${name}` : ""}!
      </h3>
      <p className="max-w-sm text-[14px] text-[var(--color-ink-body,#717174)]">
        Đội ngũ HUYWAY English sẽ liên hệ tư vấn lộ trình cho bạn trong vòng 24 giờ. Vui lòng để ý điện thoại.
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="mt-1 text-[13px] font-semibold text-[var(--color-scholar-indigo,#2c3481)] underline underline-offset-2"
        >
          Gửi thêm thông tin khác
        </button>
      )}
    </div>
  );
}
