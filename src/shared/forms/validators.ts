import {
  EMAIL_RE,
  VN_PHONE_RE,
  FULL_NAME_MIN,
  FULL_NAME_MAX,
  normalizePhone,
} from "@/shared/forms/rules";

export type FieldError = string | null;

export function required(value: string, label = "Trường này"): FieldError {
  return value.trim() ? null : `${label} là bắt buộc.`;
}

export function vnPhone(value: string): FieldError {
  const v = value.trim();
  if (!v) return "Vui lòng nhập số điện thoại.";
  return VN_PHONE_RE.test(normalizePhone(v))
    ? null
    : "Số điện thoại không hợp lệ (VD: 0912 345 678).";
}

export function email(value: string): FieldError {
  const v = value.trim();
  if (!v) return null; // email không bắt buộc
  return EMAIL_RE.test(v) ? null : "Email không đúng định dạng.";
}

export function fullName(value: string): FieldError {
  const v = value.trim();
  if (!v) return "Vui lòng nhập họ và tên.";
  if (v.length < FULL_NAME_MIN || v.length > FULL_NAME_MAX)
    return `Họ tên cần ${FULL_NAME_MIN}–${FULL_NAME_MAX} ký tự.`;
  return null;
}

export function maxLen(max: number) {
  return (value: string): FieldError =>
    value.length <= max ? null : `Tối đa ${max} ký tự.`;
}

export function consentChecked(value: boolean): FieldError {
  return value ? null : "Bạn cần đồng ý với Chính sách bảo vệ dữ liệu cá nhân.";
}
