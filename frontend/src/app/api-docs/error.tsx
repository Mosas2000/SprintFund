"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ApiDocsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[SprintFund] API Docs error:", error);
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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </div>

      <h2
        className="text-xl font-bold sm:text-2xl"
        style={{ color: "hsl(var(--foreground))" }}
      >
        API docs unavailable
      </h2>

      <p
        className="mt-2 max-w-sm text-sm"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        Could not render the API documentation. Please try again.
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
