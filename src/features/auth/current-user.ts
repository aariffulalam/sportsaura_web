/**
 * The logged-in user, for Server Components. Reads the access cookie, so callers must sit inside a
 * <Suspense> boundary (Cache Components rule).
 */
import { cache } from "react";

import { getAccessToken } from "@/features/auth/session";
import { ApiError } from "@/lib/api-client";
import { getMe, type User } from "@/lib/user-service";

/** The current user, or null when nobody is logged in or the token is no longer valid. */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const token = await getAccessToken();
  if (!token) {
    return null;
  }
  try {
    return await getMe(token);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
});
