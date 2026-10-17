import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { TextSkeleton } from "@/components/Skeleton";
import { SportChips } from "@/components/TrainerCard";
import { formatDate, formatInr } from "@/lib/format";
import { getTrainer } from "@/lib/trainer-service";

export const metadata: Metadata = { title: "Trainer · SportsAura" };

export default function TrainerPage({ params }: PageProps<"/trainers/[id]">) {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <Link href="/trainers" className="text-sm text-zinc-600 hover:underline">
        ← All trainers
      </Link>
      <Suspense fallback={<TextSkeleton />}>
        <TrainerDetails params={params} />
      </Suspense>
    </main>
  );
}

async function TrainerDetails({ params }: Pick<PageProps<"/trainers/[id]">, "params">) {
  const { id } = await params;
  const trainerId = Number(id);
  const trainer = Number.isInteger(trainerId) && trainerId > 0 ? await getTrainer(trainerId) : null;
  if (!trainer) {
    notFound();
  }

  const facts: [string, string][] = [
    ["City", trainer.city],
    ["Experience", `${trainer.experienceYears} years`],
    ["Price", `${formatInr(trainer.hourlyRateInr)} per hour`],
    ["On SportsAura since", formatDate(trainer.createdAt)],
  ];

  return (
    <article className="mt-6 flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">{trainer.displayName}</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">{trainer.headline}</p>
        <SportChips sports={trainer.sports} />
      </header>
      <dl className="grid grid-cols-2 gap-4 rounded-xl border border-zinc-200 p-5 sm:grid-cols-4 dark:border-zinc-800">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-zinc-500">{label}</dt>
            <dd className="font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <section>
        <h2 className="mb-2 text-lg font-semibold">About</h2>
        <p className="leading-relaxed whitespace-pre-line text-zinc-700 dark:text-zinc-300">
          {trainer.bio}
        </p>
      </section>
      <p className="rounded-xl bg-zinc-50 p-4 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
        Online booking is coming soon.
      </p>
    </article>
  );
}
