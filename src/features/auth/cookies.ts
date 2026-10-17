/**
 * Names and options of the login cookies. Used by Server Actions and by the proxy.
 *
 * Both cookies are httpOnly: browser JavaScript cannot read them, so a script injected into the
 * page cannot steal the tokens.
 */
export const ACCESS_COOKIE = "sa_access";
export const REFRESH_COOKIE = "sa_refresh";

/**
 * The access cookie is dropped by the browser this many seconds before the token expires, so a
 * request never carries a token that runs out on the way to the user service.
 */
export const ACCESS_EXPIRY_MARGIN_SECONDS = 30;

export type SessionCookieOptions = {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: "/";
  maxAge: number;
};

export function sessionCookieOptions(
  maxAgeSeconds: number,
  secure: boolean = process.env.NODE_ENV === "production",
): SessionCookieOptions {
  return { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: Math.max(0, maxAgeSeconds) };
}

export function accessCookieMaxAge(expiresInSeconds: number): number {
  return Math.max(1, expiresInSeconds - ACCESS_EXPIRY_MARGIN_SECONDS);
}
