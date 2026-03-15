export default function ProposalsLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      {/* Header skeleton */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div
            className="h-8 w-40 rounded animate-pulse"
            style={{ background: "hsl(var(--muted))" }}
          />
          <div
            className="mt-2 h-4 w-64 rounded animate-pulse"
            style={{ background: "hsl(var(--muted))" }}
          />
        </div>
        <div
          className="h-10 w-36 rounded-lg animate-pulse"
          style={{ background: "hsl(var(--muted))" }}
        />
      </div>

      {/* Filter skeleton */}
      <div className="mb-6 flex gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-10 w-20 rounded-md animate-pulse"
            style={{ background: "hsl(var(--muted))" }}
          />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-xl border p-6"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div
              className="h-5 w-3/4 rounded animate-pulse"
              style={{ background: "hsl(var(--muted))" }}
            />
            <div
              className="mt-3 h-4 w-full rounded animate-pulse"
              style={{ background: "hsl(var(--muted))" }}
            />
            <div
              className="mt-2 h-4 w-2/3 rounded animate-pulse"
              style={{ background: "hsl(var(--muted))" }}
            />
            <div className="mt-4 flex gap-2">
              <div
                className="h-6 w-16 rounded animate-pulse"
                style={{ background: "hsl(var(--muted))" }}
              />
              <div
                className="h-6 w-16 rounded animate-pulse"
                style={{ background: "hsl(var(--muted))" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
