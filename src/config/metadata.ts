import type { Metadata } from "next";

export const metaData: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_CURRENT_SITE_URL as string),
    openGraph: {
        type: "website",
        locale: "en_US",
        siteName: "Aditya Domle Portfolio",
        title:
            "Aditya Domle | Full-Stack Web Developer & DevOps Enthusiast | Next.js, React, Node.js",
        description:
            "Discover Aditya Domle, a dedicated Software Engineer specializing in full-stack application development. Crafting responsive web solutions using modern technologies like Next.js, React, Tailwind CSS, Node.js, Express, and MongoDB, while also applying DevOps practices. Continuously aiming to deliver high-quality, comprehensive, user-centric software solutions.",
        images: [
            {
                url: "/image.webp",
                alt: "Aditya Domle | Full-Stack Web Developer & DevOps Enthusiast",
                height: 630,
                width: 1200,
            },
        ],
    },
    title:
        "Aditya Domle | Full-Stack Web Developer & DevOps Enthusiast | Next.js, React, Node.js",
    description:
        "Discover Aditya Domle, a dedicated Software Engineer specializing in full-stack application development. Crafting responsive web solutions using modern technologies like Next.js, React, Tailwind CSS, Node.js, Express, and MongoDB, while also applying DevOps practices. Continuously aiming to deliver high-quality, comprehensive, user-centric software solutions.",
    keywords:
        "Aditya Domle, Full-Stack Developer, Full-Stack Web Developer, Software Engineer, DevOps, ReactJS Developer, NextJS Developer, Node.js Developer, Express.js, MongoDB, Web Development, Portfolio, React developer, Next.js developer, Tailwind CSS, Modern Web Technologies, User-Centric Solutions",
    robots:
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
    authors: {
        name: "Aditya Domle",
        url: "https://www.adittya.site/",
    },
};
