/** Grey placeholder boxes shown while database content streams in. */
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="h-36 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
      ))}
    </div>
  );
}

export function TextSkeleton() {
  return (
    <div className="flex flex-col gap-3 py-12" aria-busy="true" aria-label="Loading">
      <div className="h-10 w-2/3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
      <div className="h-5 w-1/2 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
    </div>
  );
}
