/**
 * Reads and writes the login cookies from Server Components and Server Actions.
 * Writing (set / clear) only works inside Server Actions and Route Handlers.
 */
import { cookies } from "next/headers";

import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  accessCookieMaxAge,
  sessionCookieOptions,
} from "@/features/auth/cookies";
import type { AuthResponse } from "@/lib/user-service";

export async function getAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(ACCESS_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  return (await cookies()).get(REFRESH_COOKIE)?.value;
}

export async function setSessionCookies(auth: AuthResponse): Promise<void> {
  const store = await cookies();
  store.set(
    ACCESS_COOKIE,
    auth.accessToken,
    sessionCookieOptions(accessCookieMaxAge(auth.expiresInSeconds)),
  );
  store.set(REFRESH_COOKIE, auth.refreshToken, sessionCookieOptions(auth.refreshExpiresInSeconds));
}

export async function clearSessionCookies(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}
