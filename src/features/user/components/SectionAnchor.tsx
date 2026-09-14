import { type ReactNode } from "react";
import { getSection } from "@user/config/sections";

interface SectionAnchorProps {
  /** id lấy từ config/sections.ts — KHÔNG hard-code chuỗi rời. */
  id: string;
  children: ReactNode;
  className?: string;
  as?: "section" | "div";
  "aria-label"?: string;
}

/**
 * <section id> chuẩn: scroll-margin-top bù header khi cuộn tới bằng anchor.
 * Cảnh báo dev nếu id không có trong hợp đồng sections.
 */
export function SectionAnchor({ id, children, className = "", as = "section", ...rest }: SectionAnchorProps) {
  if (import.meta.env.DEV && !getSection(id)) {
    console.warn(`[SectionAnchor] id "${id}" không có trong config/sections.ts`);
  }
  const Tag = as;
  return (
    <Tag id={id} className={`scroll-mt-[120px] lg:scroll-mt-[132px] ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
