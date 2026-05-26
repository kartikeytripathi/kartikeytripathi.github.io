import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: [
      "https://www.kartikeytripathi.in/sitemap.xml",
      "https://blogs.kartikeytripathi.in/sitemap.xml",
    ],
  };
}
