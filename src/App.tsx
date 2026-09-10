import { useMemo, useState, type ComponentType } from "react";
import { useAuth } from "@/lib/use-auth";
import { canAccessSection, ROLE_HOME } from "@/shared/lib/permissions";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { ForbiddenView } from "@/shared/components/ForbiddenView";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LoginPage } from "@/pages/LoginPage";
import { Dashboard } from "@/pages/Dashboard";
import { ContentLandingPage } from "@/pages/ContentLandingPage";
import { CustomersPage } from "@/pages/CustomersPage";
import { StaffPage } from "@/pages/StaffPage";
import { CoursesPage } from "@/pages/CoursesPage";
import { LeadsManagementPage } from "@/pages/LeadsManagementPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { AccountsPage } from "@/pages/AccountsPage";
import { NAV_ITEMS } from "@/data/mockDashboard";

const PAGES: Record<string, ComponentType> = {
  overview: Dashboard,
  content: ContentLandingPage,
  customers: CustomersPage,
  staff: StaffPage,
  courses: CoursesPage,
  leads: LeadsManagementPage,
  reports: ReportsPage,
  accounts: AccountsPage,
};

function AdminShell() {
  const { profile } = useAuth();
  const [activeId, setActiveId] = useState<string | null>(null);

  const visibleNavItems = useMemo(() => {
    if (!profile) return [];
    return NAV_ITEMS.filter((item) => canAccessSection(profile.role, item.id));
  }, [profile]);

  if (!profile) return null; // ProtectedRoute lo phần loading/anon

  const homeId = ROLE_HOME[profile.role] ?? visibleNavItems[0]?.id ?? "overview";
  const currentId = activeId ?? homeId;
  const allowed = canAccessSection(profile.role, currentId);
  const activeItem = visibleNavItems.find((item) => item.id === currentId);
  const ActivePage = allowed ? PAGES[currentId] ?? Dashboard : null;

  return (
    <DashboardLayout
      navItems={visibleNavItems}
      activeId={allowed ? currentId : ""}
      onSelect={setActiveId}
      breadcrumb={[
        "Tổng quan",
        currentId === "overview" ? "Dashboard Thống kê" : activeItem?.label ?? "",
      ]}
    >
      {ActivePage ? (
        <ActivePage />
      ) : (
        <ForbiddenView actionLabel="Về trang chính" onAction={() => setActiveId(homeId)} />
      )}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <ProtectedRoute fallback={<LoginPage />}>
      <AdminShell />
    </ProtectedRoute>
  );
}
