import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { interDisplay, unbounded } from "./fonts";
import { temaScript } from "./tema-script";
import { SITE_URL } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "reela music",
  description: "reela music. selo de trap e r&b. de novo, até amanhecer.",
  openGraph: { title: "reela music", description: "selo de trap e r&b. de novo, até amanhecer.", locale: "pt_BR", type: "website", images: [{ url: "/og.png", width: 1200, height: 630, alt: "reela music" }] },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-tema="madrugada" className={`${unbounded.variable} ${interDisplay.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: temaScript }} />
      </head>
      <body>{children}<Analytics /></body>
    </html>
  );
}
