import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getMyTrainerProfile,
  getPageContent,
  getTrainer,
  saveMyTrainerProfile,
  searchTrainers,
} from "@/lib/trainer-service";

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

describe("trainer service client", () => {
  it("searches trainers with only the filters that are set", async () => {
    const fetchMock = mockFetch(200, { content: [], page: {} });

    await searchTrainers({ sport: "yoga" });

    expect(fetchMock.mock.calls[0][0]).toBe(
      "http://trainers.test/api/v1/trainers?page=0&size=24&sport=yoga",
    );
  });

  it("returns null for an unknown trainer instead of throwing", async () => {
    mockFetch(404, { status: 404, detail: "Trainer 9 not found" });

    await expect(getTrainer(9)).resolves.toBeNull();
  });

  it("returns null when the trainer has no profile yet", async () => {
    mockFetch(404, { status: 404, detail: "You have not created a trainer profile yet" });

    await expect(getMyTrainerProfile("token")).resolves.toBeNull();
  });

  it("still throws other errors, such as the service being down", async () => {
    mockFetch(500, { status: 500, detail: "Something went wrong" });

    await expect(getPageContent("home")).rejects.toMatchObject({ status: 500 });
  });

  it("saves the profile with PUT and the access token", async () => {
    const fetchMock = mockFetch(200, { id: 1 });

    await saveMyTrainerProfile("token-1", {
      displayName: "Rahul",
      headline: "Coach",
      bio: "Bio",
      city: "Mumbai",
      experienceYears: 8,
      hourlyRateInr: 900,
      sportIds: [1, 6],
    });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("http://trainers.test/api/v1/trainers/me");
    expect(init.method).toBe("PUT");
    expect(init.headers.Authorization).toBe("Bearer token-1");
    expect(JSON.parse(init.body).sportIds).toEqual([1, 6]);
  });
});
