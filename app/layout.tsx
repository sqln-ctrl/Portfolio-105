import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif, JetBrains_Mono, Syne } from "next/font/google";
import { SiteShell } from "@/components/loopcodez/SiteShell";
import { SiteFooter } from "@/components/layout/SiteFooter";

import { siteConfig } from "@/lib/seo/metadata";
import "@/styles/globals.css";
import "@/styles/loopcodez.css";
import "@/styles/inner-pages.css";
import "@/styles/admin.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: "%s · Loopcodez",
  },
  description: siteConfig.description,
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-dvh antialiased" suppressHydrationWarning>

        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <SiteShell footer={<SiteFooter />}>{children}</SiteShell>
      </body>
    </html>
  );
}


