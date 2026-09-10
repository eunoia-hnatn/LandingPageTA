import { ImagePlus, Trash2 } from "lucide-react";
import type { ChangeEvent } from "react";
import type { ImageAsset } from "@/data/mockContent";

interface ImageSlotManagerProps {
  image: ImageAsset | null | undefined;
  disabled?: boolean;
  onChange: (image: ImageAsset) => void;
  onRemove: () => void;
}

export function ImageSlotManager({ image, disabled = false, onChange, onRemove }: ImageSlotManagerProps) {
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    onChange({
      url: URL.createObjectURL(file),
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });
    event.target.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[12px] font-medium text-[var(--color-text)]">Hình ảnh</span>
      {image ? (
        <div className="flex items-center gap-3 rounded-[var(--radius-control)] border border-[var(--color-border)] p-2">
          <img src={image.url} alt={image.fileName} className="h-16 w-24 rounded object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-medium text-[var(--color-text)]">{image.fileName}</p>
            <p className="text-[11px] text-[var(--color-text-secondary)]">{Math.max(1, Math.round(image.fileSize / 1024))} KB</p>
          </div>
          <button
            type="button"
            aria-label="Xóa hình ảnh"
            disabled={disabled}
            onClick={onRemove}
            className="rounded p-1.5 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-control)] border border-dashed border-[var(--color-border)] px-4 py-6 text-[12px] text-[var(--color-text-secondary)] hover:bg-gray-50 has-[:disabled]:cursor-not-allowed">
          <ImagePlus className="h-4 w-4" />
          Chọn hình ảnh
          <input type="file" accept="image/*" disabled={disabled} onChange={handleFileChange} className="sr-only" />
        </label>
      )}
    </div>
  );
}