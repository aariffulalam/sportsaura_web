/**
 * Server-side settings, read from environment variables (.env locally).
 *
 * Only import this from server code (Server Components, Route Handlers, Server Actions, proxy).
 * Nothing here is sent to the browser, because none of the names start with NEXT_PUBLIC_.
 */
export type ServerEnv = {
  /** Base URL of the SportsAura user service, e.g. http://localhost:8081 */
  userServiceUrl: string;
  /** Base URL of the SportsAura trainer service, e.g. http://localhost:8082 */
  trainerServiceUrl: string;
};

export function readServerEnv(source: Record<string, string | undefined> = process.env): ServerEnv {
  return {
    userServiceUrl: requireUrl(source, "USER_SERVICE_URL"),
    trainerServiceUrl: requireUrl(source, "TRAINER_SERVICE_URL"),
  };
}

function requireUrl(source: Record<string, string | undefined>, name: string): string {
  const value = source[name]?.trim();
  if (!value) {
    throw new Error(`${name} is not set. Copy .env.example to .env and fill it in.`);
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} must be a full URL like http://localhost:8081, got "${value}".`);
  }
  return url.toString().replace(/\/$/, "");
}
