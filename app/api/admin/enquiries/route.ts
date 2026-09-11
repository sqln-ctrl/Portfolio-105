import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { enquiryUpdateSchema } from "@/lib/admin/validation";
import { apiError, checkOrigin, readBody } from "@/lib/admin/http";
export async function GET(request: Request) {
  try {
    const { client } = await requireAdmin();
    const page = Math.floor(Math.max(0, Math.min(10000, Number(new URL(request.url).searchParams.get("page")) || 0)));
    const { data, error, count } = await client.from("enquiries").select("*", { count: "exact" }).order("created_at", { ascending: false }).range(page * 50, page * 50 + 49);
    if (error) throw error; return NextResponse.json({ enquiries: data, count }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) { return apiError(error); }
}
export async function PATCH(request: Request) {
  try {
    checkOrigin(request); const { client } = await requireAdmin();
    const { id, status, notes } = enquiryUpdateSchema.parse(await readBody(request, 16000));
    const { data, error } = await client.from("enquiries").update({ status, notes }).eq("id", id).select().maybeSingle();
    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
    return NextResponse.json({ enquiry: data });
  } catch (error) { return apiError(error); }
}
