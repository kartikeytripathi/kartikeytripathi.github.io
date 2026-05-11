import type { Metadata } from "next";

export const metaData: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_CURRENT_SITE_URL || "https://www.kartikeytripathi.in"
  ),

  title:
    "Kartikey Tripathi | Cloud & DevOps Engineer | AWS, Containers, Web Development",

  description:
    "Kartikey Tripathi is a Cloud and DevOps Engineer with strong expertise in AWS services, containerization, and modern web development. Passionate about building scalable, reliable cloud-native solutions and continuously improving system performance and automation.",

  keywords:
    "Kartikey Tripathi, Cloud Engineer, DevOps Engineer, AWS Engineer, AWS RDS, AWS Cloud, DevOps Portfolio, Kubernetes, Containers, CI/CD, Infrastructure as Code, Web Developer, HTML Developer, Next.js Portfolio",

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Kartikey Tripathi Portfolio",

    title:
      "Kartikey Tripathi | Cloud & DevOps Engineer | AWS, Containers, Web Development",

    description:
      "Explore the portfolio of Kartikey Tripathi, a Cloud and DevOps Engineer specializing in AWS, container technologies, and scalable web solutions. Focused on reliability, automation, and performance-driven architectures.",

  },

  robots:
    "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  authors: [
    {
      name: "Kartikey Tripathi",
      url: "https://kartikeytripathi.in",
    },
  ],
};
