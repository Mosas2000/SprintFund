import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { buildRootMetadata } from "@/lib/metadata-builder";
import { SITE_THEME_COLOR } from "@/types/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = buildRootMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: SITE_THEME_COLOR,
};

import { Providers } from "@/components/Providers";
import GlassBackground from "@/components/GlassBackground";
import ToastProvider from "@/components/ToastProvider";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

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
          <PWAInstallPrompt />
          <GlassBackground />
          <div className="relative z-0">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
