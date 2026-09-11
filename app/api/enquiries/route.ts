import { NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import { createServiceClient } from "@/lib/supabase/server";
import { enquirySchema } from "@/lib/admin/validation";
import { apiError, checkOrigin, readBody } from "@/lib/admin/http";

export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const input = enquirySchema.parse(await readBody(request, 16000));
    const client = createServiceClient();
    // Vercel overwrites this header; don't trust arbitrary x-forwarded-for values.
    const address = process.env.VERCEL ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ?? "unknown" : "local";
    const rateKey = createHmac("sha256", process.env.SUPABASE_SECRET_KEY!).update(address).digest("hex");
    const { data, error } = await client.rpc("submit_enquiry", { p_id: input.id, p_name: input.name, p_email: input.email, p_company: input.company, p_service: input.service, p_budget: input.budget, p_message: input.message, p_rate_key: rateKey });
    if (error?.message.includes("RATE_LIMITED")) return NextResponse.json({ error: "Too many enquiries in a short time. Please try again in an hour." }, { status: 429, headers: { "Retry-After": "3600" } });
    if (error || !data) throw new Error("SAVE_FAILED");
    return NextResponse.json({ id: data, message: "Your project enquiry is saved. We’ll be in touch soon." }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) { return apiError(error); }
}
