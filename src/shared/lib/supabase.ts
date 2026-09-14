import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/lib/database.types";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Fail nhanh, rõ ràng thay vì lỗi mơ hồ lúc gọi API.
  throw new Error(
    "Thiếu VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY. Kiểm tra file .env.",
  );
}

// Client Supabase DUY NHẤT của toàn app (user + admin).
export const supabase = createClient<Database>(url, anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
