"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[SprintFund] Profile error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div
        className="mb-6 rounded-full p-4"
        style={{ background: "hsl(var(--destructive) / 0.1)" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "hsl(var(--destructive))" }}
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>

      <h2
        className="text-xl font-bold sm:text-2xl"
        style={{ color: "hsl(var(--foreground))" }}
      >
        Profile unavailable
      </h2>

      <p
        className="mt-2 max-w-sm text-sm"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        Could not load your profile information. Please check your
        wallet connection and try again.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
          style={{
            background: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
          }}
        >
          Retry
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
          style={{
            borderColor: "hsl(var(--border))",
            color: "hsl(var(--foreground))",
          }}
        >
          Home
        </Link>
      </div>
    </div>
  );
}
