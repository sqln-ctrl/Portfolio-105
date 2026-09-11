import { AdminConsole } from "@/components/admin/AdminConsole";
import { databaseConfigured } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/admin/auth";
import { projects } from "@/lib/content/projects";

export const metadata = { title: "Studio workspace", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ preview?: string }> }) {
  const configured = databaseConfigured();
  const preview = !configured && process.env.NODE_ENV === "development" && (await searchParams).preview === "1";
  const session = configured ? await getAdminSession() : null;
  return <AdminConsole configured={configured} initialAuthenticated={Boolean(session)} account={session?.email ?? ""} role={session?.role} previewProjects={preview ? projects : undefined} />;
}
