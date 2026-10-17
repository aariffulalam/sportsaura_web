/**
 * Shared HTTP helper for calling SportsAura backend services from the Next.js server.
 * Every service returns errors in the same problem-details shape, so they are read the same way.
 */

/** An error response from a backend service, read from its problem-details JSON. */
export class ApiError extends Error {
  readonly status: number;
  /** Field name → message, filled for validation errors (HTTP 400). */
  readonly fieldErrors: Record<string, string>;

  constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export type RequestOptions = {
  method?: "GET" | "POST" | "PUT";
  body?: unknown;
  /** Access token; sent as `Authorization: Bearer <token>`. */
  token?: string;
};

export async function requestJson<T>(
  baseUrl: string,
  path: string,
  { method = "GET", body, token }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 204) {
    return undefined as T;
  }
  const json: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    throw toApiError(response.status, json);
  }
  return json as T;
}

/** Turns a problem-details body ({ detail, errors }) into an ApiError. */
export function toApiError(status: number, body: unknown): ApiError {
  const problem = (body ?? {}) as { detail?: unknown; errors?: unknown };
  const message =
    typeof problem.detail === "string" ? problem.detail : `Request failed with status ${status}`;
  return new ApiError(status, message, isStringRecord(problem.errors) ? problem.errors : {});
}

/** Returns null instead of throwing when the service answers 404 Not Found. */
export async function nullIfNotFound<T>(request: Promise<T>): Promise<T | null> {
  try {
    return await request;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.values(value).every((item) => typeof item === "string")
  );
}
