// BẢN SAO của src/shared/forms/rules.ts — giữ KHỚP NỘI DUNG (có test so khớp).
// Deno standalone, không import ngoài.

export const VN_PHONE_RE = /^0(3|5|7|8|9)[0-9]{8}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const FULL_NAME_MIN = 2;
export const FULL_NAME_MAX = 120;
export const LEARNING_NEED_MAX = 2000;

export const LEAD_SOURCES = [
  "landing_hero",
  "cta_after_hero",
  "cta_after_steps",
  "cta_after_instructor",
  "manual_hotline",
] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export function normalizePhone(raw: string): string {
  let s = (raw ?? "").replace(/[\s().-]/g, "");
  if (s.startsWith("+84")) s = "0" + s.slice(3);
  else if (s.startsWith("84") && s.length === 11) s = "0" + s.slice(2);
  return s;
}

export interface LeadInput {
  full_name: string;
  phone: string;
  email?: string;
  course_interest?: string;
  current_level?: string;
  learning_need?: string;
  source: string;
  consent: boolean;
}

export function validateLead(input: Partial<LeadInput>): Record<string, string> {
  const errors: Record<string, string> = {};

  const name = (input.full_name ?? "").trim();
  if (!name) errors.full_name = "Vui lòng nhập họ và tên.";
  else if (name.length < FULL_NAME_MIN || name.length > FULL_NAME_MAX)
    errors.full_name = `Họ tên cần ${FULL_NAME_MIN}–${FULL_NAME_MAX} ký tự.`;

  const phone = normalizePhone(input.phone ?? "");
  if (!phone) errors.phone = "Vui lòng nhập số điện thoại.";
  else if (!VN_PHONE_RE.test(phone))
    errors.phone = "Số điện thoại không hợp lệ (VD: 0912 345 678).";

  const email = (input.email ?? "").trim();
  if (email && !EMAIL_RE.test(email)) errors.email = "Email không đúng định dạng.";

  const need = (input.learning_need ?? "").trim();
  if (need.length > LEARNING_NEED_MAX)
    errors.learning_need = `Nội dung tối đa ${LEARNING_NEED_MAX} ký tự.`;

  if (input.consent !== true)
    errors.consent = "Bạn cần đồng ý với Chính sách bảo vệ dữ liệu cá nhân.";

  if (input.source && !LEAD_SOURCES.includes(input.source as LeadSource))
    errors.source = "Nguồn không hợp lệ.";

  return errors;
}
