import { getSeo, type SeoValues } from "@/shared/config/seo";

interface SeoProps {
  /** Khoá route trong seoDefaults ("/", "/chinh-sach-bao-mat", "404"…). */
  routeKey?: string;
  /** Ghi đè từng field (vd: từ CMS site_content.seo). */
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
}

/**
 * React 19 tự hoist <title>/<meta>/<link> lên <head> — không cần react-helmet.
 * Route public khai báo <Seo routeKey="..." /> ở đầu page.
 */
export function Seo({ routeKey = "/", title, description, ogImage, canonical, noIndex }: SeoProps) {
  const base: SeoValues = getSeo(routeKey);
  const t = title ?? base.title;
  const d = description ?? base.description;
  const img = ogImage ?? base.ogImage;

  return (
    <>
      <title>{t}</title>
      <meta name="description" content={d} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      {canonical && <link rel="canonical" href={canonical} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </>
  );
}
