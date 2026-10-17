/**
 * Typed client for the SportsAura trainer service REST API: sports, trainer profiles and the
 * website text stored in the database. Server-side only (reads TRAINER_SERVICE_URL).
 */
import { nullIfNotFound, requestJson, type RequestOptions } from "@/lib/api-client";
import { readServerEnv } from "@/lib/env";
import type { Page } from "@/lib/user-service";

export type Sport = {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
  trainerCount: number;
};

export type SportSummary = Pick<Sport, "id" | "slug" | "name" | "icon">;

export type Trainer = {
  id: number;
  userId: number;
  displayName: string;
  headline: string;
  bio: string;
  city: string;
  experienceYears: number;
  hourlyRateInr: number;
  sports: SportSummary[];
  createdAt: string;
  updatedAt: string;
};

export type TrainerProfileInput = {
  displayName: string;
  headline: string;
  bio: string;
  city: string;
  /** null when the form field was left empty; the trainer service rejects it with a message. */
  experienceYears: number | null;
  hourlyRateInr: number | null;
  sportIds: number[];
};

export type ContentBlock = {
  title: string;
  body: string;
  icon: string | null;
  linkLabel: string | null;
  linkUrl: string | null;
};

/** All text for one page, by section key ("hero", "features", ...). */
export type PageContent = {
  page: string;
  sections: Record<string, ContentBlock[]>;
};

export function listSports(): Promise<Sport[]> {
  return request("/api/v1/sports");
}

export function searchTrainers({
  sport,
  city,
  page = 0,
  size = 24,
}: { sport?: string; city?: string; page?: number; size?: number } = {}): Promise<Page<Trainer>> {
  const query = new URLSearchParams({ page: String(page), size: String(size) });
  if (sport) {
    query.set("sport", sport);
  }
  if (city) {
    query.set("city", city);
  }
  return request(`/api/v1/trainers?${query}`);
}

/** A trainer's public profile, or null if there is no such (active) trainer. */
export function getTrainer(id: number): Promise<Trainer | null> {
  return nullIfNotFound(request(`/api/v1/trainers/${id}`));
}

export function getPageContent(page: string): Promise<PageContent> {
  return request(`/api/v1/content/${encodeURIComponent(page)}`);
}

/** The signed-in trainer's own profile, or null if they have not created one yet. */
export function getMyTrainerProfile(accessToken: string): Promise<Trainer | null> {
  return nullIfNotFound(request("/api/v1/trainers/me", { token: accessToken }));
}

export function saveMyTrainerProfile(
  accessToken: string,
  input: TrainerProfileInput,
): Promise<Trainer> {
  return request("/api/v1/trainers/me", { method: "PUT", body: input, token: accessToken });
}

function request<T>(path: string, options?: RequestOptions): Promise<T> {
  return requestJson<T>(readServerEnv().trainerServiceUrl, path, options);
}
