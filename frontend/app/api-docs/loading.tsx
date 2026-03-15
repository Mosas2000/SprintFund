export default function ApiDocsLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <div
          className="h-8 w-40 rounded animate-pulse"
          style={{ background: "hsl(var(--muted))" }}
        />
        <div
          className="mt-2 h-4 w-80 rounded animate-pulse"
          style={{ background: "hsl(var(--muted))" }}
        />
      </div>

      {/* Endpoint list skeleton */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="mb-4 rounded-xl border p-5"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="h-6 w-14 rounded animate-pulse"
              style={{ background: "hsl(var(--muted))" }}
            />
            <div
              className="h-4 w-48 rounded animate-pulse"
              style={{ background: "hsl(var(--muted))" }}
            />
          </div>
          <div
            className="h-3 w-full rounded animate-pulse"
            style={{ background: "hsl(var(--muted))" }}
          />
        </div>
      ))}
    </div>
  );
}
