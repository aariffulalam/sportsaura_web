import { ApiError } from "@/lib/api-client";

/** What a login or register form shows after a failed submit. */
export type AuthFormState =
  | {
      /** Success message, e.g. "Profile saved". */
      success?: string;
      /** Message for the whole form, e.g. "Invalid email or password". */
      message?: string;
      /** Field name → message, shown under each field. */
      errors?: Record<string, string>;
      /** What the user typed (never the password), so the form keeps it after an error. */
      values?: Record<string, string>;
    }
  | undefined;

export const UNREACHABLE_MESSAGE =
  "We could not reach the SportsAura server. Please try again in a moment.";

export function toFormState(error: unknown, values: Record<string, string>): AuthFormState {
  if (error instanceof ApiError) {
    return { message: error.message, errors: error.fieldErrors, values };
  }
  console.error("Unexpected error while calling the user service", error);
  return { message: UNREACHABLE_MESSAGE, values };
}

/** Only allows redirects to paths on this site, never to another domain. */
export function safeRedirectPath(value: unknown, fallback = "/dashboard"): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }
  return value;
}
