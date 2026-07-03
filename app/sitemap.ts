import type { MetadataRoute } from "next";
import { tierOneProjects } from "@/lib/content/projects";
import { getAllPosts } from "@/lib/content/writing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://name0x0.vercel.app";
  const lastModified = new Date();
  const staticRoutes = ["/", "/work", "/writing", "/about", "/now", "/cv"];
  const workRoutes = tierOneProjects.map((project) => `/work/${project.slug}`);
  const writingRoutes = getAllPosts().map((post) => `/writing/${post.slug}`);

  return [...staticRoutes, ...workRoutes, ...writingRoutes].map((route) => ({
    url: `${baseUrl}${route === "/" ? "" : route}`,
    lastModified,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
