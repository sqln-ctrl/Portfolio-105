import "server-only";
import { cache } from "react";
import { createPublicClient, databaseConfigured } from "@/lib/supabase/server";
import { projects as seeds, type CaseStudy } from "./projects";
import { defaultSettings, type SiteSettings } from "./settings";
import { settingsSchema } from "@/lib/admin/validation";

export const getProjectsForSite = cache(async (): Promise<CaseStudy[]> => {
  if (!databaseConfigured()) return seeds.filter((p) => p.approved && p.status === "live").sort((a, b) => a.displayIndex - b.displayIndex);
  const { data, error } = await createPublicClient().from("projects").select("payload").eq("published", true).order("sort_order").order("slug");
  // Once configured, never resurrect a hidden/deleted project through seed fallback.
  if (error) { console.error("Public project query failed", error.code); return []; }
  return (data ?? []).map((row) => row.payload as CaseStudy);
});

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!databaseConfigured()) return defaultSettings;
  const { data, error } = await createPublicClient().from("site_settings").select("content").eq("id", "main").maybeSingle();
  if (error) console.error("Public settings query failed", error.code);
  const parsed = settingsSchema.safeParse(data?.content);
  return parsed.success ? parsed.data : defaultSettings;
});

export async function getProjectBySlugForSite(slug: string) { return (await getProjectsForSite()).find((p) => p.slug === slug); }
export async function getAdjacentProjectsForSite(slug: string) {
  const projects = await getProjectsForSite(); const index = projects.findIndex((p) => p.slug === slug);
  return { prev: index > 0 ? projects[index - 1] : null, next: index >= 0 && index < projects.length - 1 ? projects[index + 1] : null };
}
