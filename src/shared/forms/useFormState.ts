import { useCallback, useRef, useState } from "react";

export type FormStatus = "idle" | "loading" | "success" | "error";

interface Options<V> {
  initialValues: V;
  /** Validate toàn form → map field→msg (rỗng = hợp lệ). */
  validate: (values: V) => Record<string, string>;
  /** Gửi lên server. Ném lỗi hoặc trả { ok:false, errors } để báo lỗi. */
  submit: (values: V) => Promise<{ ok: true } | { ok: false; errors?: Record<string, string>; message?: string }>;
  /** Timeout submit (ms). Mặc định 15s — không để kẹt "loading". */
  timeoutMs?: number;
}

interface FormState<V> {
  values: V;
  errors: Record<string, string>;
  status: FormStatus;
  /** Banner lỗi chung (khác lỗi field). */
  formError: string | null;
  setField: <K extends keyof V>(key: K, value: V[K]) => void;
  handleSubmit: (e?: { preventDefault?: () => void }) => void;
  reset: () => void;
}

export function useFormState<V extends Record<string, unknown>>({
  initialValues,
  validate,
  submit,
  timeoutMs = 15_000,
}: Options<V>): FormState<V> {
  const [values, setValues] = useState<V>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const setField = useCallback(<K extends keyof V>(key: K, value: V[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key as string]) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
    setFormError(null);
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setFormError(null);
    setStatus("idle");
    inFlight.current = false;
  }, [initialValues]);

  const handleSubmit = useCallback(
    (e?: { preventDefault?: () => void }) => {
      e?.preventDefault?.();
      if (inFlight.current) return; // chống double-submit

      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setStatus("error");
        return;
      }

      inFlight.current = true;
      setErrors({});
      setFormError(null);
      setStatus("loading");

      let settled = false;
      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        inFlight.current = false;
        setStatus("error");
        setFormError("Gửi thông tin quá lâu, vui lòng thử lại.");
      }, timeoutMs);

      void (async () => {
        try {
          const res = await submit(values);
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          inFlight.current = false;
          if (res.ok) {
            setStatus("success");
          } else {
            setErrors(res.errors ?? {});
            setFormError(res.message ?? "Có lỗi xảy ra, vui lòng thử lại.");
            setStatus("error");
          }
        } catch {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          inFlight.current = false;
          setStatus("error");
          setFormError("Không gửi được thông tin. Kiểm tra kết nối và thử lại.");
        }
      })();
    },
    [values, validate, submit, timeoutMs],
  );

  return { values, errors, status, formError, setField, handleSubmit, reset };
}
