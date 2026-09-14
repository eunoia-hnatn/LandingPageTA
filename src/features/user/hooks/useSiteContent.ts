import { useEffect, useState } from "react";
import { supabase } from "@/shared/lib/supabase";
import { contentDefaults } from "@user/config/contentDefaults";

interface SiteContentRow {
  block: string;
  data: unknown;
  is_published: boolean;
}

type RawBlocks = Record<string, { data: unknown; is_published: boolean }>;

interface SiteContentState {
  /** Lấy dữ liệu 1 block, merge sâu lên contentDefaults[block]. */
  content: <T = unknown>(block: string) => T;
  /** true nếu block chưa publish / không có / mảng `items` rỗng. */
  isBlockEmpty: (block: string, itemsKey?: string) => boolean;
  /** Set id section rỗng (để ẩn mục menu — dùng với navSections). */
  emptyBlocks: ReadonlySet<string>;
  loading: boolean;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Merge sâu: object → đệ quy; array/primitive → override nếu có ở src. */
function deepMerge<T>(base: T, src: unknown): T {
  if (!isObject(base) || !isObject(src)) {
    return (src === undefined || src === null ? base : (src as T));
  }
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(src)) {
    out[key] = deepMerge((base as Record<string, unknown>)[key], src[key]);
  }
  return out as T;
}

// Cache module-level: 1 request cho cả vòng đời trang.
let cache: RawBlocks | null = null;
let inflight: Promise<RawBlocks> | null = null;

async function fetchBlocks(): Promise<RawBlocks> {
  const { data } = await supabase.from("site_content").select("block, data, is_published");
  const map: RawBlocks = {};
  for (const row of (data ?? []) as SiteContentRow[]) {
    map[row.block] = { data: row.data, is_published: row.is_published };
  }
  cache = map;
  return map;
}

function loadBlocks(): Promise<RawBlocks> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) inflight = fetchBlocks();
  return inflight;
}

export function useSiteContent(): SiteContentState {
  const [blocks, setBlocks] = useState<RawBlocks>(cache ?? {});
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled) setLoading(false); // fallback: dùng default nếu mạng treo
    }, 6000);
    loadBlocks().then((map) => {
      clearTimeout(timer);
      if (cancelled) return;
      setBlocks(map);
      setLoading(false);
    });
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const content = <T,>(block: string): T => {
    const def = (contentDefaults as Record<string, unknown>)[block];
    const row = blocks[block];
    if (!row || !row.is_published) return def as T;
    return deepMerge(def, row.data) as T;
  };

  const isBlockEmpty = (block: string, itemsKey = "items"): boolean => {
    const row = blocks[block];
    if (!row || !row.is_published) {
      const def = (contentDefaults as Record<string, unknown>)[block];
      const arr = isObject(def) ? (def as Record<string, unknown>)[itemsKey] : undefined;
      return !Array.isArray(arr) || arr.length === 0;
    }
    const d = row.data;
    if (!isObject(d)) return true;
    const arr = d[itemsKey];
    return !Array.isArray(arr) || arr.length === 0;
  };

  const emptyBlocks = new Set<string>();
  // hoc-vien ẩn khi block testimonials rỗng (Nhóm 3B nối vào)
  if (isBlockEmpty("testimonials")) emptyBlocks.add("hoc-vien");

  return { content, isBlockEmpty, emptyBlocks, loading };
}

/** Dùng trong test để reset cache. */
export function __resetSiteContentCache() {
  cache = null;
  inflight = null;
}
