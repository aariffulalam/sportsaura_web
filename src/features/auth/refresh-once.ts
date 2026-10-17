/**
 * Makes sure one refresh token is sent to the user service only once.
 *
 * A page load can fire several requests at the same moment (the page plus link prefetches), each
 * carrying the same expired session. Refresh tokens work only once and the user service treats a
 * second use as theft (it logs the user out everywhere). So concurrent refreshes of the same token
 * share one call, and the result is reused for a few seconds for requests already on their way.
 *
 * This lives in server memory, which is fine for one Next.js server (our Docker setup). With
 * several servers behind a load balancer, use sticky sessions or a shared store instead.
 */
import { refresh, type AuthResponse } from "@/lib/user-service";

const REUSE_WINDOW_MS = 10_000;

type Entry = { result: Promise<AuthResponse>; expiresAt: number };
const inFlight = new Map<string, Entry>();

export function refreshOnce(
  refreshToken: string,
  callRefresh: (token: string) => Promise<AuthResponse> = refresh,
  now: () => number = Date.now,
): Promise<AuthResponse> {
  removeExpired(now());
  const existing = inFlight.get(refreshToken);
  if (existing) {
    return existing.result;
  }
  const result = callRefresh(refreshToken);
  inFlight.set(refreshToken, { result, expiresAt: now() + REUSE_WINDOW_MS });
  // A failed refresh is not reused: the next request may try again.
  result.catch(() => inFlight.delete(refreshToken));
  return result;
}

function removeExpired(time: number) {
  for (const [token, entry] of inFlight) {
    if (entry.expiresAt <= time) {
      inFlight.delete(token);
    }
  }
}
