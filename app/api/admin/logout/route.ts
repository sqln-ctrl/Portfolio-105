import { NextResponse } from "next/server";
import { createSessionClient } from "@/lib/supabase/server";
import { apiError, checkOrigin } from "@/lib/admin/http";
export async function POST(request: Request) {
  try { checkOrigin(request); const client = await createSessionClient(); await client.auth.signOut(); return NextResponse.json({ ok: true }); }
  catch (error) { return apiError(error); }
}
