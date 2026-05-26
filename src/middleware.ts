import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  if (host === "blogs.kartikeytripathi.in") {
    const url = request.nextUrl.clone();
    if (url.pathname.startsWith("/resources/") || url.pathname.startsWith("/blog/") || url.pathname === "/blog") {
      return NextResponse.next();
    }
    const path = url.pathname === "/" ? "" : url.pathname;
    url.pathname = `/blog${path}`;
    return NextResponse.rewrite(url);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
