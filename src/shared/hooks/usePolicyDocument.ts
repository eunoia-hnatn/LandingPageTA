import { useEffect, useState } from "react";
import { supabase } from "@/shared/lib/supabase";
import { POLICY_FALLBACK } from "@/shared/config/policyFallback";

export interface PolicyDocument {
  slug: string;
  version: string;
  title: string;
  body_md: string;
  published_at: string | null;
}

interface State {
  doc: PolicyDocument;
  loading: boolean;
  /** true nếu đang dùng bản bundle tĩnh (DB chưa seed / lỗi mạng). */
  isFallback: boolean;
}

const cache = new Map<string, PolicyDocument>();

/** Lấy bản chính sách hiện hành từ `policy_documents`; fallback bản bundle tĩnh. */
export function usePolicyDocument(slug = "data-privacy"): State {
  const [state, setState] = useState<State>(() => ({
    doc: cache.get(slug) ?? POLICY_FALLBACK,
    loading: !cache.has(slug),
    isFallback: !cache.has(slug),
  }));

  useEffect(() => {
    if (cache.has(slug)) return;
    let done = false;
    const finish = (doc: PolicyDocument, isFallback: boolean) => {
      if (done) return;
      done = true;
      if (!isFallback) cache.set(slug, doc);
      setState({ doc, loading: false, isFallback });
    };

    // Fallback cứng nếu mạng treo — không để kẹt "Đang tải…".
    const timer = setTimeout(() => finish(POLICY_FALLBACK, true), 6000);

    (async () => {
      try {
        const { data } = await supabase
          .from("policy_documents")
          .select("slug, version, title, body_md, published_at")
          .eq("slug", slug)
          .eq("is_current", true)
          .maybeSingle();
        clearTimeout(timer);
        finish((data as PolicyDocument | null) ?? POLICY_FALLBACK, !data);
      } catch {
        clearTimeout(timer);
        finish(POLICY_FALLBACK, true);
      }
    })();

    return () => clearTimeout(timer);
  }, [slug]);

  return state;
}
