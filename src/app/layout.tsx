import "./globals.css";
import { headers } from "next/headers";
import { inter, jetbrainsMono } from "@/config/fonts";
import { metaData } from "@/config/metadata";
import { Header, CursorSpotlight, ScrollProgress, BackToTop, FloatingLove } from "@/components";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = metaData;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.GOOGLE_ANALYTICS_ID || "";
  const resolvedPathname = (await headers()).get("x-resolved-pathname") ?? "";
  const isBlogRoute = resolvedPathname.startsWith("/blog");

  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased bg-black text-white select-none">
        <ScrollProgress />
        <CursorSpotlight />
        <Header />
        {children}
        <BackToTop />
        {!isBlogRoute && <FloatingLove />}

        {/* 📊 Analytics */}
        {gaId && <GoogleAnalytics gaId={gaId} />} {/* Google Analytics */}
        <Analytics /> {/* Vercel Analytics (free for Hobby plan) */}
        <SpeedInsights /> {/* Page speed and performance tracking */}
      </body>
    </html>
  );
}
