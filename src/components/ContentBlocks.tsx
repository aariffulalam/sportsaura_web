/**
 * Renders website text that comes from the database (trainer service, content_blocks table).
 * Editing a row there changes these sections without a new release.
 */
import Link from "next/link";

import type { ContentBlock } from "@/lib/trainer-service";

/** A big heading with intro text and an optional button. Uses the first block of a section. */
export function HeroBlock({ blocks }: { blocks?: ContentBlock[] }) {
  const block = blocks?.[0];
  if (!block) {
    return null;
  }
  return (
    <section className="flex flex-col gap-5 py-12">
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">{block.title}</h1>
      <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">{block.body}</p>
      <BlockLink block={block} primary />
    </section>
  );
}

/** A grid of cards, one per block: icon, title, text and optional link. */
export function BlockGrid({ blocks, heading }: { blocks?: ContentBlock[]; heading?: string }) {
  if (!blocks?.length) {
    return null;
  }
  return (
    <section className="py-8">
      {heading ? <h2 className="mb-5 text-2xl font-semibold tracking-tight">{heading}</h2> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blocks.map((block) => (
          <div
            key={block.title}
            className="flex flex-col gap-2 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
          >
            {block.icon ? (
              <span className="text-2xl" aria-hidden>
                {block.icon}
              </span>
            ) : null}
            <h3 className="font-semibold">{block.title}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{block.body}</p>
            <BlockLink block={block} />
          </div>
        ))}
      </div>
    </section>
  );
}

/** A highlighted box with a call to action. Uses the first block of a section. */
export function CallToAction({ blocks }: { blocks?: ContentBlock[] }) {
  const block = blocks?.[0];
  if (!block) {
    return null;
  }
  return (
    <section className="my-10 flex flex-col items-start gap-3 rounded-2xl bg-emerald-50 p-8 dark:bg-emerald-950/40">
      <h2 className="text-2xl font-semibold tracking-tight">{block.title}</h2>
      <p className="max-w-xl text-zinc-700 dark:text-zinc-300">{block.body}</p>
      <BlockLink block={block} primary />
    </section>
  );
}

function BlockLink({ block, primary = false }: { block: ContentBlock; primary?: boolean }) {
  if (!block.linkUrl || !block.linkLabel) {
    return null;
  }
  return (
    <Link
      href={block.linkUrl}
      className={
        primary
          ? "mt-1 inline-flex w-fit rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          : "mt-auto text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
      }
    >
      {block.linkLabel}
    </Link>
  );
}
