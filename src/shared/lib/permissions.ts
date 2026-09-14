import type { AppRole } from "@/shared/lib/database.types";

export type { AppRole };

export const ROLE_LABEL: Record<AppRole, string> = {
  super_admin: "Super Admin",
  marketing: "Marketing",
  cskh: "CSKH",
};

/**
 * Vai trò nào được thấy / vào từng section admin.
 * Nguồn chân lý cho: lọc menu Sidebar + gate section trong App.tsx.
 * (id khớp key trong PAGES/NAV_ITEMS của admin hiện tại.)
 */
export const SECTION_ROLES: Record<string, AppRole[]> = {
  overview: ["super_admin"],
  content: ["super_admin", "marketing"],
  customers: ["super_admin", "cskh"],
  leads: ["super_admin", "cskh"],
  budget: ["super_admin"],
  staff: ["super_admin"],
  courses: ["super_admin"],
  reports: ["super_admin"],
  accounts: ["super_admin"],
};

/** Section mặc định khi đăng nhập, theo vai trò. */
export const ROLE_HOME: Record<AppRole, string> = {
  super_admin: "overview",
  marketing: "content",
  cskh: "leads",
};

export function canAccessSection(role: AppRole | null | undefined, sectionId: string): boolean {
  if (!role) return false;
  const allowed = SECTION_ROLES[sectionId];
  return allowed ? allowed.includes(role) : false;
}

/** Danh sách section một vai trò được phép, giữ đúng thứ tự truyền vào. */
export function accessibleSections(role: AppRole | null | undefined, order: string[]): string[] {
  return order.filter((id) => canAccessSection(role, id));
}
