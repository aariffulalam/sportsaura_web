import { describe, expect, it, vi } from "vitest";

import {
  ACCESS_EXPIRY_MARGIN_SECONDS,
  accessCookieMaxAge,
  sessionCookieOptions,
} from "@/features/auth/cookies";
import { safeRedirectPath, toFormState, UNREACHABLE_MESSAGE } from "@/features/auth/form-state";
import { refreshOnce } from "@/features/auth/refresh-once";
import { ApiError } from "@/lib/api-client";
import type { AuthResponse } from "@/lib/user-service";

describe("session cookies", () => {
  it("are httpOnly, same-site and site-wide", () => {
    expect(sessionCookieOptions(60, true)).toEqual({
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60,
    });
  });

  it("expire the access cookie a little before the token", () => {
    expect(accessCookieMaxAge(900)).toBe(900 - ACCESS_EXPIRY_MARGIN_SECONDS);
    expect(accessCookieMaxAge(5)).toBe(1);
  });
});

describe("toFormState", () => {
  it("shows the server's message and field errors, and keeps typed values", () => {
    const state = toFormState(new ApiError(400, "Validation failed", { email: "Bad email" }), {
      email: "x",
    });

    expect(state).toEqual({
      message: "Validation failed",
      errors: { email: "Bad email" },
      values: { email: "x" },
    });
  });

  it("shows a friendly message when the server cannot be reached", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(toFormState(new TypeError("fetch failed"), {})?.message).toBe(UNREACHABLE_MESSAGE);
  });
});

describe("safeRedirectPath", () => {
  it("allows paths on this site", () => {
    expect(safeRedirectPath("/admin/users")).toBe("/admin/users");
  });

  it.each([null, "", "https://evil.example", "//evil.example", "account"])(
    "falls back for %s",
    (value) => {
      expect(safeRedirectPath(value)).toBe("/dashboard");
    },
  );
});

describe("refreshOnce", () => {
  const tokens = { accessToken: "new" } as AuthResponse;

  it("sends one refresh call for requests that arrive together", async () => {
    const call = vi.fn().mockResolvedValue(tokens);

    const results = await Promise.all([
      refreshOnce("same-token", call),
      refreshOnce("same-token", call),
      refreshOnce("same-token", call),
    ]);

    expect(call).toHaveBeenCalledTimes(1);
    expect(results).toEqual([tokens, tokens, tokens]);
  });

  it("tries again after a failed refresh", async () => {
    const call = vi.fn().mockRejectedValueOnce(new Error("down")).mockResolvedValue(tokens);

    await expect(refreshOnce("flaky-token", call)).rejects.toThrow("down");
    await expect(refreshOnce("flaky-token", call)).resolves.toBe(tokens);
    expect(call).toHaveBeenCalledTimes(2);
  });

  it("forgets the result after the reuse window", async () => {
    const call = vi.fn().mockResolvedValue(tokens);
    let time = 1_000;

    await refreshOnce("old-token", call, () => time);
    time += 11_000;
    await refreshOnce("old-token", call, () => time);

    expect(call).toHaveBeenCalledTimes(2);
  });
});
