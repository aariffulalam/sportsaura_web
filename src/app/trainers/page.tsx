import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { CardGridSkeleton } from "@/components/Skeleton";
import { TrainerCard } from "@/components/TrainerCard";
import { listSports, searchTrainers } from "@/lib/trainer-service";

export const metadata: Metadata = { title: "Trainers · SportsAura" };

/** Public list of trainers. Filters live in the URL (?sport=yoga&city=Pune), so links can be shared. */
export default function TrainersPage({ searchParams }: PageProps<"/trainers">) {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Find a trainer</h1>
      <Suspense fallback={<CardGridSkeleton />}>
        <TrainerResults searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function TrainerResults({ searchParams }: Pick<PageProps<"/trainers">, "searchParams">) {
  const params = await searchParams;
  const sport = single(params.sport);
  const city = single(params.city);
  const [sports, trainers] = await Promise.all([listSports(), searchTrainers({ sport, city })]);
  const sportName = sports.find((item) => item.slug === sport)?.name;

  return (
    <>
      {/* A plain GET form: works without JavaScript and puts the filters in the URL. */}
      <form className="mb-8 flex flex-wrap items-end gap-3" action="/trainers">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Sport
          <select
            name="sport"
            defaultValue={sport ?? ""}
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="">All sports</option>
            {sports.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.icon} {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          City
          <input
            name="city"
            defaultValue={city ?? ""}
            placeholder="Any city"
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Search
        </button>
        {sport || city ? (
          <Link href="/trainers" className="py-2 text-sm text-zinc-600 hover:underline">
            Clear filters
          </Link>
        ) : null}
      </form>

      <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
        {trainers.page.totalElements} {trainers.page.totalElements === 1 ? "trainer" : "trainers"}
        {sportName ? ` for ${sportName}` : ""}
        {city ? ` in ${city}` : ""}
      </p>

      {trainers.content.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-zinc-600 dark:border-zinc-700">
          No trainers match these filters yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trainers.content.map((trainer) => (
            <TrainerCard key={trainer.id} trainer={trainer} />
          ))}
        </div>
      )}
    </>
  );
}

function single(value: string | string[] | undefined): string | undefined {
  const text = Array.isArray(value) ? value[0] : value;
  return text?.trim() || undefined;
}
