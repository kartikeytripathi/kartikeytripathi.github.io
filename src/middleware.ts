import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  if (host === "blogs.kartikeytripathi.in") {
    const url = request.nextUrl.clone();

    // Pass through static resources and system routes
    if (
      url.pathname.startsWith("/resources/") ||
      url.pathname.startsWith("/images/") ||
      url.pathname === "/sitemap.xml" ||
      url.pathname === "/robots.txt"
    ) {
      return NextResponse.next();
    }

    // Redirect /blog/* and /blog to clean URLs so the browser never shows /blog/ prefix
    if (url.pathname.startsWith("/blog/") || url.pathname === "/blog") {
      const cleanPath = url.pathname.replace(/^\/blog/, "") || "/";
      url.pathname = cleanPath;
      return NextResponse.redirect(url, 301);
    }

    // Rewrite clean slug paths to /blog/* internally
    const path = url.pathname === "/" ? "" : url.pathname;
    url.pathname = `/blog${path}`;
    return NextResponse.rewrite(url);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
