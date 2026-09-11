import "server-only";
import { createSessionClient, databaseConfigured } from "@/lib/supabase/server";

export async function getAdminSession() {
  if (!databaseConfigured()) return null;
  const client = await createSessionClient();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return null;
  const { data: member } = await client.from("admin_members").select("user_id, role").eq("user_id", user.id).eq("active", true).maybeSingle();
  return member ? { id: user.id, email: user.email ?? "", role: member.role as "owner" | "editor" } : null;
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return { session, client: await createSessionClient() };
}
