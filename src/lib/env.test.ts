import { describe, expect, it } from "vitest";

import { readServerEnv } from "@/lib/env";

const BOTH = {
  USER_SERVICE_URL: "http://localhost:8081/",
  TRAINER_SERVICE_URL: "http://localhost:8082",
};

describe("readServerEnv", () => {
  it("reads both service URLs and drops a trailing slash", () => {
    expect(readServerEnv(BOTH)).toEqual({
      userServiceUrl: "http://localhost:8081",
      trainerServiceUrl: "http://localhost:8082",
    });
  });

  it("fails clearly when a URL is missing", () => {
    expect(() => readServerEnv({ TRAINER_SERVICE_URL: "http://x" })).toThrow(
      "USER_SERVICE_URL is not set",
    );
    expect(() => readServerEnv({ USER_SERVICE_URL: "http://x" })).toThrow(
      "TRAINER_SERVICE_URL is not set",
    );
  });

  it("fails clearly when a URL is not a URL", () => {
    expect(() => readServerEnv({ ...BOTH, USER_SERVICE_URL: "localhost" })).toThrow(
      "must be a full URL",
    );
  });
});
