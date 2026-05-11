import { MetadataRoute } from "next";
import { blogPosts } from "@/config/blog";

const BASE_URL = "https://www.kartikeytripathi.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogRoutes = blogPosts
    .filter((post) => !post.externalUrl)
    .map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogRoutes,
  ];
}
