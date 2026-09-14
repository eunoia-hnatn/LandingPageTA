import { supabase } from "@/shared/lib/supabase";
import type { AppRole } from "@/shared/lib/permissions";

export interface AccountRecord {
  id: string;
  email: string;
  full_name: string;
  role: AppRole;
  is_active: boolean;
  created_at: string;
}

interface EdgeResult<T> {
  ok: boolean;
  error?: string;
  users?: T[];
  user?: T;
}

async function callAdminUsers<T>(body: Record<string, unknown>): Promise<EdgeResult<T>> {
  const { data, error } = await supabase.functions.invoke<EdgeResult<T>>("admin-users", { body });
  if (error) {
    // Edge Function trả 4xx/5xx → supabase-js coi là FunctionsHttpError; đọc body nếu có.
    let message = "Không kết nối được máy chủ quản lý tài khoản.";
    const ctx = (error as { context?: Response }).context;
    if (ctx && typeof ctx.json === "function") {
      try {
        const parsed = (await ctx.json()) as EdgeResult<T>;
        if (parsed?.error) message = parsed.error;
      } catch {
        /* giữ message mặc định */
      }
    }
    return { ok: false, error: message };
  }
  return data ?? { ok: false, error: "Phản hồi rỗng từ máy chủ." };
}

export function listAccounts() {
  return callAdminUsers<AccountRecord>({ action: "list" });
}

export function createAccount(input: {
  email: string;
  password: string;
  full_name: string;
  role: AppRole;
}) {
  return callAdminUsers<AccountRecord>({ action: "create", ...input });
}

export function updateAccountRole(userId: string, role: AppRole) {
  return callAdminUsers<AccountRecord>({ action: "update_role", user_id: userId, role });
}

export function setAccountActive(userId: string, isActive: boolean) {
  return callAdminUsers<AccountRecord>({ action: "set_active", user_id: userId, is_active: isActive });
}
