import { z } from "zod";

const text = (max = 200) => z.string().trim().max(max);
const publicUrl = z.string().trim().max(2048).refine((value) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|0\.|\[|169\.254\.)/i.test(url.hostname) && url.hostname.includes(".");
  } catch { return false; }
}, "Use a public HTTPS URL without credentials.");
const lines = z.array(text(3000)).max(30);

export const projectSchema = z.object({
  slug: z.string().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  title: text(160).min(2), category: text(100).min(2), serviceSlug: text(100),
  role: text(), timeline: text(100), year: z.string().regex(/^\d{4}$/),
  displayIndex: z.number().int().min(0).max(9999), typeTags: z.array(text(40)).max(12),
  status: z.enum(["draft", "live"]), approved: z.boolean(), featured: z.boolean(), primaryFeatured: z.boolean().optional(),
  outcome: text(1500), problem: text(10000), insight: text(10000), approach: lines, designDecisions: lines,
  technologies: z.array(text(80)).max(30), interactionDetail: text(5000).optional(), results: lines, reflection: text(10000),
  liveUrl: publicUrl.optional(), githubUrl: publicUrl.optional(), coverUrl: publicUrl.optional(),
  accent: z.enum(["gold", "cyan", "fog"]).optional(),
  sections: z.array(z.object({ id: z.string().uuid(), title: text(160).min(1), body: text(12000), layout: z.enum(["text", "split", "quote"]) })).max(30).optional(),
}).strict();

export const settingsSchema = z.object({
  heroEyebrow: text(120).min(1), heroLineOne: text(40).min(1), heroLineTwo: text(40).min(1), heroDescription: text(500).min(1),
  studioTagline: text(160).min(1), workHeading: text(100).min(1), workSubtitle: text(100).min(1),
  aboutStatement: text(600).min(1), footerHeading: text(100).min(1),
  homepageCount: z.number().int().min(0).max(12),
}).strict();

export const enquirySchema = z.object({
  id: z.string().uuid(), name: text(120).min(2), email: z.string().trim().email().max(254),
  company: text(160), service: text(100), budget: text(100), message: text(10000).min(20), website: text(300).max(0),
}).strict();

export const enquiryUpdateSchema = z.object({
  id: z.string().uuid(), status: z.enum(["new", "reviewing", "contacted", "closed", "archived"]), notes: text(10000),
}).strict();
