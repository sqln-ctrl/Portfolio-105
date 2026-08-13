import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://studio105.dev";

export const siteConfig = {
  name: "Studio 105",
  title: "Studio 105 — Design, Build & Ship",
  description:
    "Studio 105 is a creative-tech studio founded by Umer and Saqlain. We design, build, automate, and ship digital products with craft.",
  url: siteUrl,
  ogImage: `${siteUrl}/og-image.png`,
  locale: "en_US",
};

export function createPageMetadata({
  title,
  description,
  path = "",
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const desc = description ?? siteConfig.description;
  const url = `${siteConfig.url}${path}`;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} · Studio 105`,
      description: desc,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · Studio 105`,
      description: desc,
    },
  };
}
