import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { projectSchema } from "@/lib/admin/validation";
import { apiError, checkOrigin, readBody } from "@/lib/admin/http";
export async function GET() {
  try { const { client } = await requireAdmin(); const { data, error } = await client.from("projects").select("*").order("sort_order").order("slug"); if (error) throw error; return NextResponse.json({ projects: data }, { headers: { "Cache-Control": "private, no-store" } }); }
  catch (error) { return apiError(error); }
}
export async function POST(request: Request) {
  try {
    checkOrigin(request); const { client } = await requireAdmin();
    const { project, expectedUpdatedAt } = z.object({ project: projectSchema, expectedUpdatedAt: z.string().nullable() }).parse(await readBody(request));
    const record = { slug: project.slug, payload: project, published: project.approved && project.status === "live", featured: project.featured, sort_order: project.displayIndex };
    const result = expectedUpdatedAt
      ? await client.from("projects").update(record).eq("slug", project.slug).eq("updated_at", expectedUpdatedAt).select().maybeSingle()
      : await client.from("projects").insert(record).select().single();
    if (result.error?.code === "23505" || (!result.error && !result.data)) return NextResponse.json({ error: "This project already exists or was edited elsewhere. Reload it before saving." }, { status: 409 });
    if (result.error) throw result.error;
    return NextResponse.json({ project: result.data });
  } catch (error) { return apiError(error); }
}
