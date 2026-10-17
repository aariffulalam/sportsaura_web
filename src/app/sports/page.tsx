import { connection } from "next/server";
import type { Metadata } from "next";
import { Suspense } from "react";

import { CardGridSkeleton } from "@/components/Skeleton";
import { SportCard } from "@/components/SportCard";
import { listSports } from "@/lib/trainer-service";

export const metadata: Metadata = { title: "Sports · SportsAura" };

export default function SportsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Sports</h1>
      <p className="mb-8 text-zinc-600 dark:text-zinc-400">
        Choose a sport to see the trainers who teach it.
      </p>
      <Suspense fallback={<CardGridSkeleton count={8} />}>
        <SportGrid />
      </Suspense>
    </main>
  );
}

async function SportGrid() {
  // Data comes from the trainer service on every request, never at build time.
  await connection();
  const sports = await listSports();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {sports.map((sport) => (
        <SportCard key={sport.id} sport={sport} />
      ))}
    </div>
  );
}
