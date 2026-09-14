import { supabase } from "@/shared/lib/supabase";
import type { LeadInput } from "@/shared/forms/rules";

export interface SubmitLeadOk {
  ok: true;
  id: string;
  resubmitted: boolean;
}
export interface SubmitLeadErr {
  ok: false;
  errors?: Record<string, string>;
  message?: string;
}

/** Gọi Edge Function `submit-lead` (Nhóm 1). Validate lại server-side + normalize + chống trùng. */
export async function submitLead(input: LeadInput): Promise<SubmitLeadOk | SubmitLeadErr> {
  const { data, error } = await supabase.functions.invoke<SubmitLeadOk | SubmitLeadErr>(
    "submit-lead",
    { body: input },
  );

  if (error) {
    const ctx = (error as { context?: Response }).context;
    if (ctx && typeof ctx.json === "function") {
      try {
        const parsed = (await ctx.json()) as SubmitLeadErr;
        if (parsed && parsed.ok === false) return parsed;
      } catch {
        /* dùng message mặc định */
      }
    }
    return { ok: false, message: "Không gửi được thông tin. Vui lòng thử lại." };
  }
  return data ?? { ok: false, message: "Phản hồi rỗng từ máy chủ." };
}
