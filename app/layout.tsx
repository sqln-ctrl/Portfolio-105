import type { Metadata } from "next";
import Script from "next/script";
import { DM_Sans, Instrument_Serif, JetBrains_Mono, Syne } from "next/font/google";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { SiteLoader } from "@/components/motion/SiteLoader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LOADER_BLOCK_SCRIPT } from "@/lib/loader/loader-gate";
import { siteConfig } from "@/lib/seo/metadata";
import "@/styles/globals.css";

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
    template: "%s · Studio 105",
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
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <Script id="studio105-loader-block" strategy="beforeInteractive">
          {LOADER_BLOCK_SCRIPT}
        </Script>
      </head>
      <body className="min-h-dvh antialiased" suppressHydrationWarning>
        <div id="site-loader-static" className="site-loader-static" aria-hidden="true">
          <div className="site-loader-static__inner">
            <p className="site-loader-static__brand">Studio 105</p>
            <span className="site-loader-static__mark">105</span>
          </div>
        </div>

        <SiteLoader />

        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <LenisProvider>
          <div id="site-app">
            <CustomCursor />
            <SiteHeader />
            <main id="main-content">{children}</main>
            <SiteFooter />
          </div>
        </LenisProvider>
      </body>
    </html>
  );
}
