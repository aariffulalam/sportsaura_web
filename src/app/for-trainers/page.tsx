import { connection } from "next/server";
import type { Metadata } from "next";
import { Suspense } from "react";

import { BlockGrid, CallToAction, HeroBlock } from "@/components/ContentBlocks";
import { TextSkeleton } from "@/components/Skeleton";
import { getPageContent } from "@/lib/trainer-service";

export const metadata: Metadata = { title: "For trainers · SportsAura" };

export default function ForTrainersPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6">
      <Suspense fallback={<TextSkeleton />}>
        <ForTrainersContent />
      </Suspense>
    </main>
  );
}

async function ForTrainersContent() {
  // Data comes from the trainer service on every request, never at build time.
  await connection();
  const { sections } = await getPageContent("for-trainers");
  return (
    <>
      <HeroBlock blocks={sections.hero} />
      <BlockGrid heading="Why trainers choose SportsAura" blocks={sections.benefits} />
      <CallToAction blocks={sections.cta} />
    </>
  );
}
