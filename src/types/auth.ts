import type { AppRole } from "@/shared/lib/database.types";

// Vai trò chuẩn hoá theo enum public.app_role (snake_case).
export type Role = AppRole;

export type AccountStatus = "active" | "locked";

export interface Account {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: AccountStatus;
}
