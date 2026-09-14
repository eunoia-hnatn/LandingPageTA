import { type ReactNode, useId } from "react";

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string | null;
  /** Link/nút mở Chính sách — truyền từ ngoài để tái dùng ở nhiều nơi. */
  policyLink: ReactNode;
}

/**
 * Văn bản đúng nguyên văn Module 2.2 (chốt 2026-09-08: giữ nguyên, không đổi).
 * KHÔNG tick sẵn.
 */
export function ConsentCheckbox({ checked, onChange, error, policyLink }: ConsentCheckboxProps) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex items-start gap-2.5 text-[13px] leading-snug text-[var(--color-ink-body,#717174)]">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : undefined}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-scholar-indigo,#2c3481)]"
        />
        <span>
          Tôi đồng ý cho HUYWAY English thu thập và sử dụng thông tin cá nhân của tôi để tư vấn lộ trình học,
          theo {policyLink}.
        </span>
      </label>
      {error && <p id={errId} className="pl-[26px] text-[12px] text-red-600">{error}</p>}
    </div>
  );
}
