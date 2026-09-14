import { useState } from "react";
import { Check, Minus, Pencil, ShieldCheck, Wallet, X } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { NAV_PERMISSIONS } from "@/data/mockAuth";
import { CHANNEL_BUDGETS } from "@/data/mockAdmin";
import type { PermissionLevel } from "@/types/admin";

function formatVnd(amount: number) {
  return (amount / 1_000_000).toFixed(1).replace(/\.0$/, "") + "tr";
}

const PERMISSION_META: Record<PermissionLevel, { icon: typeof Check; className: string; label: string }> = {
  full: { icon: Check, className: "bg-emerald-100 text-emerald-600", label: "Toàn quyền" },
  edit: { icon: Pencil, className: "bg-blue-100 text-blue-600", label: "Chỉnh sửa" },
  view: { icon: Minus, className: "bg-amber-100 text-amber-600", label: "Chỉ xem" },
  none: { icon: X, className: "bg-gray-100 text-gray-400", label: "Không có quyền" },
};

function PermissionCell({ level }: { level: PermissionLevel }) {
  const meta = PERMISSION_META[level];
  const Icon = meta.icon;
  return (
    <span title={meta.label} className={cn("mx-auto flex h-7 w-7 items-center justify-center rounded-full", meta.className)}>
      <Icon className="h-3.5 w-3.5" />
    </span>
  );
}

export function BudgetPermissionsPage() {
  const [tab, setTab] = useState<"budget" | "permissions">("budget");

  const totalBudget = CHANNEL_BUDGETS.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = CHANNEL_BUDGETS.reduce((sum, c) => sum + c.spent, 0);
  const remaining = totalBudget - totalSpent;
  const usageRate = Math.round((totalSpent / totalBudget) * 100);

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <PageHeader
        title="Quản lý Ngân sách & Quyền"
        subtitle="Theo dõi ngân sách Marketing và ma trận phân quyền theo vai trò. Quản lý tài khoản đăng nhập ở mục “Quản lý tài khoản”."
      />

      <div className="flex w-fit flex-wrap rounded-[var(--radius-control)] bg-gray-100 p-1">
        {(
          [
            { key: "budget", label: "Ngân sách Marketing", icon: Wallet },
            { key: "permissions", label: "Phân quyền", icon: ShieldCheck },
          ] as const
        ).map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-[6px] px-3.5 py-1.5 text-[13px] font-medium transition-colors",
              tab === item.key ? "bg-white text-[var(--color-primary)] shadow-sm" : "text-[var(--color-text-secondary)]",
            )}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </button>
        ))}
      </div>

      {tab === "budget" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <KpiCard kpi={{ id: "budget", title: "Tổng ngân sách", value: formatVnd(totalBudget), description: "Phân bổ tháng này", icon: Wallet, tone: "default" }} />
            <KpiCard kpi={{ id: "spent", title: "Đã chi tiêu", value: formatVnd(totalSpent), description: `${usageRate}% ngân sách`, icon: Wallet, tone: "default" }} />
            <KpiCard kpi={{ id: "remaining", title: "Còn lại", value: formatVnd(remaining), description: "Có thể phân bổ thêm", icon: Wallet, tone: remaining < totalBudget * 0.15 ? "danger" : "default" }} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ngân sách theo kênh Marketing</CardTitle>
              <CardDescription>Theo dõi mức chi tiêu thực tế so với ngân sách được duyệt</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {CHANNEL_BUDGETS.map((channel) => {
                const pct = Math.round((channel.spent / channel.budget) * 100);
                const isOver = pct >= 90;
                return (
                  <div key={channel.id}>
                    <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-[13px] font-medium text-[var(--color-text)]">{channel.channel}</p>
                      <p className="text-[13px] font-semibold text-[var(--color-text)]">
                        {formatVnd(channel.spent)} / {formatVnd(channel.budget)}{" "}
                        <span className={cn(isOver ? "text-red-500" : "text-[var(--color-text-secondary)]")}>({pct}%)</span>
                      </p>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={cn("h-full rounded-full transition-[width] duration-500", isOver ? "bg-red-500" : "bg-[var(--color-primary)]")}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "permissions" && (
        <Card>
          <CardHeader>
            <CardTitle>Ma trận phân quyền theo vai trò</CardTitle>
            <CardDescription>Quyền truy cập từng module theo 3 cấp vai trò trong hệ thống</CardDescription>
          </CardHeader>
          <div className="overflow-x-auto p-5 pt-4">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[11px] uppercase tracking-wide text-[var(--color-text-secondary)]">
                  <th scope="col" className="pb-2 font-semibold">Module</th>
                  <th scope="col" className="pb-2 text-center font-semibold">Super Admin</th>
                  <th scope="col" className="pb-2 text-center font-semibold">Marketing</th>
                  <th scope="col" className="pb-2 text-center font-semibold">CSKH</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(NAV_PERMISSIONS).map(([id, entry]) => (
                  <tr key={id} className="border-b border-[var(--color-border)] text-[13px] last:border-0 hover:bg-gray-50">
                    <td className="py-3 font-medium text-[var(--color-text)]">{entry.label}</td>
                    <td className="py-3 text-center"><PermissionCell level={entry.superAdmin} /></td>
                    <td className="py-3 text-center"><PermissionCell level={entry.marketing} /></td>
                    <td className="py-3 text-center"><PermissionCell level={entry.cskh} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap gap-4 border-t border-[var(--color-border)] px-5 py-3 text-[12px] text-[var(--color-text-secondary)]">
            {(Object.keys(PERMISSION_META) as PermissionLevel[]).map((level) => (
              <div key={level} className="flex items-center gap-1.5">
                <PermissionCell level={level} />
                {PERMISSION_META[level].label}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
