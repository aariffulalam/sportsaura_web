/**
 * Runs before every page request.
 *
 * 1. Keeps users logged in: when the short-lived access cookie has expired but the refresh cookie
 *    is still there, it gets new tokens from the user service and stores them in both the response
 *    (for the browser) and the request (so this very page already sees the new token).
 * 2. Sends logged-out visitors of private pages (/account, /admin, /dashboard) to /login,
 *    remembering where they wanted to go.
 *
 * Pages and Server Actions still check the login themselves; this is only the first gate.
 */
import { NextResponse, type NextRequest } from "next/server";

import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  accessCookieMaxAge,
  sessionCookieOptions,
} from "@/features/auth/cookies";
import { refreshOnce } from "@/features/auth/refresh-once";
import type { AuthResponse } from "@/lib/user-service";

const PRIVATE_PATHS = ["/account", "/admin", "/dashboard"];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  let tokens: AuthResponse | undefined;
  let refreshFailed = false;
  if (!request.cookies.has(ACCESS_COOKIE) && refreshToken) {
    try {
      tokens = await refreshOnce(refreshToken);
    } catch {
      refreshFailed = true;
    }
  }
  const loggedIn = request.cookies.has(ACCESS_COOKIE) || tokens !== undefined;

  let response: NextResponse;
  if (!loggedIn && isPrivate(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname + search);
    response = NextResponse.redirect(loginUrl);
  } else if (tokens) {
    request.cookies.set(ACCESS_COOKIE, tokens.accessToken);
    request.cookies.set(REFRESH_COOKIE, tokens.refreshToken);
    response = NextResponse.next({ request: { headers: request.headers } });
  } else {
    response = NextResponse.next();
  }

  if (tokens) {
    response.cookies.set(
      ACCESS_COOKIE,
      tokens.accessToken,
      sessionCookieOptions(accessCookieMaxAge(tokens.expiresInSeconds)),
    );
    response.cookies.set(
      REFRESH_COOKIE,
      tokens.refreshToken,
      sessionCookieOptions(tokens.refreshExpiresInSeconds),
    );
  } else if (refreshFailed) {
    response.cookies.delete(REFRESH_COOKIE);
  }
  return response;
}

function isPrivate(pathname: string): boolean {
  return PRIVATE_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export const config = {
  // Everything except build files, images and fixed public files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"],
};
