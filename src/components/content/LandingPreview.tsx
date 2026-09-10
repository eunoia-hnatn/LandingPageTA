import type { LandingBlock } from "@/data/mockContent";

export function LandingPreview({ block }: { block: LandingBlock }) {
  if (block.kind === "form") {
    return (
      <section className="flex flex-col gap-4 text-white">
        {block.image && <img src={block.image.url} alt="" className="h-36 w-full rounded-lg object-cover" />}
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">{block.name}</p>
          <h4 className="text-xl font-bold leading-tight">{block.values.headline ?? block.values.title ?? block.name}</h4>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{block.values.subheadline ?? block.values.body ?? block.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {block.values.ctaText && <span className="rounded-md bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-950">{block.values.ctaText}</span>}
          {block.values.highlight && <span className="rounded-md border border-slate-600 px-3 py-2 text-xs text-slate-200">{block.values.highlight}</span>}
        </div>
      </section>
    );
  }

  return (
    <section className="text-white">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">{block.name}</p>
      <p className="mb-4 text-sm text-slate-300">{block.description}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {block.items.map((item, index) => {
          const values = Object.values(item);
          return (
            <div key={index} className="rounded-lg border border-slate-700 bg-slate-900/70 p-3">
              <p className="text-sm font-semibold">{values[0] ?? `Mục ${index + 1}`}</p>
              {values[1] && <p className="mt-1 text-xs leading-relaxed text-slate-400">{values[1]}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}