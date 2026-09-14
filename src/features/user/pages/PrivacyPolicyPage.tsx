import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Seo } from "@/shared/components/Seo";
import { usePolicyDocument } from "@/shared/hooks/usePolicyDocument";

export default function PrivacyPolicyPage() {
  const { doc, loading, isFallback } = usePolicyDocument();

  return (
    <div className="min-h-screen bg-white">
      <Seo routeKey="/chinh-sach-bao-mat" />
      <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-scholar-indigo,#2c3481)]"
        >
          <ArrowLeft className="h-4 w-4" /> Về trang chủ
        </Link>
        <h1 className="text-2xl font-semibold text-[var(--color-ink,#000)]">{doc.title}</h1>
        <p className="mt-1 text-[13px] text-[var(--color-ink-body,#717174)]">
          Phiên bản {doc.version}
          {isFallback && " · nội dung tạm — chưa phải bản chính thức"}
        </p>
        {loading ? (
          <p className="mt-8 text-[14px] text-[var(--color-ink-body,#717174)]">Đang tải…</p>
        ) : (
          <div className="prose prose-sm mt-6 max-w-none text-[15px] leading-relaxed text-[var(--color-ink-body,#717174)] [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--color-wayfinder-orange,#f68c1f)] [&_blockquote]:pl-3 [&_blockquote]:text-[var(--color-ink,#000)] [&_h2]:mt-6 [&_h2]:text-[17px] [&_h2]:font-semibold [&_h2]:text-[var(--color-ink,#000)] [&_ul]:list-disc [&_ul]:pl-5">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc.body_md}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
