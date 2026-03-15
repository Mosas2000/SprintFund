export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      {/* Avatar + name skeleton */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="h-16 w-16 rounded-full animate-pulse"
          style={{ background: "hsl(var(--muted))" }}
        />
        <div>
          <div
            className="h-6 w-40 rounded animate-pulse"
            style={{ background: "hsl(var(--muted))" }}
          />
          <div
            className="mt-2 h-4 w-56 rounded animate-pulse"
            style={{ background: "hsl(var(--muted))" }}
          />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border p-6"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div
              className="h-4 w-20 rounded animate-pulse mb-2"
              style={{ background: "hsl(var(--muted))" }}
            />
            <div
              className="h-8 w-12 rounded animate-pulse"
              style={{ background: "hsl(var(--muted))" }}
            />
          </div>
        ))}
      </div>

      {/* Activity skeleton */}
      <div
        className="rounded-xl border p-6"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        <div
          className="h-5 w-32 rounded animate-pulse mb-4"
          style={{ background: "hsl(var(--muted))" }}
        />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 py-3">
            <div
              className="h-8 w-8 rounded-full animate-pulse"
              style={{ background: "hsl(var(--muted))" }}
            />
            <div
              className="h-4 flex-1 rounded animate-pulse"
              style={{ background: "hsl(var(--muted))" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
