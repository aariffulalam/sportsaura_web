import Link from "next/link";

import { formatInr } from "@/lib/format";
import type { Trainer } from "@/lib/trainer-service";

/** A trainer summary: name, headline, city, experience, price and sports. */
export function TrainerCard({ trainer }: { trainer: Trainer }) {
  return (
    <Link
      href={`/trainers/${trainer.id}`}
      className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-5 transition hover:border-emerald-500 hover:shadow-sm dark:border-zinc-800"
    >
      <div>
        <p className="font-semibold">{trainer.displayName}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{trainer.headline}</p>
      </div>
      <SportChips sports={trainer.sports} />
      <dl className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <div>
          <dt className="sr-only">City</dt>
          <dd>📍 {trainer.city}</dd>
        </div>
        <div>
          <dt className="sr-only">Experience</dt>
          <dd>{trainer.experienceYears} yrs experience</dd>
        </div>
        <div>
          <dt className="sr-only">Price</dt>
          <dd className="font-semibold">{formatInr(trainer.hourlyRateInr)}/hr</dd>
        </div>
      </dl>
    </Link>
  );
}

export function SportChips({ sports }: { sports: Trainer["sports"] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {sports.map((sport) => (
        <li
          key={sport.id}
          className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium dark:bg-zinc-800"
        >
          {sport.icon} {sport.name}
        </li>
      ))}
    </ul>
  );
}
