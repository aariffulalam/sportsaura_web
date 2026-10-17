import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiError, toApiError } from "@/lib/api-client";
import { getMe, listUsers, login, logout } from "@/lib/user-service";

process.env.USER_SERVICE_URL = "http://users.test";
process.env.TRAINER_SERVICE_URL = "http://trainers.test";

function mockFetch(status: number, body?: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(body === undefined ? null : JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("user service client", () => {
  it("logs in with a JSON POST and returns the tokens", async () => {
    const fetchMock = mockFetch(200, { accessToken: "a", refreshToken: "r" });

    const result = await login({ email: "asha@example.com", password: "secret-password" });

    expect(result).toMatchObject({ accessToken: "a", refreshToken: "r" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("http://users.test/api/v1/auth/login");
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(init.body)).toEqual({
      email: "asha@example.com",
      password: "secret-password",
    });
  });

  it("sends the access token as a Bearer header", async () => {
    const fetchMock = mockFetch(200, { id: 1 });

    await getMe("token-123");

    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer token-123");
  });

  it("asks for users sorted by id, with paging", async () => {
    const fetchMock = mockFetch(200, { content: [], page: {} });

    await listUsers("t", { page: 2, size: 10 });

    expect(fetchMock.mock.calls[0][0]).toBe(
      "http://users.test/api/v1/users?page=2&size=10&sort=id%2Casc",
    );
  });

  it("returns nothing for 204 No Content", async () => {
    mockFetch(204);

    await expect(logout("r")).resolves.toBeUndefined();
  });

  it("turns an error response into an ApiError with the server's message", async () => {
    mockFetch(401, { status: 401, detail: "Invalid email or password" });

    const error = await login({ email: "x@example.com", password: "nope-nope" }).catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 401, message: "Invalid email or password" });
  });
});

describe("toApiError", () => {
  it("keeps field errors from a validation response", () => {
    const error = toApiError(400, {
      detail: "Validation failed",
      errors: { email: "Email must be a valid email address" },
    });

    expect(error.fieldErrors).toEqual({ email: "Email must be a valid email address" });
  });

  it("falls back to a generic message when the body is not problem details", () => {
    const error = toApiError(502, null);

    expect(error.message).toBe("Request failed with status 502");
    expect(error.fieldErrors).toEqual({});
  });
});
