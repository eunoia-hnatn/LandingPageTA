import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, Sparkles } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { LeadsChart } from "@/components/dashboard/LeadsChart";
import { LeadDistributionChart } from "@/components/dashboard/LeadDistributionChart";
import { CourseInterest } from "@/components/dashboard/CourseInterest";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getDashboardData } from "@/data/mockDashboard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { DateRangeKey, LeadsByDayPoint } from "@/types/dashboard";

const DATE_FILTERS: { key: DateRangeKey; label: string }[] = [
  { key: "today", label: "Hôm nay" },
  { key: "7d", label: "7 ngày" },
  { key: "custom", label: "Tùy chỉnh" },
];

function KpiSkeleton() {
  return (
    <Card className="flex h-[148px] animate-pulse flex-col gap-3 p-5">
      <div className="h-3 w-24 rounded bg-gray-100" />
      <div className="h-7 w-16 rounded bg-gray-100" />
      <div className="h-3 w-32 rounded bg-gray-100" />
    </Card>
  );
}

function ChartSkeleton({ className }: { className?: string }) {
  return <Card className={cn("h-[320px] animate-pulse", className)} />;
}

type RealLeadPoint = LeadsByDayPoint & { dateStr: string };

// Hàm xử lý dữ liệu Leads thực tế cho 7 ngày qua
const processLast7DaysLeads = (allLeads: any[]): RealLeadPoint[] => {
  const chartData: RealLeadPoint[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    let dayName = d.toLocaleDateString('vi-VN', { weekday: 'short' });
    if (dayName.toLowerCase() === 'th 2') dayName = 'T2';
    if (dayName.toLowerCase() === 'th 3') dayName = 'T3';
    if (dayName.toLowerCase() === 'th 4') dayName = 'T4';
    if (dayName.toLowerCase() === 'th 5') dayName = 'T5';
    if (dayName.toLowerCase() === 'th 6') dayName = 'T6';
    if (dayName.toLowerCase() === 'th 7') dayName = 'T7';
    if (dayName.toLowerCase() === 'cn') dayName = 'CN';
    
    chartData.push({
      dateStr: d.toDateString(),
      day: dayName,
      leads: 0,
    });
  }

  allLeads.forEach(lead => {
    if (!lead.created_at) return;
    const leadDateStr = new Date(lead.created_at).toDateString();
    const targetDay = chartData.find(d => d.dateStr === leadDateStr);
    if (targetDay) {
      targetDay.leads += 1;
    }
  });

  return chartData;
};

export function Dashboard() {
  const [range, setRange] = useState<DateRangeKey>("7d");
  const [chartRange, setChartRange] = useState<"7d" | "30d">("7d");
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimeout = useRef<number | undefined>(undefined);

  // Khai báo state lưu Leads thật
  const [realLeads, setRealLeads] = useState<any[]>([]);

  // Kéo dữ liệu từ Supabase khi mở trang
  useEffect(() => {
    const fetchLeads = async () => {
      // Nhớ import supabase ở đầu file nhé!
      const { data, error } = await supabase.from("leads").select("*");
      if (error) {
        console.error("Không thể tải dữ liệu leads:", error);
        return;
      }
      if (data) setRealLeads(data);
    };
    fetchLeads();
  }, []);

  // Tính toán ra data nạp vào biểu đồ
  const realChartData = processLast7DaysLeads(realLeads);

  function handleRangeChange(next: DateRangeKey) {
    setRange(next);
    setIsLoading(true);
    window.clearTimeout(loadingTimeout.current);
    loadingTimeout.current = window.setTimeout(() => setIsLoading(false), 420);
  }

  const dataset = useMemo(() => getDashboardData(range), [range]);
  const chartData = chartRange === "7d" ? realChartData : getDashboardData("30d").leadsByDay;

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      {/* Role info banner */}
      <div className="flex items-start gap-2.5 rounded-[var(--radius-card)] border border-[var(--color-primary)]/15 bg-[var(--color-primary-light)] px-4 py-3">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" />
        <p className="text-[13px] leading-relaxed text-[var(--color-primary-dark)]">
          <span className="font-semibold">Giao diện Dashboard Super Admin:</span> Hiển thị đầy
          đủ số liệu Marketing, Tư vấn CSKH và đồng bộ landing page.
        </p>
      </div>

      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-[20px] font-bold text-[var(--color-text)] sm:text-[22px]">
            Dashboard Thống Kê
          </h2>
          <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
            Theo dõi hiệu quả Marketing, Tư vấn CSKH và đồng bộ dữ liệu.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-1.5 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-white p-1">
          <Calendar className="ml-1.5 h-3.5 w-3.5 text-gray-400" />
          {DATE_FILTERS.map((filter) => (
            <button
              key={filter.key}
              onClick={() => handleRangeChange(filter.key)}
              className={cn(
                "rounded-[6px] px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                range === filter.key
                  ? "bg-[var(--color-primary)] text-white shadow-sm"
                  : "text-[var(--color-text-secondary)] hover:bg-gray-100",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
          : dataset.kpis.map((kpi) => <KpiCard key={kpi.id} kpi={kpi} />)}
      </div>

      {/* Charts row: 2/3 + 1/3 */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <LeadsChart
              data={chartData}
              range={chartRange}
              onRangeChange={setChartRange}
            />
          )}
        </div>
        <div>{isLoading ? <ChartSkeleton /> : <LeadDistributionChart data={dataset.leadStatus} />}</div>
      </div>

      {/* Bottom row: 1/2 + 1/2 */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {isLoading ? (
          <>
            <ChartSkeleton className="h-[420px]" />
            <ChartSkeleton className="h-[420px]" />
          </>
        ) : (
          <>
            {/* CỘT TRÁI: Khóa học quan tâm nhất */}
            <CourseInterest courses={dataset.courses} />
            
            {/* CỘT PHẢI: Khôi phục dữ liệu */}
            <Card className="flex flex-col justify-between p-8 h-full min-h-[320px] border-amber-200 bg-amber-50/40 shadow-sm">
              <div>
                <h3 className="text-[17px] font-bold text-amber-900 mb-3">
                  Khôi phục dữ liệu hệ thống
                </h3>
                <p className="text-[14px] text-amber-700/80 mb-6 leading-relaxed text-justify">
                  Tính năng này cho phép bạn hoàn tác toàn bộ thay đổi và khôi phục nội dung Landing Page cũng như thiết lập hệ thống về bản sao lưu tự động gần nhất cách đây 24 giờ. Phù hợp để xử lý rủi ro khi nhập liệu sai.
                </p>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full bg-white border-amber-400 text-amber-700 hover:bg-amber-100 hover:text-amber-900 transition-colors font-semibold h-12 text-[14px]"
                onClick={() => {
                  if(window.confirm("CẢNH BÁO: Bạn có chắc chắn muốn khôi phục nội dung về 24 giờ trước? Thao tác này sẽ ghi đè toàn bộ dữ liệu hiện tại.")) {
                    alert("Đã gửi yêu cầu khôi phục!");
                  }
                }}
              >
                Khôi phục toàn bộ nội dung (24h trước)
              </Button>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
