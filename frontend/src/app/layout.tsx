import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { buildRootMetadata } from "@/lib/metadata-builder";
import { SITE_THEME_COLOR } from "@/types/seo";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  fallback: ["system-ui", "sans-serif"],
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  fallback: ["monospace"],
});

export const metadata: Metadata = buildRootMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: SITE_THEME_COLOR,
};

import { Providers } from "@/components/Providers";
import GlassBackground from "@/components/common/GlassBackground";
import ToastProvider from "@/components/common/ToastProvider";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { GovernanceNotificationManager } from "@/components/GovernanceNotificationManager";

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
          <GovernanceNotificationManager contractPrincipal="SP2ZNGJ85ENDY6QTHQ0YCWM1GRFX77YXF1W8F25J9.sprint-fund" />
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
