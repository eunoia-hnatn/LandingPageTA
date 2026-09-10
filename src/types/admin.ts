import type { LucideIcon } from "lucide-react";

export interface StatMini {
  id: string;
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  tone?: "default" | "danger";
}

// ---- Content Landing ----
// (moved to src/types/content.ts — LandingSection replaced by the richer
// per-block CMS model used by ContentLandingPage)

// ---- Customers ----
export type CustomerStatus = "new" | "in-progress" | "won" | "lost";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  courseInterest: string;
  source: string;
  status: CustomerStatus;
  assignee: string;
  createdAt: string;
  /** Full ISO datetime — used to compute the overdue-lead warning. */
  createdAtISO: string;
}

// ---- Staff ----
export type StaffStatus = "active" | "inactive";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: StaffStatus;
  joinedAt: string;
}

// ---- Courses ----
export type CourseStatus = "open" | "closed";

export interface AdminCourse {
  id: string;
  name: string;
  category: string;
  price: number;
  students: number;
  capacity: number;
  status: CourseStatus;
}

// ---- Budget & Permissions ----
export interface ChannelBudget {
  id: string;
  channel: string;
  budget: number;
  spent: number;
}

export type PermissionLevel = "full" | "edit" | "view" | "none";

// ---- Leads management ----
export type LeadStatus = "new" | "in-progress" | "deposited" | "dropped";

export interface LeadRow {
  id: string;
  name: string;
  phone: string;
  courseInterest: string;
  source: string;
  status: LeadStatus;
  assignee: string;
  lastContact: string;
  createdAtISO: string;
  note?: string;
}

// ---- Reports ----
export interface RevenuePoint {
  month: string;
  revenue: number;
  target: number;
}

export interface StaffPerformance {
  id: string;
  name: string;
  leadsHandled: number;
  closed: number;
  conversionRate: number;
}
