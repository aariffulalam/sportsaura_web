import { connection } from "next/server";
import Link from "next/link";
import { Suspense } from "react";

import { BlockGrid, CallToAction, HeroBlock } from "@/components/ContentBlocks";
import { TextSkeleton } from "@/components/Skeleton";
import { SportCard } from "@/components/SportCard";
import { TrainerCard } from "@/components/TrainerCard";
import { getPageContent, listSports, searchTrainers } from "@/lib/trainer-service";

/** Public home page. All text, sports and trainers come from the trainer service's database. */
export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6">
      <Suspense fallback={<TextSkeleton />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}

async function HomeContent() {
  // Data comes from the trainer service on every request, never at build time.
  await connection();
  const [content, sports, trainers] = await Promise.all([
    getPageContent("home"),
    listSports(),
    searchTrainers({ size: 3 }),
  ]);
  const { sections } = content;

  return (
    <>
      <HeroBlock blocks={sections.hero} />
      <BlockGrid blocks={sections.features} />

      <section className="py-8">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Sports</h2>
          <Link href="/sports" className="text-sm font-medium text-emerald-700 hover:underline">
            All sports
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {sports.map((sport) => (
            <SportCard key={sport.id} sport={sport} showDescription={false} />
          ))}
        </div>
      </section>

      {trainers.content.length > 0 ? (
        <section className="py-8">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Meet our trainers</h2>
            <Link href="/trainers" className="text-sm font-medium text-emerald-700 hover:underline">
              See all {trainers.page.totalElements}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trainers.content.map((trainer) => (
              <TrainerCard key={trainer.id} trainer={trainer} />
            ))}
          </div>
        </section>
      ) : null}

      <CallToAction blocks={sections.cta} />
    </>
  );
}
