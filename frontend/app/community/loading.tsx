export default function CommunityLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <div
          className="h-8 w-44 rounded animate-pulse"
          style={{ background: "hsl(var(--muted))" }}
        />
        <div
          className="mt-2 h-4 w-64 rounded animate-pulse"
          style={{ background: "hsl(var(--muted))" }}
        />
      </div>

      {/* Members grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-xl border p-5"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-full animate-pulse"
                style={{ background: "hsl(var(--muted))" }}
              />
              <div>
                <div
                  className="h-4 w-28 rounded animate-pulse"
                  style={{ background: "hsl(var(--muted))" }}
                />
                <div
                  className="mt-1 h-3 w-20 rounded animate-pulse"
                  style={{ background: "hsl(var(--muted))" }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
