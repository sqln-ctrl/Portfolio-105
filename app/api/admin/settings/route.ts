import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { settingsSchema } from "@/lib/admin/validation";
import { defaultSettings } from "@/lib/content/settings";
import { apiError, checkOrigin, readBody } from "@/lib/admin/http";
export async function GET() {
  try { const { client } = await requireAdmin(); const { data, error } = await client.from("site_settings").select("*").eq("id", "main").maybeSingle(); if (error) throw error; return NextResponse.json({ content: data?.content ?? defaultSettings, updatedAt: data?.updated_at ?? null }, { headers: { "Cache-Control": "private, no-store" } }); }
  catch (error) { return apiError(error); }
}
export async function POST(request: Request) {
  try {
    checkOrigin(request); const { client } = await requireAdmin();
    const { content, expectedUpdatedAt } = z.object({ content: settingsSchema, expectedUpdatedAt: z.string().nullable() }).parse(await readBody(request, 12000));
    const record = { id: "main", content };
    const { data, error } = expectedUpdatedAt
      ? await client.from("site_settings").update(record).eq("id", "main").eq("updated_at", expectedUpdatedAt).select().maybeSingle()
      : await client.from("site_settings").insert(record).select().single();
    if (error?.code === "23505" || (!error && !data)) return NextResponse.json({ error: "Settings changed elsewhere. Refresh before saving." }, { status: 409 });
    if (error) throw error;
    return NextResponse.json({ content: data.content, updatedAt: data.updated_at });
  } catch (error) { return apiError(error); }
}
