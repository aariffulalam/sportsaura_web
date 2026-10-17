import { describe, expect, it } from "vitest";

import { readServerEnv } from "@/lib/env";

describe("readServerEnv", () => {
  it("reads the user service URL and drops a trailing slash", () => {
    expect(readServerEnv({ USER_SERVICE_URL: "http://localhost:8081/" })).toEqual({
      userServiceUrl: "http://localhost:8081",
    });
  });

  it("fails clearly when the URL is missing", () => {
    expect(() => readServerEnv({})).toThrow("USER_SERVICE_URL is not set");
  });

  it("fails clearly when the URL is not a URL", () => {
    expect(() => readServerEnv({ USER_SERVICE_URL: "localhost" })).toThrow("must be a full URL");
  });
});
