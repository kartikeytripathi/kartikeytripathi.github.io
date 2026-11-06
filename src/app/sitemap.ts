import { MetadataRoute } from "next";
import { blogPosts, parsePostDate } from "@/config/blog";

const PORTFOLIO_URL = "https://www.kartikeytripathi.in";
const BLOG_URL = "https://blogs.kartikeytripathi.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogRoutes = blogPosts
    .filter((post) => !post.externalUrl)
    .map((post) => ({
      url: `${BLOG_URL}/${post.slug}`,
      lastModified: parsePostDate(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  // The blog index changes when a post is added, so it's as fresh as the newest post.
  const latestPostDate = blogRoutes
    .map((r) => r.lastModified)
    .filter((d): d is Date => d !== undefined)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  // No lastModified on the portfolio root: there's no reliable source for
  // when it last changed, and a fake "now" teaches crawlers to ignore it.
  return [
    {
      url: PORTFOLIO_URL,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: BLOG_URL,
      lastModified: latestPostDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogRoutes,
  ];
}
