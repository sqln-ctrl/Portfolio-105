import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { apiError } from "@/lib/admin/http";
export async function GET() {
  try { const { client } = await requireAdmin(); const { data, error } = await client.from("admin_activity").select("*").order("created_at", { ascending: false }).limit(50); if (error) throw error; return NextResponse.json({ activity: data }, { headers: { "Cache-Control": "private, no-store" } }); }
  catch (error) { return apiError(error); }
}
