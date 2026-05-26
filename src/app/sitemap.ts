import { MetadataRoute } from "next";
import { blogPosts } from "@/config/blog";

const PORTFOLIO_URL = "https://www.kartikeytripathi.in";
const BLOG_URL = "https://blogs.kartikeytripathi.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogRoutes = blogPosts
    .filter((post) => !post.externalUrl)
    .map((post) => ({
      url: `${BLOG_URL}/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [
    {
      url: PORTFOLIO_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: BLOG_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogRoutes,
  ];
}
