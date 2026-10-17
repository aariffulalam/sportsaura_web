import Link from "next/link";

import type { Sport } from "@/lib/trainer-service";

/** A sport with its icon and trainer count. Links to the trainers who teach it. */
export function SportCard({
  sport,
  showDescription = true,
}: {
  sport: Sport;
  showDescription?: boolean;
}) {
  return (
    <Link
      href={`/trainers?sport=${sport.slug}`}
      className="flex flex-col gap-2 rounded-xl border border-zinc-200 p-5 transition hover:border-emerald-500 hover:shadow-sm dark:border-zinc-800"
    >
      <span className="text-3xl" aria-hidden>
        {sport.icon}
      </span>
      <span className="font-semibold">{sport.name}</span>
      {showDescription ? (
        <span className="text-sm text-zinc-600 dark:text-zinc-400">{sport.description}</span>
      ) : null}
      <span className="mt-auto text-xs font-medium text-emerald-700 dark:text-emerald-400">
        {sport.trainerCount === 1 ? "1 trainer" : `${sport.trainerCount} trainers`}
      </span>
    </Link>
  );
}
