// One public origin, matching Vercel's apex-to-www redirect.
export const SITE_URL = "https://www.actprove.com";
export const absoluteUrl = (path = "/") => new URL(path, SITE_URL).href;
export const siteDescription = "ACTPROVE develops defense technology: onboard drone intelligence, ground software, sensing and equipment integration for connected operations.";

export function pageMetadata({ title, description, path }) {
  return {
    title, description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: { title, description, url: absoluteUrl(path), siteName: "ACTPROVE", type: "website", locale: "en_US", images: [{ url: absoluteUrl("/social-image"), width: 1200, height: 630, alt: "ACTPROVE - Connected defense systems" }] },
    twitter: { card: "summary_large_image", title, description, images: [absoluteUrl("/social-image")] },
  };
}

export function breadcrumbs(items) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map(([name, path], index) => ({ "@type": "ListItem", position: index + 1, name, item: absoluteUrl(path) })) };
}

export const organization = {
  "@type": "Organization", "@id": absoluteUrl("/#organization"), name: "ACTPROVE", legalName: "Menuo Inc.", url: SITE_URL,
  description: siteDescription, logo: absoluteUrl("/actprove-lockup.png"), email: "contact@actprove.com",
};

export const websiteSchema = {
  "@context": "https://schema.org", "@graph": [organization, {
    "@type": "WebSite", "@id": absoluteUrl("/#website"), url: SITE_URL, name: "ACTPROVE", alternateName: "Actprove Defense Technologies", inLanguage: "en", publisher: { "@id": organization["@id"] },
  }],
};
