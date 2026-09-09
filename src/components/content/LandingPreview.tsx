import { Image as ImageIcon } from "lucide-react";
import type { FormBlock, LandingBlock, ListBlock } from "@/data/mockContent";

function HeroPreview({ block }: { block: FormBlock }) {
  const { values, image } = block;
  return (
    <div className="flex flex-col gap-4">
      {values.promoBadge && (
        <span className="inline-block w-fit rounded-full bg-amber-400 px-3 py-1 text-[11px] font-semibold text-amber-950">
          {values.promoBadge}
        </span>
      )}
      <h3 className="text-[20px] font-bold leading-snug text-white">{values.headline || "Tiêu đề chính..."}</h3>
      <p className="text-[13px] leading-relaxed text-gray-300">{values.subheadline || "Mô tả phụ..."}</p>
      <div className="flex aspect-[3/2] items-center justify-center overflow-hidden rounded-lg bg-gray-800">
        {image?.url ? (
          <img src={image.url} alt={values.headline} className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-gray-500">
            <ImageIcon className="h-6 w-6" />
            <span className="text-[11px]">Preview Slot Image</span>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <span className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-[13px] font-semibold text-white">
          {values.ctaText || "Nút CTA"}
        </span>
        <span className="text-[12px] font-medium text-blue-300 underline underline-offset-2">Xem lịch khai giảng →</span>
      </div>
    </div>
  );
}

function GenericFormPreview({ block }: { block: FormBlock }) {
  return (
    <div className="flex flex-col gap-3.5">
      {block.fields.map((field) => (
        <div key={field.key}>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{field.label}</p>
          <p className="mt-0.5 text-[14px] font-medium text-white">{block.values[field.key] || "—"}</p>
        </div>
      ))}
    </div>
  );
}

function GenericListPreview({ block }: { block: ListBlock }) {
  const [primaryKey, secondaryKey] = block.fields.map((f) => f.key);
  return (
    <div className="flex max-h-[380px] flex-col gap-2 overflow-y-auto pr-1">
      {block.items.map((item, index) => (
        <div key={index} className="rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="text-[13px] font-semibold text-white">{item[primaryKey] || `Mục ${index + 1}`}</p>
          {secondaryKey && item[secondaryKey] && (
            <p className="mt-1 line-clamp-2 text-[12px] text-gray-400">{item[secondaryKey]}</p>
          )}
        </div>
      ))}
      {block.items.length === 0 && (
        <p className="py-6 text-center text-[12px] text-gray-500">Chưa có nội dung nào.</p>
      )}
    </div>
  );
}

export function LandingPreview({ block }: { block: LandingBlock }) {
  if (block.kind === "form" && block.id === "hero") return <HeroPreview block={block} />;
  if (block.kind === "form") return <GenericFormPreview block={block} />;
  return <GenericListPreview block={block} />;
}
