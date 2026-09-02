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
      return withResolvedPathHeader(request, url.pathname);
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
    return withResolvedPathHeader(request, url.pathname, url);
  }

  return withResolvedPathHeader(request, request.nextUrl.pathname);
}

/**
 * Stamps the resolved (post-rewrite) pathname onto a request header so
 * server components can read the real route even though the browser's
 * address bar (and therefore client-side usePathname()) never sees the
 * /blog prefix for the blogs.kartikeytripathi.in host.
 */
function withResolvedPathHeader(
  request: NextRequest,
  resolvedPathname: string,
  rewriteUrl?: URL
) {
  const headers = new Headers(request.headers);
  headers.set("x-resolved-pathname", resolvedPathname);
  return rewriteUrl
    ? NextResponse.rewrite(rewriteUrl, { request: { headers } })
    : NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
