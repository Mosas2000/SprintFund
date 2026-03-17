"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ProposalsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[SprintFund] Proposals error:", error);
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
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h2
        className="text-xl font-bold sm:text-2xl"
        style={{ color: "hsl(var(--foreground))" }}
      >
        Failed to load proposals
      </h2>

      <p
        className="mt-2 max-w-sm text-sm"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        There was an error loading the proposals page. This could be a
        temporary issue with the blockchain API.
      </p>

      {error.digest && (
        <p
          className="mt-2 font-mono text-xs"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          Error ID: {error.digest}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
          style={{
            background: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
          }}
        >
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
          style={{
            borderColor: "hsl(var(--border))",
            color: "hsl(var(--foreground))",
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
