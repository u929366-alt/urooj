import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Optimistic auth redirect only.
 *
 * This checks for the presence of the session cookie, nothing more — it does
 * not verify it. Real authorisation happens in the Data Access Layer
 * (src/lib/lms/auth.ts), which the Next.js docs are explicit about: proxy must
 * not be used as a session or authorisation solution. All this saves is a
 * pointless render for signed-out visitors.
 */
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has("payload-token");
  if (hasSession) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const loginUrl = new URL("/learn/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Only the pages that require a signed-in student. The catalogue, course
  // pages and the auth pages themselves stay public.
  matcher: ["/learn"],
};
