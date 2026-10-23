import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { APP_STORE_LEGAL_URLS } from "@/lib/appStoreLegalUrls";

/** Dynamic aliases generated from store URL mapping. */
const AUTO_APP_ALIASES: Record<string, string> = Object.fromEntries(
  Object.entries(APP_STORE_LEGAL_URLS).flatMap(([appId, legal]) => {
    const compactId = appId.replace(/[^a-z0-9]/gi, "");
    const decodedTerms = decodeURIComponent(legal.terms);
    return [
      [`/${compactId}privacy`, legal.privacy],
      [`/${compactId}terms`, legal.terms],
      ...(decodedTerms !== legal.terms ? [[decodedTerms, legal.terms]] : []),
    ];
  }),
);

/** Backward-compatible legacy aliases that do not match app ids exactly. */
const LEGACY_OVERRIDES: Record<string, string> = {
  "/coinzy:-terms": "/coinzy-terms",
  "/banknoteprivacy": "/privacy-policy-banknote",
  "/banknoteterms": "/banknote-terms",
  "/delete-account:any-app": "/account-deletion",
  "/delete-account%3A-any-app": "/account-deletion",
};

const DECODED_TERMS_TO_ENCODED: Record<string, string> = {
  ...AUTO_APP_ALIASES,
  ...LEGACY_OVERRIDES,
};

export function middleware(request: NextRequest) {
  const target = DECODED_TERMS_TO_ENCODED[request.nextUrl.pathname];
  if (target) {
    const url = request.nextUrl.clone();
    url.pathname = target;
    return NextResponse.redirect(url, 301);
  }

  if (request.nextUrl.pathname === "/api/visitor-country") {
    const headers = new Headers(request.headers);
    const geo = request.geo;
    if (geo?.country) headers.set("x-visitor-country", geo.country);
    if (geo?.city) headers.set("x-visitor-city", geo.city);
    if (geo?.region) headers.set("x-visitor-region", geo.region);
    return NextResponse.next({ request: { headers } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/api/visitor-country"],
};
