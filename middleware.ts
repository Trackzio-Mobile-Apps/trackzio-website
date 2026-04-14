import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Next.js redirect `source` cannot contain literal `:param` patterns; handle decoded colon paths here. */
const DECODED_TERMS_TO_ENCODED: Record<string, string> = {
  "/coinzy:-terms": "/coinzy%3A-terms",
  "/habit-eazy:-terms": "/habit-eazy%3A-terms",
};

export function middleware(request: NextRequest) {
  const target = DECODED_TERMS_TO_ENCODED[request.nextUrl.pathname];
  if (target) {
    const url = request.nextUrl.clone();
    url.pathname = target;
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

/**
 * Matchers cannot include `/coinzy:-terms` (path-to-regexp treats `:` specially).
 * Run only on non-static paths; the handler returns `next()` immediately except for two URLs.
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
