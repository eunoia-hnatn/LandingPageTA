import { useMemo, useState } from "react";
import { Download, Plus, UserCheck, UserPlus, Users2, UserX } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { Pagination } from "@/components/shared/Pagination";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePagination } from "@/lib/use-pagination";
import { CUSTOMERS, MOCK_NOW } from "@/data/mockAdmin";
import type { Customer, CustomerStatus } from "@/types/admin";

const STATUS_META: Record<CustomerStatus, { label: string; tone: "primary" | "warning" | "success" | "neutral" }> = {
  new: { label: "Mới", tone: "primary" },
  "in-progress": { label: "Đang tư vấn", tone: "warning" },
  won: { label: "Đã chốt", tone: "success" },
  lost: { label: "Không tiềm năng", tone: "neutral" },
};

const STATUS_OPTIONS: { value: CustomerStatus | "all"; label: string }[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "new", label: "Mới" },
  { value: "in-progress", label: "Đang tư vấn" },
  { value: "won", label: "Đã chốt" },
  { value: "lost", label: "Không tiềm năng" },
];

const OVERDUE_HOURS = 2;

function hoursSince(iso: string) {
  return (MOCK_NOW.getTime() - new Date(iso).getTime()) / 3_600_000;
}

function isOverdue(customer: Customer) {
  return customer.status === "new" && hoursSince(customer.createdAtISO) > OVERDUE_HOURS;
}

function formatRegisteredAt(iso: string) {
  const d = new Date(iso);
  const isToday = d.toDateString() === MOCK_NOW.toDateString();
  const isYesterday = new Date(MOCK_NOW.getTime() - 86_400_000).toDateString() === d.toDateString();
  const time = d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false });

  if (isToday) {
    const hrs = hoursSince(iso);
    const agoLabel = hrs < 1 ? `${Math.max(1, Math.round(hrs * 60))} phút trước` : `${hrs.toFixed(1)}h trước`;
    return `${time} - Hôm nay (${agoLabel})`;
  }
  if (isYesterday) return `${time} - Hôm qua`;
  return d.toLocaleDateString("vi-VN");
}

export function CustomersPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | "all">("all");
  const [courseFilter, setCourseFilter] = useState("all");

  const courseOptions = useMemo(() => ["all", ...Array.from(new Set(CUSTOMERS.map((c) => c.courseInterest)))], []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CUSTOMERS.filter((c: Customer) => {
      const matchesQuery =
        !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const matchesCourse = courseFilter === "all" || c.courseInterest === courseFilter;
      return matchesQuery && matchesStatus && matchesCourse;
    });
  }, [query, statusFilter, courseFilter]);

  const { page, totalPages, pageItems, goTo } = usePagination(filtered, 8);

  const total = CUSTOMERS.length;
  const inProgress = CUSTOMERS.filter((c) => c.status === "in-progress").length;
  const newThisWeek = CUSTOMERS.filter((c) => c.status === "new").length;

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <PageHeader
        title="Danh sách khách hàng"
        subtitle="Dữ liệu đổ về từ Google Sheets Landing Page. Lead quá 2 giờ chưa gọi sẽ có viền đỏ cảnh báo."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="h-3.5 w-3.5" />
              Xuất Excel
            </Button>
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" />
              Thêm khách hàng
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard kpi={{ id: "total", title: "Tổng khách hàng", value: String(total), description: "Toàn bộ hệ thống", icon: Users2, tone: "default" }} />
        <KpiCard kpi={{ id: "new", title: "Mới chưa liên hệ", value: String(newThisWeek), description: "Cần CSKH tiếp cận", icon: UserPlus, tone: "default" }} />
        <KpiCard kpi={{ id: "in-progress", title: "Đang chăm sóc", value: String(inProgress), description: "Đang trong phễu tư vấn", icon: UserCheck, tone: "default" }} />
        <KpiCard kpi={{ id: "lost", title: "Không tiềm năng", value: String(CUSTOMERS.filter((c) => c.status === "lost").length), description: "Không phản hồi / từ chối", icon: UserX, tone: "danger" }} />
      </div>

      <Card className="flex flex-col">
        <div className="flex flex-col gap-3 border-b border-[var(--color-border)] p-5 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              goTo(1);
            }}
            placeholder="Tìm theo tên, SĐT, email..."
            className="w-full lg:w-64"
            aria-label="Tìm khách hàng"
          />
          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as CustomerStatus | "all");
                goTo(1);
              }}
              aria-label="Lọc theo trạng thái"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </FilterSelect>
            <FilterSelect
              value={courseFilter}
              onChange={(e) => {
                setCourseFilter(e.target.value);
                goTo(1);
              }}
              aria-label="Lọc theo khóa học"
            >
              <option value="all">Tất cả khóa học</option>
              {courseOptions.filter((c) => c !== "all").map((course) => (
                <option key={course} value={course}>{course}</option>
              ))}
            </FilterSelect>
            <span className="whitespace-nowrap rounded-[var(--radius-control)] border border-[var(--color-border)] px-3 py-2 text-[12px] text-[var(--color-text-secondary)]">
              Thống kê: <span className="font-semibold text-[var(--color-text)]">{filtered.length}</span> leads
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[11px] uppercase tracking-wide text-[var(--color-text-secondary)]">
                <th scope="col" className="px-5 py-3 font-semibold">Họ &amp; Tên Lead</th>
                <th scope="col" className="px-3 py-3 font-semibold">Số Điện Thoại</th>
                <th scope="col" className="px-3 py-3 font-semibold">Email</th>
                <th scope="col" className="px-3 py-3 font-semibold">Khóa Quan Tâm</th>
                <th scope="col" className="px-3 py-3 font-semibold">Trạng Thái</th>
                <th scope="col" className="px-3 py-3 font-semibold">Người Phụ Trách</th>
                <th scope="col" className="px-3 py-3 font-semibold">Thời Gian Đăng Ký</th>
                <th scope="col" className="px-3 py-3 text-right font-semibold">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((customer) => {
                const meta = STATUS_META[customer.status];
                const overdue = isOverdue(customer);
                return (
                  <tr
                    key={customer.id}
                    className={cn(
                      "border-b border-[var(--color-border)] text-[13px] last:border-0 hover:bg-gray-50",
                      overdue && "border-l-2 border-l-red-500 bg-red-50/30",
                    )}
                  >
                    <td className="px-5 py-3 font-medium text-[var(--color-text)]">{customer.name}</td>
                    <td className="px-3 py-3 text-[var(--color-text)]">{customer.phone}</td>
                    <td className="px-3 py-3 text-[var(--color-text-secondary)]">{customer.email}</td>
                    <td className="px-3 py-3 text-[var(--color-text)]">{customer.courseInterest}</td>
                    <td className="px-3 py-3">
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                    </td>
                    <td className="px-3 py-3 text-[var(--color-text)]">{customer.assignee}</td>
                    <td className={cn("px-3 py-3", overdue ? "font-medium text-red-600" : "text-[var(--color-text-secondary)]")}>
                      {formatRegisteredAt(customer.createdAtISO)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Button variant="outline" size="sm">Chi tiết</Button>
                    </td>
                  </tr>
                );
              })}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-[13px] text-[var(--color-text-secondary)]">
                    Không tìm thấy khách hàng phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={totalPages} totalItems={filtered.length} pageSize={8} onPageChange={goTo} />
      </Card>
    </div>
  );
}
