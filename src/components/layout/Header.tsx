import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, Menu, RefreshCw, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROLE_LABEL } from "@/shared/lib/permissions";
import { useAuth } from "@/lib/use-auth";

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  breadcrumb: [string, string];
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("vi-VN", { hour12: false });
}

function initials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0]?.[0] ?? "").concat(parts[parts.length - 1]?.[0] ?? "").toUpperCase();
}

export function Header({ onOpenMobileSidebar, breadcrumb }: HeaderProps) {
  // 1. Auth và biến mới của team
  const { profile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const roleLabel = profile ? ROLE_LABEL[profile.role] : "";
  const displayName = profile?.full_name || profile?.email || "";

  // 2. Logic tính năng Sync của bạn
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(() => formatTime(new Date()));
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Nếu click ra ngoài khu vực được gắn dropdownRef thì tắt menu
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSync() {
    if (isSyncing) return;
    setIsSyncing(true);
    window.setTimeout(() => {
      setIsSyncing(false);
      setLastSyncedAt(formatTime(new Date()));
    }, 1400);
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-[var(--color-border)] bg-white/90 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button
          aria-label="Mở menu"
          onClick={onOpenMobileSidebar}
          className="rounded-md p-1.5 text-[var(--color-text-secondary)] hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex min-w-0 items-center gap-2">
          <Badge tone="violet" className="hidden sm:inline-flex">
            Role: {roleLabel}
          </Badge>
          <span className="hidden truncate text-[13px] text-[var(--color-text-secondary)] sm:inline">
            {breadcrumb[0]}
          </span>
          <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-gray-300 sm:inline" />
          <h1 className="truncate text-[17px] font-bold text-[var(--color-text)] sm:text-[20px]">
            {breadcrumb[1]}
          </h1>
          {roleLabel && (
            <Badge tone="violet" className="hidden sm:inline-flex">
              Role: {roleLabel}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <a 
  href="https://docs.google.com/spreadsheets/d/ID_TRANG_TINH_CUA_BAN/edit" 
  target="_blank" 
  rel="noopener noreferrer"
  className="hidden sm:flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[12px] font-medium text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
>
  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
  Đã đồng bộ Google Sheets
  <span className="text-emerald-500">({lastSyncedAt})</span>
</a>
        <Button variant="outline" size="sm" onClick={handleSync} aria-label="Đồng bộ thủ công">
          <RefreshCw className={cn("h-3.5 w-3.5", isSyncing && "animate-spin")} />
          <span className="hidden sm:inline">{isSyncing ? "Đang đồng bộ..." : "Đồng bộ thủ công"}</span>
        </Button>

        <div ref={dropdownRef} className="relative border-l border-[var(--color-border)] pl-2 sm:pl-3">
        <div className="relative border-l border-[var(--color-border)] pl-2 sm:pl-3">
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            className="flex items-center gap-2 rounded-[var(--radius-control)] py-1 pl-1 pr-1.5 hover:bg-gray-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[12px] font-semibold text-[var(--color-primary-dark)]">
              {displayName ? initials(displayName) : "?"}
            </div>
            <div className="hidden text-left leading-tight sm:block">
              <p className="text-[13px] font-semibold text-[var(--color-text)]">{displayName}</p>
              <p className="text-[11px] text-[var(--color-text-secondary)]">{roleLabel}</p>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-gray-400 sm:block" />
          </button>

          {isMenuOpen && (
            <>
              <div className="absolute right-0 z-20 mt-2 w-48 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-1.5 shadow-lg">
                <div className="px-2.5 py-1.5 sm:hidden">
                  <p className="text-[13px] font-semibold text-[var(--color-text)]">{displayName}</p>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">{roleLabel}</p>
                </div>
                <button
                  onClick={() => void signOut()}
                  className="flex w-full items-center gap-2 rounded-[var(--radius-control)] px-2.5 py-2 text-left text-[13px] text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Đăng xuất
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
