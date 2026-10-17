import { connection } from "next/server";
import type { Metadata } from "next";
import { Suspense } from "react";

import { BlockGrid, HeroBlock } from "@/components/ContentBlocks";
import { TextSkeleton } from "@/components/Skeleton";
import { getPageContent } from "@/lib/trainer-service";

export const metadata: Metadata = { title: "How it works · SportsAura" };

export default function HowItWorksPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6">
      <Suspense fallback={<TextSkeleton />}>
        <HowItWorksContent />
      </Suspense>
    </main>
  );
}

async function HowItWorksContent() {
  // Data comes from the trainer service on every request, never at build time.
  await connection();
  const { sections } = await getPageContent("how-it-works");
  return (
    <>
      <HeroBlock blocks={sections.intro} />
      <BlockGrid heading="For players" blocks={sections.players} />
      <BlockGrid heading="For trainers" blocks={sections.trainers} />
    </>
  );
}
