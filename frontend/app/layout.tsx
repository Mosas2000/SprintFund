import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SprintFund - Fund ideas in 24 hours",
  description: "Lightning-fast micro-grants DAO on Stacks blockchain with quadratic voting",
  manifest: "/manifest.json",
  themeColor: "#EA580C",
};

import { Providers } from "@/components/Providers";
import GlassBackground from "@/components/GlassBackground";
import ToastProvider from "@/components/ToastProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-orange-500/30`}
      >
        <Providers>
          <ToastProvider />
          <GlassBackground />
          <div className="relative z-0">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
