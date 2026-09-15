const shimmer = "animate-pulse rounded-full bg-zinc-800/80";

export function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="mb-6 aspect-[4/3] w-full animate-pulse rounded-3xl border border-zinc-800 bg-zinc-900" />
      <div className="flex items-center justify-between gap-4">
        <div className={`h-7 w-28 ${shimmer}`} />
        <div className={`h-4 w-20 ${shimmer}`} />
      </div>
      <div className={`mt-4 h-7 w-4/5 ${shimmer}`} />
      <div className={`mt-3 h-4 w-full ${shimmer}`} />
      <div className={`mt-2 h-4 w-2/3 ${shimmer}`} />
    </div>
  );
}

export function ProjectGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function FilterBarSkeleton() {
  return (
    <div className="mb-12 flex flex-wrap gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={`h-11 w-32 rounded-full ${shimmer}`} />
      ))}
    </div>
  );
}

/** Matches the shape of the project detail page above the fold. */
export function ProjectDetailSkeleton() {
  return (
    <div className="min-h-screen bg-black">
      <div className="relative h-[68vh] min-h-[480px] w-full animate-pulse overflow-hidden rounded-b-[60px] bg-zinc-900 sm:rounded-b-[100px] lg:rounded-b-[140px]" />
      <div className="mx-auto w-full max-w-7xl px-4 py-16 lg:px-20">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900"
            />
          ))}
        </div>
        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <div>
            <div className={`h-4 w-32 ${shimmer}`} />
            <div className={`mt-6 h-10 w-3/4 ${shimmer}`} />
            <div className={`mt-6 h-4 w-full ${shimmer}`} />
            <div className={`mt-3 h-4 w-full ${shimmer}`} />
            <div className={`mt-3 h-4 w-5/6 ${shimmer}`} />
            <div className={`mt-3 h-4 w-2/3 ${shimmer}`} />
          </div>
          <div className="h-[320px] animate-pulse rounded-3xl border border-zinc-800 bg-zinc-900 lg:h-[460px]" />
        </div>
      </div>
    </div>
  );
}
