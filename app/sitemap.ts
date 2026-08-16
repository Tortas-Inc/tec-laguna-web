import type { MetadataRoute } from "next";

const SITE_URL = "https://tec-laguna-app.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/login`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/privacidad`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
