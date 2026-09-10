import type {
  AdminCourse,
  ChannelBudget,
  Customer,
  LeadRow,
  RevenuePoint,
  StaffMember,
  StaffPerformance,
} from "@/types/admin";

const FIRST_NAMES = ["Nguyễn Văn", "Trần Thị", "Lê Hoàng", "Phạm Thị", "Đỗ Minh", "Vũ Thu", "Hoàng Anh", "Bùi Ngọc", "Đặng Gia", "Ngô Thảo", "Dương Quốc", "Lý Kim"];
const LAST_NAMES = ["An", "Bình", "Chi", "Dũng", "Hà", "Khang", "Linh", "Minh", "Nam", "Phương", "Quân", "Trang"];
export const COURSES = ["IELTS Intensive", "Giao tiếp Doanh nghiệp", "TOEIC 550+", "Tiếng Anh Nền tảng"];
const SOURCES = ["Facebook Ads IELTS Camp", "Google Search (Brand + SEO)", "TikTok Social Link", "Direct / Other"];
export const CSKH = ["Thu Hà", "Minh Quân", "Bảo Trân"];

function nameAt(i: number) {
  return `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[(i * 3) % LAST_NAMES.length]}`;
}

function phoneAt(i: number) {
  return `09${(12345678 + i * 137) % 90000000 + 10000000}`.slice(0, 10);
}

// Shared "current time" reference for the mock dataset so relative labels
// ("2.5h trước", "Hôm qua"...) stay consistent across the app.
export const MOCK_NOW = new Date("2026-09-08T13:45:00");

function isoHoursAgo(hours: number) {
  return new Date(MOCK_NOW.getTime() - hours * 3_600_000).toISOString();
}

const CUSTOMER_STATUSES: Customer["status"][] = ["new", "in-progress", "won", "lost"];

// A couple of rows are deliberately kept just over the 2-hour SLA (and still
// "new") so the overdue warning has something to demonstrate.
const OVERDUE_DEMO_HOURS: Record<number, number> = { 0: 2.5, 4: 3.1 };

export const CUSTOMERS: Customer[] = Array.from({ length: 24 }, (_, i) => {
  const name = nameAt(i);
  const hoursAgo = OVERDUE_DEMO_HOURS[i] ?? (i * 5) % 96;
  return {
    id: `cust-${i + 1}`,
    name,
    phone: phoneAt(i),
    email: `${name.split(" ").join("").toLowerCase()}@gmail.com`,
    courseInterest: COURSES[i % COURSES.length],
    source: SOURCES[i % SOURCES.length],
    status: CUSTOMER_STATUSES[i % CUSTOMER_STATUSES.length],
    assignee: CSKH[i % CSKH.length],
    createdAt: `0${(i % 9) + 1}/09/2026`,
    createdAtISO: isoHoursAgo(hoursAgo),
  };
});

export const STAFF_MEMBERS: StaffMember[] = [
  { id: "s1", name: "Lưu Tiến Huy", email: "huy@huyway.edu.vn", role: "Giáo viên chính", department: "Đào tạo", status: "active", joinedAt: "01/2023" },
  { id: "s2", name: "Nguyễn Thu Hà", email: "ha.nguyen@huyway.edu.vn", role: "CSKH", department: "Chăm sóc khách hàng", status: "active", joinedAt: "06/2024" },
  { id: "s3", name: "Trần Minh Quân", email: "quan.tran@huyway.edu.vn", role: "CSKH", department: "Chăm sóc khách hàng", status: "active", joinedAt: "02/2025" },
  { id: "s4", name: "Lê Bảo Trân", email: "tran.le@huyway.edu.vn", role: "CSKH", department: "Chăm sóc khách hàng", status: "active", joinedAt: "09/2025" },
  { id: "s5", name: "Phạm Gia Bảo", email: "bao.pham@huyway.edu.vn", role: "Marketing Executive", department: "Marketing", status: "active", joinedAt: "03/2024" },
  { id: "s6", name: "Đỗ Ngọc Ánh", email: "anh.do@huyway.edu.vn", role: "Content Creator", department: "Marketing", status: "active", joinedAt: "11/2024" },
  { id: "s7", name: "Vũ Hoài Nam", email: "nam.vu@huyway.edu.vn", role: "Giáo viên IELTS", department: "Đào tạo", status: "active", joinedAt: "05/2025" },
  { id: "s8", name: "Hoàng Thảo Vy", email: "vy.hoang@huyway.edu.vn", role: "Kế toán", department: "Vận hành", status: "inactive", joinedAt: "01/2022" },
];

export const ADMIN_COURSES: AdminCourse[] = [
  { id: "c1", name: "IELTS Intensive (Luyện thi cấp tốc)", category: "IELTS", price: 6500000, students: 542, capacity: 600, status: "open" },
  { id: "c2", name: "Giao tiếp Doanh nghiệp / Đi làm", category: "Giao tiếp", price: 4200000, students: 310, capacity: 400, status: "open" },
  { id: "c3", name: "TOEIC 550+ Đột phá", category: "TOEIC", price: 3800000, students: 245, capacity: 300, status: "open" },
  { id: "c4", name: "Tiếng Anh Nền tảng cho người mất gốc", category: "Nền tảng", price: 2900000, students: 151, capacity: 250, status: "open" },
  { id: "c5", name: "IELTS Speaking Workshop", category: "IELTS", price: 1800000, students: 88, capacity: 120, status: "open" },
  { id: "c6", name: "Luyện thi TOEFL iBT", category: "TOEFL", price: 5200000, students: 34, capacity: 150, status: "closed" },
];

export const CHANNEL_BUDGETS: ChannelBudget[] = [
  { id: "b1", channel: "Facebook Ads IELTS Camp", budget: 80_000_000, spent: 62_400_000 },
  { id: "b2", channel: "Google Search (Brand + SEO)", budget: 40_000_000, spent: 18_200_000 },
  { id: "b3", channel: "TikTok Social Link", budget: 30_000_000, spent: 27_900_000 },
  { id: "b4", channel: "Direct / Referral Program", budget: 15_000_000, spent: 6_100_000 },
];

const LEAD_STATUSES: LeadRow["status"][] = ["new", "in-progress", "deposited", "dropped"];

// Reference "today" for the mock dataset — keep in sync with the app's
// current-date context so "X ngày trước" style filters look sensible.
const TODAY = new Date("2026-09-08T00:00:00");

function isoDaysAgo(days: number) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export const LEAD_ROWS: LeadRow[] = Array.from({ length: 20 }, (_, i) => {
  const name = nameAt(i + 5);
  const daysAgo = (i * 3) % 30;
  return {
    id: `lead-${i + 1}`,
    name,
    phone: phoneAt(i + 5),
    courseInterest: COURSES[(i + 1) % COURSES.length],
    source: SOURCES[(i + 2) % SOURCES.length],
    status: LEAD_STATUSES[i % LEAD_STATUSES.length],
    assignee: CSKH[(i + 1) % CSKH.length],
    lastContact: daysAgo === 0 ? "Hôm nay" : `${daysAgo} ngày trước`,
    createdAtISO: isoDaysAgo(daysAgo),
  };
});

export const REVENUE_TREND: RevenuePoint[] = [
  { month: "T3", revenue: 420, target: 450 },
  { month: "T4", revenue: 468, target: 460 },
  { month: "T5", revenue: 512, target: 480 },
  { month: "T6", revenue: 495, target: 500 },
  { month: "T7", revenue: 560, target: 520 },
  { month: "T8", revenue: 605, target: 550 },
  { month: "T9", revenue: 588, target: 570 },
];

export const STAFF_PERFORMANCE: StaffPerformance[] = [
  { id: "sp1", name: "Nguyễn Thu Hà", leadsHandled: 186, closed: 74, conversionRate: 39.8 },
  { id: "sp2", name: "Trần Minh Quân", leadsHandled: 172, closed: 58, conversionRate: 33.7 },
  { id: "sp3", name: "Lê Bảo Trân", leadsHandled: 164, closed: 41, conversionRate: 25.0 },
];
