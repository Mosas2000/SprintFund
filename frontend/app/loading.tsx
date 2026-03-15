export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="relative flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="relative h-16 w-16">
          <div
            className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
            style={{
              borderColor: "hsl(var(--border))",
              borderTopColor: "hsl(var(--primary))",
            }}
          />
          <div
            className="absolute inset-2 rounded-full border-4 border-t-transparent animate-spin"
            style={{
              borderColor: "hsl(var(--border))",
              borderTopColor: "hsl(var(--primary))",
              animationDirection: "reverse",
              animationDuration: "0.6s",
            }}
          />
        </div>

        {/* Label */}
        <p
          className="text-sm font-medium animate-pulse"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          Loading SprintFund...
        </p>

        {/* Glow effect */}
        <div
          className="absolute -inset-10 rounded-full blur-3xl opacity-10"
          style={{ background: "hsl(var(--primary))" }}
        />
      </div>
    </div>
  );
}
