import { useState } from "react";
import { Loader2 } from "lucide-react";
import { TextField } from "@/shared/forms/fields/TextField";
import { SelectField } from "@/shared/forms/fields/SelectField";
import { TextAreaField } from "@/shared/forms/fields/TextAreaField";
import { ConsentCheckbox } from "@/shared/forms/fields/ConsentCheckbox";
import { PolicyModal } from "@/shared/components/PolicyModal";
import { useFormState } from "@/shared/forms/useFormState";
import { validateLead, type LeadInput, type LeadSource } from "@/shared/forms/rules";
import { submitLead } from "@/shared/LeadForm/submitLead";
import { LeadFormSuccess } from "@/shared/LeadForm/LeadFormSuccess";

export interface LeadFormProps {
  source: LeadSource;
  variant?: "card" | "inline";
  onSuccess?: (leadId: string) => void;
}

const COURSE_OPTIONS = [
  { value: "foundation", label: "IELTS Foundation (3.5–4.5)" },
  { value: "intermediate", label: "IELTS Intermediate (5.0–6.0)" },
  { value: "advanced", label: "IELTS Advanced (6.5–7.5+)" },
  { value: "chua-biet", label: "Chưa biết — cần tư vấn" },
];
const LEVEL_OPTIONS = [
  { value: "mat-goc", label: "Mất gốc / mới bắt đầu" },
  { value: "so-cap", label: "Sơ cấp (đã học cơ bản)" },
  { value: "trung-cap", label: "Trung cấp (giao tiếp được)" },
  { value: "da-thi-ielts", label: "Đã thi IELTS trước đây" },
];

type Values = {
  full_name: string;
  phone: string;
  email: string;
  course_interest: string;
  current_level: string;
  learning_need: string;
  consent: boolean;
};

const INITIAL: Values = {
  full_name: "",
  phone: "",
  email: "",
  course_interest: "",
  current_level: "",
  learning_need: "",
  consent: false,
};

export function LeadForm({ source, variant = "card", onSuccess }: LeadFormProps) {
  const [policyOpen, setPolicyOpen] = useState(false);
  const [successName, setSuccessName] = useState("");

  const form = useFormState<Values>({
    initialValues: INITIAL,
    validate: (v) => validateLead({ ...v, source }),
    submit: async (v) => {
      const payload: LeadInput = {
        full_name: v.full_name.trim(),
        phone: v.phone.trim(),
        email: v.email.trim() || undefined,
        course_interest: v.course_interest || undefined,
        current_level: v.current_level || undefined,
        learning_need: v.learning_need.trim() || undefined,
        source,
        consent: v.consent,
      };
      const res = await submitLead(payload);
      if (res.ok) {
        setSuccessName(v.full_name.trim().split(" ").slice(-1)[0] ?? "");
        onSuccess?.(res.id);
        return { ok: true };
      }
      return { ok: false, errors: res.errors, message: res.message };
    },
  });

  const wrapCls =
    variant === "card"
      ? "rounded-2xl border border-[var(--color-hairline,#e2e8f0)] bg-white p-5 shadow-[0_12px_24px_-8px_rgba(15,23,42,0.08)] sm:p-6"
      : "rounded-2xl border border-[var(--color-hairline,#e2e8f0)] bg-white p-5";

  if (form.status === "success") {
    return (
      <div className={wrapCls}>
        <LeadFormSuccess name={successName} onReset={form.reset} />
      </div>
    );
  }

  const busy = form.status === "loading";

  return (
    <>
      <form className={wrapCls} onSubmit={form.handleSubmit} noValidate>
        <div className="flex flex-col gap-3.5">
          <TextField
            label="Họ và tên"
            required
            autoComplete="name"
            value={form.values.full_name}
            error={form.errors.full_name}
            onChange={(e) => form.setField("full_name", e.target.value)}
            placeholder="Nguyễn Văn A"
          />
          <TextField
            label="Số điện thoại"
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={form.values.phone}
            error={form.errors.phone}
            onChange={(e) => form.setField("phone", e.target.value)}
            placeholder="0912 345 678"
            hint="Dùng số Việt Nam, có thể nhập +84."
          />
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            value={form.values.email}
            error={form.errors.email}
            onChange={(e) => form.setField("email", e.target.value)}
            placeholder="ban@email.com (không bắt buộc)"
          />
          <SelectField
            label="Khóa học quan tâm"
            options={COURSE_OPTIONS}
            value={form.values.course_interest}
            error={form.errors.course_interest}
            onChange={(e) => form.setField("course_interest", e.target.value)}
          />
          <SelectField
            label="Trình độ hiện tại"
            options={LEVEL_OPTIONS}
            value={form.values.current_level}
            error={form.errors.current_level}
            onChange={(e) => form.setField("current_level", e.target.value)}
          />
          <TextAreaField
            label="Nhu cầu / mục tiêu học"
            value={form.values.learning_need}
            error={form.errors.learning_need}
            onChange={(e) => form.setField("learning_need", e.target.value)}
            placeholder="VD: cần 6.5 IELTS trong 4 tháng để du học…"
          />
          <ConsentCheckbox
            checked={form.values.consent}
            error={form.errors.consent}
            onChange={(c) => form.setField("consent", c)}
            policyLink={
              <button
                type="button"
                onClick={() => setPolicyOpen(true)}
                className="font-semibold text-[var(--color-scholar-indigo,#2c3481)] underline underline-offset-2"
              >
                Chính sách bảo vệ dữ liệu cá nhân
              </button>
            }
          />

          {form.formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700" role="alert">
              {form.formError}{" "}
              <button type="button" onClick={form.handleSubmit} className="font-semibold underline">
                Thử lại
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-[var(--color-wayfinder-orange,#f68c1f)] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--color-wayfinder-orange-deep,#d86f0c)] disabled:opacity-70"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {busy ? "Đang gửi…" : "Nhận tư vấn lộ trình miễn phí"}
          </button>
        </div>
      </form>
      <PolicyModal open={policyOpen} onClose={() => setPolicyOpen(false)} />
    </>
  );
}
