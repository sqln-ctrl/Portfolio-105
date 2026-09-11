import { NextResponse } from "next/server";
import { z } from "zod";
import { createSessionClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/admin/auth";
import { apiError, checkOrigin, readBody } from "@/lib/admin/http";
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const input = z.object({ email: z.string().email().max(254), password: z.string().min(1).max(256) }).parse(await readBody(request, 2000));
    const client = await createSessionClient();
    const { error } = await client.auth.signInWithPassword(input);
    if (error || !(await getAdminSession())) { await client.auth.signOut(); return NextResponse.json({ error: "Email or password is incorrect, or this account does not have studio access." }, { status: 401 }); }
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return apiError(error); }
}
