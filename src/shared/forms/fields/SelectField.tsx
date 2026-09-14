import { type SelectHTMLAttributes, useId } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  label: string;
  options: Option[];
  placeholder?: string;
  error?: string | null;
  required?: boolean;
}

export function SelectField({
  label,
  options,
  placeholder = "-- Chọn --",
  error,
  required,
  className,
  ...rest
}: SelectFieldProps) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-[var(--color-ink,#000)]">
        {label}
        {required && <span className="ml-0.5 text-[var(--color-wayfinder-orange,#f68c1f)]">*</span>}
      </label>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className={
          "h-11 w-full rounded-[10px] border bg-white px-3 text-[15px] text-[var(--color-ink,#000)] outline-none transition-colors focus:border-[var(--color-scholar-indigo,#2c3481)] focus:ring-2 focus:ring-[var(--color-indigo-tint,#e1e4f5)] " +
          (error ? "border-red-400 " : "border-[var(--color-hairline,#e2e8f0)] ") +
          (className ?? "")
        }
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p id={errId} className="text-[12px] text-red-600">{error}</p>}
    </div>
  );
}
