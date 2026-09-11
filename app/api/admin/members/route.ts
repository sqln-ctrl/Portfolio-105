import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { apiError, checkOrigin, readBody } from "@/lib/admin/http";
import { createServiceClient } from "@/lib/supabase/server";

async function requireOwner() {
  const { session } = await requireAdmin();
  if (session.role !== "owner") throw new Error("FORBIDDEN");
  return createServiceClient();
}
export async function GET() {
  try {
    const client = await requireOwner();
    const { data, error } = await client.rpc("studio_member_directory");
    if (error) throw error;
    return NextResponse.json({ members: data }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) { return apiError(error); }
}
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const client = await requireOwner();
    const input = z.object({ email: z.string().trim().email().max(254), password: z.string().min(12).max(128).optional() }).strict().parse(await readBody(request, 2000));
    const email = input.email.toLowerCase();
    // Existing Auth users keep their password. New users need an owner-provided password.
    const { data: existing, error: lookupError } = await client.rpc("studio_find_auth_user", { p_email: email });
    if (lookupError) throw lookupError;
    let id = existing as string | null;
    if (!id) {
      if (!input.password) return NextResponse.json({ error: "This email has no account yet. Provide a password of at least 12 characters to create one." }, { status: 400 });
      const { data, error } = await client.auth.admin.createUser({ email, password: input.password, email_confirm: true });
      if (error || !data.user) return NextResponse.json({ error: "The account could not be created. Check the email and password requirements, then try again." }, { status: 400 });
      id = data.user.id;
    }
    const { data: member, error: memberError } = await client.from("admin_members").select("role").eq("user_id", id).maybeSingle();
    if (memberError) throw memberError;
    if (member?.role === "owner") return NextResponse.json({ error: "This account is already a super admin." }, { status: 409 });
    const { error } = member
      ? await client.from("admin_members").update({ active: true }).eq("user_id", id).eq("role", "editor")
      : await client.from("admin_members").insert({ user_id: id, role: "editor", active: true });
    if (error) throw error;
    return NextResponse.json({ message: "Admin access is active. Share the login details privately; no email has been sent." });
  } catch (error) { return apiError(error); }
}
export async function PATCH(request: Request) {
  try {
    checkOrigin(request);
    const client = await requireOwner();
    const input = z.object({ userId: z.string().uuid(), active: z.boolean() }).strict().parse(await readBody(request, 1000));
    // Owners cannot be disabled, demoted, or created from this endpoint.
    const { data, error } = await client.from("admin_members").update({ active: input.active }).eq("user_id", input.userId).eq("role", "editor").select("user_id").maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("FORBIDDEN");
    return NextResponse.json({ ok: true });
  } catch (error) { return apiError(error); }
}
