import { type InputHTMLAttributes, useId } from "react";

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  error?: string | null;
  hint?: string;
  required?: boolean;
}

export function TextField({ label, error, hint, required, className, ...rest }: TextFieldProps) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-[var(--color-ink,#000)]">
        {label}
        {required && <span className="ml-0.5 text-[var(--color-wayfinder-orange,#f68c1f)]">*</span>}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className={
          "h-11 w-full rounded-[10px] border bg-white px-3.5 text-[15px] text-[var(--color-ink,#000)] outline-none transition-colors placeholder:text-[var(--color-ink-muted,#8a8a8d)] focus:border-[var(--color-scholar-indigo,#2c3481)] focus:ring-2 focus:ring-[var(--color-indigo-tint,#e1e4f5)] " +
          (error ? "border-red-400 " : "border-[var(--color-hairline,#e2e8f0)] ") +
          (className ?? "")
        }
        {...rest}
      />
      {hint && !error && (
        <p className="text-[12px] text-[var(--color-ink-body,#717174)]">{hint}</p>
      )}
      {error && (
        <p id={errId} className="text-[12px] text-red-600">{error}</p>
      )}
    </div>
  );
}
