import {
  Users,
  Clock3,
  BadgeCheck,
  AlertTriangle,
  LayoutGrid,
  FileEdit,
  Users2,
  UserCog,
  KeyRound,
  GraduationCap,
  Target,
  BarChart3,
} from "lucide-react";
import type {
  DashboardDataset,
  DateRangeKey,
  NavItem,
} from "@/types/dashboard";

export const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Tổng quan", icon: LayoutGrid },
  { id: "content", label: "Quản lý Content Landing", icon: FileEdit },
  { id: "customers", label: "Danh sách khách hàng", icon: Users2, badge: 3 },
  { id: "staff", label: "Quản lý nhân viên", icon: UserCog },
  { id: "courses", label: "Quản lý khóa học", icon: GraduationCap },
  { id: "leads", label: "Quản lý Leads", icon: Target },
  { id: "reports", label: "Báo cáo & Thống kê", icon: BarChart3 },
  { id: "accounts", label: "Quản lý tài khoản", icon: KeyRound },
];

const LEADS_7D = [
  { day: "T2", leads: 180 },
  { day: "T3", leads: 220 },
  { day: "T4", leads: 245 },
  { day: "T5", leads: 205 },
  { day: "T6", leads: 275 },
  { day: "T7", leads: 225 },
  { day: "CN", leads: 160 },
];

const LEADS_30D = [
  { day: "01", leads: 120 }, { day: "03", leads: 150 }, { day: "05", leads: 165 },
  { day: "07", leads: 140 }, { day: "09", leads: 190 }, { day: "11", leads: 210 },
  { day: "13", leads: 175 }, { day: "15", leads: 230 }, { day: "17", leads: 205 },
  { day: "19", leads: 260 }, { day: "21", leads: 240 }, { day: "23", leads: 280 },
  { day: "25", leads: 255 }, { day: "27", leads: 300 }, { day: "29", leads: 270 },
];

const LEADS_TODAY = [
  { day: "6h", leads: 4 }, { day: "9h", leads: 9 }, { day: "12h", leads: 7 },
  { day: "15h", leads: 12 }, { day: "18h", leads: 6 }, { day: "21h", leads: 4 },
];

function buildDataset(range: DateRangeKey): DashboardDataset {
  const leadsByDay =
    range === "today" ? LEADS_TODAY : range === "30d" ? LEADS_30D : LEADS_7D;

  const scale = range === "today" ? 0.05 : range === "30d" ? 4.1 : 1;

  return {
    kpis: [
      {
        id: "total-leads",
        title: "Tổng Lead Tháng Này",
        value:
          range === "30d" ? "5,118" : range === "today" ? "42" : "1,248",
        trend: range === "today" ? "+5 lead" : "+16.2%",
        trendDirection: "up",
        description:
          range === "today"
            ? "So với 2 ngày trước"
            : "So với cùng kỳ tháng trước",
        icon: Users,
        tone: "default",
      },
      {
        id: "new-today",
        title: "Lead Mới Hôm Nay",
        value: "42",
        trend: "+5 leads",
        trendDirection: "up",
        description: "So với 2 ngày trước",
        icon: Clock3,
        tone: "default",
      },
      {
        id: "close-rate",
        title: "Tỷ Lệ Chốt Khóa Học",
        value: "34.5%",
        trend: "+2.1%",
        trendDirection: "up",
        description: "So với tháng trước",
        icon: BadgeCheck,
        tone: "default",
      },
      {
        id: "overdue",
        title: "Lead Chưa Xử Lý / Quá Hạn",
        value: String(Math.max(3, Math.round(15 * scale))),
        description: "Phân bổ đều cho 3 CSKH",
        icon: AlertTriangle,
        tone: "danger",
        badge: "3 Cần liên hệ gấp (>2h)",
      },
    ],
    leadsByDay,
    leadStatus: [
      { id: "new", label: "Mới", value: 28, color: "var(--color-primary)" },
      { id: "in-progress", label: "Đang tư vấn", value: 25, color: "var(--color-warning)" },
      { id: "closed", label: "Đã cọc", value: 22, color: "var(--color-success)" },
      { id: "dropped", label: "Bỏ cuộc", value: 15, color: "#f87171" },
      { id: "other", label: "Khác", value: 10, color: "#9ca3af" },
    ],
    courses: [
      { id: "ielts-intensive", name: "IELTS Intensive", count: 542, percentage: 43, color: "var(--color-primary)" },
      { id: "business-english", name: "Giao tiếp Doanh nghiệp", count: 310, percentage: 25, color: "var(--color-success)" },
      { id: "toeic", name: "TOEIC 550+", count: 245, percentage: 20, color: "var(--color-warning)" },
      { id: "foundation", name: "Tiếng Anh Nền tảng", count: 151, percentage: 12, color: "var(--color-violet)" },
    ],
    trafficSources: [
      { id: "fb-ads", channel: "Facebook Ads IELTS Camp", registrations: 626, conversionRate: 38.2, syncStatus: "auto" },
      { id: "google-search", channel: "Google Search (Brand + SEO)", registrations: 316, conversionRate: 42.5, syncStatus: "auto" },
      { id: "tiktok", channel: "TikTok Social Link", registrations: 213, conversionRate: 22.1, syncStatus: "auto" },
      { id: "direct", channel: "Direct / Other", registrations: 106, conversionRate: 55.0, syncStatus: "full" },
    ],
  };
}

export function getDashboardData(range: DateRangeKey): DashboardDataset {
  return buildDataset(range);
}
