import { useMemo, useState, type FormEvent } from "react";
import { AlertTriangle, Plus, RefreshCw, Target, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { Pagination } from "@/components/shared/Pagination";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FormField, SelectField, TextAreaField, TextField } from "@/components/shared/FormField";
import { cn } from "@/lib/utils";
import { usePagination } from "@/lib/use-pagination";
import { useAuth } from "@/lib/use-auth";
import { canEdit } from "@/data/mockAuth";
import { CSKH, COURSES, LEAD_ROWS } from "@/data/mockAdmin";
import type { LeadRow, LeadStatus } from "@/types/admin";

const STATUS_META: Record<LeadStatus, { label: string; tone: "primary" | "warning" | "success" | "danger" }> = {
  new: { label: "Mới", tone: "primary" },
  "in-progress": { label: "Đang tư vấn", tone: "warning" },
  deposited: { label: "Đã cọc", tone: "success" },
  dropped: { label: "Bỏ cuộc", tone: "danger" },
};

const TABS: { key: LeadStatus | "all"; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "new", label: "Mới" },
  { key: "in-progress", label: "Đang tư vấn" },
  { key: "deposited", label: "Đã cọc" },
  { key: "dropped", label: "Bỏ cuộc" },
];

const EMPTY_FORM = {
  name: "",
  phone: "",
  courseInterest: COURSES[0],
  status: "new" as LeadStatus,
  assignee: CSKH[0],
  note: "",
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatSyncTime(date: Date) {
  return date.toLocaleTimeString("vi-VN", { hour12: false });
}

export function LeadsManagementPage() {
  const { profile } = useAuth();
  const isEditor = profile ? canEdit("leads", profile.role) : false;

  const [leads, setLeads] = useState<LeadRow[]>(LEAD_ROWS);
  const [tab, setTab] = useState<LeadStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesTab = tab === "all" || lead.status === tab;
      const matchesQuery = !q || lead.name.toLowerCase().includes(q) || lead.phone.includes(q);
      const matchesFrom = !fromDate || lead.createdAtISO >= fromDate;
      const matchesTo = !toDate || lead.createdAtISO <= toDate;
      return matchesTab && matchesQuery && matchesFrom && matchesTo;
    });
  }, [leads, tab, query, fromDate, toDate]);

  const { page, totalPages, pageItems, goTo } = usePagination(filtered, 8);

  const overdue = leads.filter((l) => l.status === "new" || l.status === "in-progress").length;
  const deposited = leads.filter((l) => l.status === "deposited").length;
  const conversionRate = ((deposited / leads.length) * 100).toFixed(1);

  function openAddModal() {
    setForm(EMPTY_FORM);
    setFormError(null);
    setIsModalOpen(true);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setFormError("Vui lòng nhập họ tên và số điện thoại.");
      return;
    }
    const newLead: LeadRow = {
      id: `lead-manual-${Date.now()}`,
      name: form.name.trim(),
      phone: form.phone.trim(),
      courseInterest: form.courseInterest,
      source: "Nhập tay - Hotline",
      status: form.status,
      assignee: form.assignee,
      lastContact: "Vừa nhập",
      createdAtISO: todayISO(),
      note: form.note.trim() || undefined,
    };
    setLeads((prev) => [newLead, ...prev]);
    setIsModalOpen(false);
    goTo(1);
  }

  function handleSync() {
    if (isSyncing) return;
    setIsSyncing(true);
    window.setTimeout(() => {
      setIsSyncing(false);
      setLastSyncedAt(formatSyncTime(new Date()));
    }, 1200);
  }

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <PageHeader
        title="Quản lý Leads"
        subtitle="Danh sách toàn bộ lead từ các kênh Marketing và tiến trình xử lý CSKH."
        actions={
          isEditor && (
            <>
              <Button 
  variant="outline" 
  size="sm" 
  onClick={() => {
    handleSync();
    window.open('https://docs.google.com/spreadsheets/d/ID_TRANG_TINH_CUA_BAN/edit', '_blank');
  }}
>
                <RefreshCw className={cn("h-3.5 w-3.5", isSyncing && "animate-spin")} />
                {isSyncing ? "Đang đồng bộ..." : "Đồng bộ Google Sheets"}
              </Button>
              <Button size="sm" onClick={openAddModal}>
                <Plus className="h-3.5 w-3.5" />
                Nhập lead thủ công
              </Button>
            </>
          )
        }
      />

      {lastSyncedAt && (
        <p className="-mt-3 text-[12px] text-[var(--color-text-secondary)]">
          Đồng bộ Google Sheets lần gần nhất lúc <span className="font-medium text-[var(--color-text)]">{lastSyncedAt}</span>
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <KpiCard kpi={{ id: "total", title: "Tổng số Leads", value: String(leads.length), description: "Trong 30 ngày gần nhất", icon: Target, tone: "default" }} />
        <KpiCard kpi={{ id: "pending", title: "Đang chờ xử lý", value: String(overdue), description: "Mới + Đang tư vấn", icon: AlertTriangle, tone: "danger" }} />
        <KpiCard kpi={{ id: "rate", title: "Tỷ lệ chốt", value: `${conversionRate}%`, description: "Lead đã đặt cọc", icon: TrendingUp, tone: "default" }} />
      </div>

      <Card>
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-1 rounded-[var(--radius-control)] bg-gray-100 p-1">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => {
                    setTab(t.key);
                    goTo(1);
                  }}
                  className={cn(
                    "rounded-[6px] px-3 py-1.5 text-[12px] font-medium transition-colors",
                    tab === t.key ? "bg-white text-[var(--color-primary)] shadow-sm" : "text-[var(--color-text-secondary)]",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <SearchInput
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                goTo(1);
              }}
              placeholder="Tìm tên, SĐT..."
              className="w-52"
              aria-label="Tìm lead"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[12px] text-[var(--color-text-secondary)]">
            <span className="font-medium text-[var(--color-text)]">Lọc theo ngày tạo:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                goTo(1);
              }}
              aria-label="Từ ngày"
              className="h-8 rounded-[var(--radius-control)] border border-[var(--color-border)] px-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
            />
            <span>—</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                goTo(1);
              }}
              aria-label="Đến ngày"
              className="h-8 rounded-[var(--radius-control)] border border-[var(--color-border)] px-2 text-[12px] outline-none focus:border-[var(--color-primary)]"
            />
            {(fromDate || toDate) && (
              <button
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                }}
                className="text-[var(--color-primary)] hover:underline"
              >
                Xóa lọc ngày
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[11px] uppercase tracking-wide text-[var(--color-text-secondary)]">
                <th scope="col" className="px-5 py-3 font-semibold">Lead</th>
                <th scope="col" className="px-3 py-3 font-semibold">Khóa học quan tâm</th>
                <th scope="col" className="px-3 py-3 font-semibold">Nguồn</th>
                <th scope="col" className="px-3 py-3 font-semibold">CSKH</th>
                <th scope="col" className="px-3 py-3 font-semibold">Ngày tạo</th>
                <th scope="col" className="px-3 py-3 font-semibold">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((lead) => {
                const meta = STATUS_META[lead.status];
                return (
                  <tr key={lead.id} className="border-b border-[var(--color-border)] text-[13px] last:border-0 hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-[var(--color-text)]">{lead.name}</p>
                      <p className="text-[12px] text-[var(--color-text-secondary)]">{lead.phone}</p>
                    </td>
                    <td className="px-3 py-3 text-[var(--color-text)]">{lead.courseInterest}</td>
                    <td className="px-3 py-3 text-[var(--color-text-secondary)]">{lead.source}</td>
                    <td className="px-3 py-3 text-[var(--color-text)]">{lead.assignee}</td>
                    <td className="px-3 py-3 text-[var(--color-text-secondary)]">
                      {lead.createdAtISO.split("-").reverse().join("/")}
                    </td>
                    <td className="px-3 py-3">
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                    </td>
                  </tr>
                );
              })}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[13px] text-[var(--color-text-secondary)]">
                    Không có lead nào phù hợp bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={totalPages} totalItems={filtered.length} pageSize={8} onPageChange={goTo} />
      </Card>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nhập lead thủ công"
        description="Dùng khi CSKH nhận đăng ký qua cuộc gọi Hotline và cần nhập tay vào hệ thống."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button size="sm" onClick={handleSubmit}>Lưu lead</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {formError && (
            <div className="rounded-[var(--radius-control)] border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-600">
              {formError}
            </div>
          )}
          <FormField label="Họ và tên" required>
            <TextField value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Nguyễn Văn A" />
          </FormField>
          <FormField label="Số điện thoại" required>
            <TextField value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="09xxxxxxxx" />
          </FormField>
          <FormField label="Khóa học quan tâm">
            <SelectField value={form.courseInterest} onChange={(e) => setForm((f) => ({ ...f, courseInterest: e.target.value }))}>
              {COURSES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </SelectField>
          </FormField>
          <FormField label="Trạng thái tư vấn">
            <SelectField value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as LeadStatus }))}>
              <option value="new">Mới</option>
              <option value="in-progress">Đang tư vấn</option>
              <option value="deposited">Đã cọc</option>
              <option value="dropped">Bỏ cuộc</option>
            </SelectField>
          </FormField>
          <FormField label="CSKH phụ trách">
            <SelectField value={form.assignee} onChange={(e) => setForm((f) => ({ ...f, assignee: e.target.value }))}>
              {CSKH.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </SelectField>
          </FormField>
          <FormField label="Ghi chú cuộc gọi">
            <TextAreaField value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} placeholder="Nội dung trao đổi qua Hotline..." />
          </FormField>
        </form>
      </Dialog>
    </div>
  );
}
