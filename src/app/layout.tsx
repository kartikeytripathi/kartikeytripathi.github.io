import "./globals.css";
import { inter, jetbrainsMono } from "@/config/fonts";
import { metaData } from "@/config/metadata";
import { SiteChrome } from "@/components/SiteChrome";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = metaData;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.GOOGLE_ANALYTICS_ID || "";

  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased bg-black text-white select-none">
        <SiteChrome />
        {children}

        {/* 📊 Analytics */}
        {gaId && <GoogleAnalytics gaId={gaId} />} {/* Google Analytics */}
        <Analytics /> {/* Vercel Analytics (free for Hobby plan) */}
        <SpeedInsights /> {/* Page speed and performance tracking */}
      </body>
    </html>
  );
}
