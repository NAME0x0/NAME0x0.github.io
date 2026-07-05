import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://name0x0.vercel.app/sitemap.xml",
    host: "https://name0x0.vercel.app",
  };
}
