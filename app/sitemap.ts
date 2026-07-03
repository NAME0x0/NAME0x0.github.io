import type { MetadataRoute } from "next";
import { tierOneProjects } from "@/lib/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://name0x0.vercel.app";
  const lastModified = new Date();
  const staticRoutes = ["/", "/work", "/about", "/now", "/cv"];
  const workRoutes = tierOneProjects.map((project) => `/work/${project.slug}`);

  return [...staticRoutes, ...workRoutes].map((route) => ({
    url: `${baseUrl}${route === "/" ? "" : route}`,
    lastModified,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
