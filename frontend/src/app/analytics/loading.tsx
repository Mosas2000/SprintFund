export default function AnalyticsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <div
          className="h-8 w-52 rounded animate-pulse"
          style={{ background: "hsl(var(--muted))" }}
        />
        <div
          className="mt-2 h-4 w-72 rounded animate-pulse"
          style={{ background: "hsl(var(--muted))" }}
        />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border p-6"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div
              className="h-4 w-24 rounded animate-pulse mb-2"
              style={{ background: "hsl(var(--muted))" }}
            />
            <div
              className="h-8 w-16 rounded animate-pulse"
              style={{ background: "hsl(var(--muted))" }}
            />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl border p-6"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div
              className="h-5 w-36 rounded animate-pulse mb-4"
              style={{ background: "hsl(var(--muted))" }}
            />
            <div
              className="h-48 w-full rounded animate-pulse"
              style={{ background: "hsl(var(--muted))" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
