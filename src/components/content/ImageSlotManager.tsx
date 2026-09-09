import { useRef } from "react";
import { Image as ImageIcon } from "lucide-react";
import type { ImageAsset } from "@/data/mockContent";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface ImageSlotManagerProps {
  image: ImageAsset | null | undefined;
  disabled?: boolean;
  onChange: (image: ImageAsset) => void;
  onRemove: () => void;
}

export function ImageSlotManager({ image, disabled, onChange, onRemove }: ImageSlotManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handlePick(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    onChange({ url: URL.createObjectURL(file), fileName: file.name, fileSize: file.size, fileType: file.type });
    event.target.value = "";
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-text)]">
          <ImageIcon className="h-3.5 w-3.5 text-[var(--color-primary)]" />
          Quản Lý Hình Ảnh Section (Slot 1)
        </p>
        <span className="text-[11px] font-medium text-[var(--color-primary)]">Gợi ý: 1200 x 800 px</span>
      </div>
      <div className="flex items-center gap-3 rounded-[var(--radius-control)] border border-[var(--color-border)] p-3">
        <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100">
          {image?.url ? (
            <img src={image.url} alt={image.fileName} className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-5 w-5 text-gray-300" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-[var(--color-text)]">
            {image?.fileName ?? "Chưa có ảnh — dùng ảnh mặc định"}
          </p>
          {image && (
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              {formatBytes(image.fileSize)} · {image.fileType || "image"}
            </p>
          )}
        </div>
        {!disabled && (
          <div className="flex shrink-0 gap-3">
            <button type="button" onClick={() => inputRef.current?.click()} className="text-[12px] font-medium text-[var(--color-primary)] hover:underline">
              Thay ảnh mới
            </button>
            {image && (
              <button type="button" onClick={onRemove} className="text-[12px] font-medium text-red-500 hover:underline">
                Xóa ảnh
              </button>
            )}
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handlePick} />
    </div>
  );
}
