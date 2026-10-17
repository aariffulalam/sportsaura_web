/**
 * Typed client for the SportsAura user service REST API (accounts and login).
 *
 * Server-side only: it reads USER_SERVICE_URL and is called from Server Components, Server Actions
 * and the proxy. The browser never talks to the user service directly, so no CORS is needed and
 * tokens never reach browser JavaScript.
 */
import { requestJson, type RequestOptions } from "@/lib/api-client";
import { readServerEnv } from "@/lib/env";

export type Role = "USER" | "TRAINER" | "ADMIN";

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
  refreshExpiresInSeconds: number;
  user: User;
};

/** A page of results, as every SportsAura service returns lists. */
export type Page<T> = {
  content: T[];
  page: { size: number; number: number; totalElements: number; totalPages: number };
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: "USER" | "TRAINER";
};

export function login(input: { email: string; password: string }): Promise<AuthResponse> {
  return request("/api/v1/auth/login", { method: "POST", body: input });
}

export function register(input: RegisterInput): Promise<AuthResponse> {
  return request("/api/v1/auth/register", { method: "POST", body: input });
}

export function refresh(refreshToken: string): Promise<AuthResponse> {
  return request("/api/v1/auth/refresh", { method: "POST", body: { refreshToken } });
}

export function logout(refreshToken: string): Promise<void> {
  return request("/api/v1/auth/logout", { method: "POST", body: { refreshToken } });
}

export function getMe(accessToken: string): Promise<User> {
  return request("/api/v1/users/me", { token: accessToken });
}

export function listUsers(
  accessToken: string,
  { page = 0, size = 50 }: { page?: number; size?: number } = {},
): Promise<Page<User>> {
  const query = new URLSearchParams({ page: String(page), size: String(size), sort: "id,asc" });
  return request(`/api/v1/users?${query}`, { token: accessToken });
}

function request<T>(path: string, options?: RequestOptions): Promise<T> {
  return requestJson<T>(readServerEnv().userServiceUrl, path, options);
}
