import type { Role } from "@/types/auth";
import type { PermissionLevel } from "@/types/admin";

// ROLE_LABEL sống ở lớp shared (nguồn chân lý); re-export để code admin cũ khỏi đổi import.
export { ROLE_LABEL } from "@/shared/lib/permissions";

interface NavPermissionEntry {
  label: string;
  superAdmin: PermissionLevel;
  marketing: PermissionLevel;
  cskh: PermissionLevel;
}

// Single source of truth for menu visibility and access levels.
export const NAV_PERMISSIONS: Record<string, NavPermissionEntry> = {
  overview: { label: "Tổng quan Dashboard", superAdmin: "full", marketing: "view", cskh: "view" },
  content: { label: "Quản lý Content Landing", superAdmin: "full", marketing: "edit", cskh: "none" },
  customers: { label: "Danh sách khách hàng", superAdmin: "full", marketing: "view", cskh: "edit" },
  staff: { label: "Quản lý nhân viên", superAdmin: "full", marketing: "none", cskh: "none" },
  courses: { label: "Quản lý khóa học", superAdmin: "full", marketing: "view", cskh: "view" },
  leads: { label: "Quản lý Leads", superAdmin: "full", marketing: "view", cskh: "edit" },
  reports: { label: "Báo cáo & Thống kê", superAdmin: "full", marketing: "view", cskh: "view" },
};

export function getPermissionLevel(navId: string, role: Role): PermissionLevel {
  const entry = NAV_PERMISSIONS[navId];
  if (!entry) return "none";
  if (role === "super_admin") return entry.superAdmin;
  if (role === "marketing") return entry.marketing;
  return entry.cskh;
}

export function canEdit(navId: string, role: Role): boolean {
  const level = getPermissionLevel(navId, role);
  return level === "full" || level === "edit";
}
