import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PaletteProvider } from "@/components/PaletteProvider";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "Gym Tracker",
  description: "Track your workouts offline",
  manifest: "/gym-tracker/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Gym Tracker",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "var(--md-sys-color-primary)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
        <PaletteProvider />
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}