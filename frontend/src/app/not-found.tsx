"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="relative">
        <h1
          className="text-[8rem] font-black leading-none tracking-tighter sm:text-[12rem]"
          style={{ color: "hsl(var(--primary))" }}
        >
          404
        </h1>
        <div
          className="absolute inset-0 blur-3xl opacity-20"
          style={{ background: "hsl(var(--primary))" }}
        />
      </div>

      <h2
        className="mt-4 text-2xl font-bold sm:text-3xl"
        style={{ color: "hsl(var(--foreground))" }}
      >
        Page not found
      </h2>

      <p
        className="mt-3 max-w-md text-base"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        The page you are looking for does not exist or has been moved.
        Check the URL or head back to the homepage.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
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
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        Back to Home
      </Link>
    </div>
  );
}
