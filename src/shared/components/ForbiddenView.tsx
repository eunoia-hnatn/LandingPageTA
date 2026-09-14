import { ShieldAlert } from "lucide-react";

interface ForbiddenViewProps {
  /** Nhãn nút quay về (mặc định: về trang được phép). */
  actionLabel?: string;
  onAction?: () => void;
  message?: string;
}

/** Màn 403 dùng chung khi vai trò không đủ quyền vào một khu vực. */
export function ForbiddenView({ actionLabel = "Về trang chính", onAction, message }: ForbiddenViewProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
        <ShieldAlert className="h-7 w-7" />
      </div>
      <h1 className="text-[18px] font-semibold text-[var(--color-text,#000)]">Không có quyền truy cập</h1>
      <p className="max-w-sm text-[13px] text-[var(--color-text-secondary,#717174)]">
        {message ?? "Vai trò của bạn không được phép mở khu vực này. Nếu cho rằng đây là nhầm lẫn, hãy liên hệ Super Admin."}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="mt-2 rounded-[var(--radius-control,8px)] bg-[var(--color-primary,#2C3481)] px-4 py-2 text-[13px] font-semibold text-white"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
