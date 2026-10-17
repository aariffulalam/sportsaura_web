"use client";

/** Shown when a page fails, for example because a backend service is not running. */
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-start justify-center gap-4 px-6 py-24">
      <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        We could not load this page right now. Please try again in a moment.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        Try again
      </button>
    </main>
  );
}
