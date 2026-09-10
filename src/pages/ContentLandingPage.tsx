import { useMemo, useState } from "react";
import { Clock, ExternalLink, Lock, Pencil, Plus, Save, Trash2, Undo2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FormField, TextField, TextAreaField } from "@/components/shared/FormField";
import { ImageSlotManager } from "@/components/content/ImageSlotManager";
import { LandingPreview } from "@/components/content/LandingPreview";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/use-auth";
import { canEdit } from "@/data/mockAuth";
import { BLOCK_PREVIEW_LABEL, INITIAL_LANDING_BLOCKS, type FieldSchema, type LandingBlock } from "@/data/mockContent";
import { supabase } from "@/lib/supabase";

interface VersionEntry {
  id: string;
  blockId: string;
  blockName: string;
  action: "draft" | "publish";
  savedBy: string;
  savedAt: string;
  snapshot: LandingBlock;
}

function groupFieldsIntoRows(fields: FieldSchema[]) {
  const rows: FieldSchema[][] = [];
  const rowIndexByKey = new Map<string, number>();
  for (const field of fields) {
    if (field.row) {
      const existingIndex = rowIndexByKey.get(field.row);
      if (existingIndex !== undefined) {
        rows[existingIndex].push(field);
        continue;
      }
      rowIndexByKey.set(field.row, rows.length);
      rows.push([field]);
    } else {
      rows.push([field]);
    }
  }
  return rows;
}

export function ContentLandingPage() {
  const { currentUser } = useAuth(); //fix error 
  const isEditor = currentUser ? canEdit("content", currentUser.role) : false;

  const [blocks, setBlocks] = useState<LandingBlock[]>(INITIAL_LANDING_BLOCKS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<LandingBlock | null>(null);
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const savedSelected = blocks.find((b) => b.id === selectedId) ?? null;
  const isDirty = draft && savedSelected ? JSON.stringify(draft) !== JSON.stringify(savedSelected) : false;

  const publishedCount = blocks.filter((b) => b.status === "published").length;

  function openEditor(block: LandingBlock) {
    setSelectedId(block.id);
    setDraft(structuredClone(block));
  }

  function closeEditor() {
    setSelectedId(null);
    setDraft(null);
  }

  function commitSave(status: "draft" | "published") {
    if (!draft) return;
    const finalBlock: LandingBlock = {
      ...draft,
      status,
      updatedAt: "Vừa xong",
      updatedBy: currentUser?.name ?? draft.updatedBy,
    };
    setBlocks((prev) => prev.map((b) => (b.id === finalBlock.id ? finalBlock : b)));
    setVersions((prev) => [
      {
        id: `v-${Date.now()}`,
        blockId: finalBlock.id,
        blockName: finalBlock.name,
        action: status === "published" ? "publish" : "draft",
        savedBy: currentUser?.name ?? "—",
        savedAt: "Vừa xong",
        snapshot: finalBlock,
      },
      ...prev,
    ]);
    setDraft(finalBlock);
  }

  function handleSaveDraftLocal() {
    commitSave("draft");
  }

  async function handleSaveAndSync() {
  if (isSyncing || !draft) return;
  setIsSyncing(true);

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values = (draft as any).values || {};

    // Chỉ gọi Supabase nếu section đang sửa có liên quan đến Hero
    if (draft.id === "hero" || draft.name.includes("Hero")) {
      const { error } = await supabase
        .from('landing_content')
        .update({
          headline: values.headline,
          subheadline: values.subheadline,
          cta_text: values.ctaText || values.cta_text, 
          badge_text: values.promoBadge || values.badgeText || values.badge_text
        })
        .eq('section_name', 'hero');

      if (error) {
        console.error("Chi tiết lỗi Supabase:", error.message);
        alert("Lỗi! Không thể đồng bộ lên Supabase.");
        setIsSyncing(false);
        return; 
      }
    }

    commitSave("published");
    
  } catch (err) {
    console.error("Lỗi không xác định:", err);
  } finally {
    setIsSyncing(false);
  }
}

  function restoreVersion(entry: VersionEntry) {
    setBlocks((prev) => prev.map((b) => (b.id === entry.blockId ? entry.snapshot : b)));
    setSelectedId(entry.blockId);
    setDraft(structuredClone(entry.snapshot));
    setIsVersionsOpen(false);
  }

  const fieldRows = useMemo(() => {
    if (!draft || draft.kind !== "form") return [];
    return groupFieldsIntoRows(draft.fields);
  }, [draft]);

  return (
    <div className="mx-auto flex max-w-[1700px] flex-col gap-6">
      <PageHeader
        title={`Quản Lý Nội Dung Landing Page (${blocks.length} Sections)`}
        subtitle="Chỉnh sửa text, hình ảnh và live preview giao diện trực tiếp trước khi Publish lên Google Sheets."
        actions={
          <>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-3.5 w-3.5" />
              Xem trang live
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsVersionsOpen(true)}>
              <Clock className="h-3.5 w-3.5" />
              Lịch Sử Chỉnh Sửa (Versions)
            </Button>
          </>
        }
      />

      {!isEditor && (
        <div className="flex items-center gap-2.5 rounded-[var(--radius-card)] border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-700">
          <Lock className="h-4 w-4 shrink-0" />
          Tài khoản của bạn chỉ có quyền xem nội dung. Chỉ Super Admin và Marketing mới chỉnh sửa được landing page.
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-2">
        {blocks.map((block, index) => (
          <Card
            key={block.id}
            className={cn(
              "flex w-[280px] shrink-0 flex-col transition-shadow hover:shadow-[var(--shadow-card-hover)]",
              selectedId === block.id && "ring-2 ring-[var(--color-primary)]",
            )}
          >
            <div className="flex flex-col gap-2 p-4 pb-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                  Section {String(index + 1).padStart(2, "0")}
                </span>
                <Badge tone={block.status === "published" ? "success" : "warning"}>
                  {block.status === "published" ? "Đã Publish" : "Đang Chỉnh Sửa"}
                </Badge>
              </div>
              <h3 className="text-[14px] font-bold leading-snug text-[var(--color-text)]">{block.name}</h3>
              <p className="line-clamp-2 text-[12px] text-[var(--color-text-secondary)]">{block.description}</p>
            </div>
            <div className="p-4">
              <div className="flex h-24 items-center justify-center rounded-[var(--radius-control)] border border-dashed border-[var(--color-border)] bg-gray-50/60">
                <span className="text-[11px] font-mono text-gray-400">[ {BLOCK_PREVIEW_LABEL[block.id] ?? block.name} ]</span>
              </div>
            </div>
            <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--color-border)] p-4">
              <span className="truncate text-[11px] text-[var(--color-text-secondary)]">
                {block.status === "draft" && !block.updatedAt ? "Chưa đồng bộ Sheets" : `Cập nhật: ${block.updatedAt}`}
              </span>
              <Button size="sm" onClick={() => openEditor(block)} className="shrink-0">
                {isEditor ? "Chỉnh sửa" : "Xem"}
                <Pencil className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {draft && savedSelected && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {/* Left: edit form */}
          <Card className="flex flex-col">
            <div className="border-b border-[var(--color-border)] p-5">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                Editing: Section {draft.name}
              </p>
              <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-[16px] font-bold text-[var(--color-text)]">Form Nhập Liệu Nội Dung</h3>
                <div className="flex items-center gap-2">
                  {isDirty && <Badge tone="warning">Đang soạn (chưa lưu)</Badge>}
                  <button
                    onClick={closeEditor}
                    className="text-[12px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>

            <div className="flex max-h-[640px] flex-col gap-4 overflow-y-auto p-5">
              {draft.kind === "form" &&
                fieldRows.map((row, rowIndex) => (
                  <div key={rowIndex} className={cn(row.length > 1 && "grid grid-cols-2 gap-3")}>
                    {row.map((field) => {
                      const value = draft.kind === "form" ? draft.values[field.key] ?? "" : "";
                      return (
                        <FormField key={field.key} label="">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-[12px] font-medium text-[var(--color-text)]">{field.label}</span>
                            {field.maxLength && (
                              <span className="text-[11px] text-[var(--color-text-secondary)]">
                                {value.length}/{field.maxLength} ký tự
                              </span>
                            )}
                          </div>
                          {field.type === "textarea" ? (
                            <TextAreaField
                              disabled={!isEditor}
                              maxLength={field.maxLength}
                              value={value}
                              onChange={(e) =>
                                setDraft((prev) =>
                                  prev && prev.kind === "form"
                                    ? { ...prev, values: { ...prev.values, [field.key]: e.target.value } }
                                    : prev,
                                )
                              }
                            />
                          ) : (
                            <TextField
                              disabled={!isEditor}
                              maxLength={field.maxLength}
                              value={value}
                              onChange={(e) =>
                                setDraft((prev) =>
                                  prev && prev.kind === "form"
                                    ? { ...prev, values: { ...prev.values, [field.key]: e.target.value } }
                                    : prev,
                                )
                              }
                            />
                          )}
                        </FormField>
                      );
                    })}
                  </div>
                ))}

              {draft.kind === "form" && draft.hasImage && (
                <ImageSlotManager
                  image={draft.image}
                  disabled={!isEditor}
                  onChange={(image) => setDraft((prev) => (prev && prev.kind === "form" ? { ...prev, image } : prev))}
                  onRemove={() => setDraft((prev) => (prev && prev.kind === "form" ? { ...prev, image: null } : prev))}
                />
              )}

              {draft.kind === "list" &&
                draft.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="rounded-[var(--radius-control)] border border-[var(--color-border)] p-3.5">
                    <div className="mb-2.5 flex items-center justify-between">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                        {draft.itemLabel} #{itemIndex + 1}
                      </p>
                      {isEditor && (
                        <button
                          aria-label="Xóa mục"
                          onClick={() =>
                            setDraft((prev) =>
                              prev && prev.kind === "list"
                                ? { ...prev, items: prev.items.filter((_, i) => i !== itemIndex) }
                                : prev,
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-control)] text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col gap-3">
                      {draft.fields.map((field) => (
                        <FormField key={field.key} label={field.label}>
                          {field.type === "textarea" ? (
                            <TextAreaField
                              disabled={!isEditor}
                              value={item[field.key] ?? ""}
                              onChange={(e) =>
                                setDraft((prev) => {
                                  if (!prev || prev.kind !== "list") return prev;
                                  const items = [...prev.items];
                                  items[itemIndex] = { ...items[itemIndex], [field.key]: e.target.value };
                                  return { ...prev, items };
                                })
                              }
                            />
                          ) : (
                            <TextField
                              disabled={!isEditor}
                              value={item[field.key] ?? ""}
                              onChange={(e) =>
                                setDraft((prev) => {
                                  if (!prev || prev.kind !== "list") return prev;
                                  const items = [...prev.items];
                                  items[itemIndex] = { ...items[itemIndex], [field.key]: e.target.value };
                                  return { ...prev, items };
                                })
                              }
                            />
                          )}
                        </FormField>
                      ))}
                    </div>
                  </div>
                ))}

              {draft.kind === "list" && isEditor && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  onClick={() =>
                    setDraft((prev) => {
                      if (!prev || prev.kind !== "list") return prev;
                      const blank = Object.fromEntries(prev.fields.map((f) => [f.key, ""]));
                      return { ...prev, items: [...prev.items, blank] };
                    })
                  }
                >
                  <Plus className="h-3.5 w-3.5" />
                  Thêm {draft.itemLabel}
                </Button>
              )}
            </div>

            {isEditor && (
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] p-4">
                <Button variant="outline" size="sm" onClick={handleSaveDraftLocal}>
                  Lưu Bản Nháp Local
                </Button>
                <Button size="sm" onClick={handleSaveAndSync} disabled={isSyncing} className="bg-emerald-600 hover:bg-emerald-700">
                  <Save className={cn("h-3.5 w-3.5", isSyncing && "animate-pulse")} />
                  {isSyncing ? "Đang đồng bộ..." : "Lưu & Đồng Bộ Sheets"}
                </Button>
              </div>
            )}
          </Card>

          {/* Right: live preview */}
          <div className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-gray-800 bg-[#05070d]">
            <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="font-mono text-[11px] uppercase tracking-wide text-gray-400">Live Preview Simulator</span>
              </div>
              <span className="text-[10px] font-medium text-emerald-400">100% Matching Live Site</span>
            </div>
            <div
              className="relative flex-1 p-5"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
                backgroundSize: "14px 14px",
              }}
            >
              <div className="rounded-xl bg-[#0b0f1a] p-5 shadow-xl">
                <LandingPreview block={draft} />
              </div>
            </div>
            <div className="border-t border-gray-800 px-4 py-2 text-center text-[10px] text-gray-500">
              Thay đổi ở cột bên trái sẽ tự động cập nhật trực tiếp tại đây theo realtime.
            </div>
          </div>
        </div>
      )}

      <Dialog
        open={isVersionsOpen}
        onClose={() => setIsVersionsOpen(false)}
        title="Lịch Sử Chỉnh Sửa (Versions)"
        description={`${publishedCount}/${blocks.length} section đang publish · ${versions.length} lần lưu trong phiên này`}
        widthClassName="max-w-lg"
      >
        {versions.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-[var(--color-text-secondary)]">
            Chưa có thay đổi nào được lưu trong phiên làm việc này.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {versions.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--color-border)] px-3.5 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-[var(--color-text)]">{entry.blockName}</p>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">
                    {entry.action === "publish" ? "Xuất bản" : "Lưu nháp"} bởi {entry.savedBy} · {entry.savedAt}
                  </p>
                </div>
                {isEditor && (
                  <button
                    onClick={() => restoreVersion(entry)}
                    className="flex shrink-0 items-center gap-1 text-[12px] font-medium text-[var(--color-primary)] hover:underline"
                  >
                    <Undo2 className="h-3.5 w-3.5" />
                    Khôi phục
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Dialog>
    </div>
  );
}
