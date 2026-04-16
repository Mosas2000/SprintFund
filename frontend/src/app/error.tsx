"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[SprintFund] Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="relative">
        <h1
          className="text-[8rem] font-black leading-none tracking-tighter sm:text-[12rem]"
          style={{ color: "hsl(var(--destructive))" }}
        >
          500
        </h1>
        <div
          className="absolute inset-0 blur-3xl opacity-20"
          style={{ background: "hsl(var(--destructive))" }}
        />
      </div>

      <h2
        className="mt-4 text-2xl font-bold sm:text-3xl"
        style={{ color: "hsl(var(--foreground))" }}
      >
        Something went wrong
      </h2>

      <p
        className="mt-3 max-w-md text-base"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        An unexpected error occurred. This has been logged and our team
        will look into it. You can try again or return to the homepage.
      </p>

      {error.digest && (
        <p
          className="mt-2 font-mono text-xs"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          Error ID: {error.digest}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
          style={{
            background: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Try Again
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
          style={{
            borderColor: "hsl(var(--border))",
            color: "hsl(var(--foreground))",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
