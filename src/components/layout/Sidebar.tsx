import { ChevronsLeft, ChevronsRight, X } from "lucide-react";
import type { NavItem } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import logoUrl from "../../../HUYWAY_Logo.svg";

interface SidebarProps {
  items: NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({
  items,
  activeId,
  onSelect,
  isMobileOpen,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <>
      {/* Mobile scrim */}
      {isMobileOpen && (
        <button
          aria-label="Đóng menu"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-gray-900/40 lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[var(--color-border)] bg-white transition-transform duration-200 ease-out lg:translate-x-0",
          isCollapsed ? "lg:w-[76px]" : "lg:w-[200px]",
          "w-[260px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-[var(--color-border)] px-4">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img src={logoUrl} alt="HuyWay" className={cn("h-9 w-auto shrink-0 object-contain", isCollapsed ? "max-w-9" : "max-w-[116px]")} />
            {!isCollapsed && (
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[13px] font-bold tracking-tight text-[var(--color-text)]">
                  HUYWAY ENGLISH
                </p>
                <p className="truncate text-[11px] text-[var(--color-text-secondary)]">
                  Internal Admin System
                </p>
              </div>
            )}
          </div>
          <button
            aria-label="Đóng menu"
            onClick={onCloseMobile}
            className="rounded-md p-1 text-[var(--color-text-secondary)] hover:bg-gray-100 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto scrollbar-none px-3 py-4">
          {!isCollapsed && (
            <p className="px-2 pb-2 text-[11px] font-semibold tracking-wider text-[var(--color-text-secondary)]">
              MENU QUẢN TRỊ
            </p>
          )}
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeId;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onSelect(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-[var(--radius-control)] px-2.5 py-2 text-[13px] font-medium transition-colors",
                      isCollapsed && "justify-center",
                      isActive
                        ? "bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]"
                        : "text-gray-600 hover:bg-gray-100 hover:text-[var(--color-text)]",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0",
                        isActive ? "text-[var(--color-primary)]" : "text-gray-400 group-hover:text-gray-600",
                      )}
                    />
                    {!isCollapsed && <span className="whitespace-normal text-left leading-snug">{item.label}</span>}
                    {!isCollapsed && item.badge && (
                      <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer status */}
        <div className="shrink-0 border-t border-[var(--color-border)] p-3">
          <div
            className={cn(
              "flex items-center gap-2 rounded-[var(--radius-control)] bg-gray-50 px-2.5 py-2",
              isCollapsed && "justify-center",
            )}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {!isCollapsed && (
              <div className="min-w-0 leading-tight">
                <span className="whitespace-normal text-[13px] font-semibold text-[var(--color-text)]">
                  Google Sheets API Active
                </span>
                <span className="whitespace-normal text-[12px] text-[var(--color-text-secondary)]">
                  Tự động đồng bộ mỗi 5 phút
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="mt-2 hidden w-full items-center justify-center gap-1.5 rounded-[var(--radius-control)] py-1.5 text-[11px] font-medium text-[var(--color-text-secondary)] hover:bg-gray-100 lg:flex"
          >
            {isCollapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronsLeft className="h-4 w-4" />
                Thu gọn
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
