import { useEffect, useState } from "react";

/**
 * IntersectionObserver theo dõi danh sách id section → trả id đang hiển thị.
 * rootMargin bù chiều cao TopBar + Header (mặc định ~120px trên).
 */
export function useScrollSpy(ids: string[], topOffset = 120): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        if (visible.size > 0) {
          // id có tỉ lệ hiển thị lớn nhất, ưu tiên theo thứ tự tài liệu khi hoà
          let best: string | null = null;
          let bestRatio = -1;
          for (const id of ids) {
            const r = visible.get(id);
            if (r !== undefined && r > bestRatio) {
              best = id;
              bestRatio = r;
            }
          }
          if (best) setActiveId(best);
        }
      },
      {
        rootMargin: `-${topOffset}px 0px -55% 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids.join("|"), topOffset]);

  return activeId;
}
