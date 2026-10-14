import type { MetadataRoute } from "next";
import { careerRoles } from "@/lib/careers/roles";

/** Public routes only. The console is never listed. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/systems", "/systems/act-1", "/systems/prove-1", "/systems/detect-1", "/systems/arca-1", "/systems/era-1", "/systems/vista-1", "/platform", "/company", "/careers", ...careerRoles.map(role => `/careers/${role.slug}`), "/contact"];
  return pages.map(path => ({
    url: `https://actprove.com${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path ? .8 : 1,
  }));
}
