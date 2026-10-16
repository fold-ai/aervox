import { absoluteUrl } from "@/lib/seo";
import type { MetadataRoute } from "next";

/**
 * Private decks are crawlable so their noindex directive can be read; they are
 * excluded from the sitemap. Noindex is not access control.
 * The console is disallowed here as a courtesy to well-behaved crawlers. It is
 * not the access control: that is middleware.ts and a signed session. A
 * robots rule only asks.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin-pro", "/api/", "/careers/submit"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
