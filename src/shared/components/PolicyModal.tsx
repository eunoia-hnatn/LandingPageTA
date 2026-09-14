import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { usePolicyDocument } from "@/shared/hooks/usePolicyDocument";

interface PolicyModalProps {
  open: boolean;
  onClose: () => void;
}

/** Modal Chính sách bảo vệ dữ liệu cá nhân: đóng bằng Esc / nút / backdrop, khoá scroll nền. */
export function PolicyModal({ open, onClose }: PolicyModalProps) {
  const { doc, isFallback } = usePolicyDocument();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={doc.title}
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-hairline,#e2e8f0)] px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-ink,#000)]">{doc.title}</h2>
            <p className="mt-0.5 text-[12px] text-[var(--color-ink-body,#717174)]">
              Phiên bản {doc.version}
              {isFallback && " · nội dung tạm"}
            </p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-lg p-1.5 text-[var(--color-ink-body,#717174)] hover:bg-[var(--color-indigo-wash,#f1f2fc)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="prose prose-sm max-w-none overflow-y-auto px-5 py-4 text-[14px] leading-relaxed text-[var(--color-ink-body,#717174)] [&_h2]:mt-4 [&_h2]:text-[15px] [&_h2]:font-semibold [&_h2]:text-[var(--color-ink,#000)] [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--color-wayfinder-orange,#f68c1f)] [&_blockquote]:pl-3 [&_blockquote]:text-[var(--color-ink,#000)] [&_ul]:list-disc [&_ul]:pl-5">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc.body_md}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
