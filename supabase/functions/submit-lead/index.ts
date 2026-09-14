// submit-lead — nhận Lead từ landing (public). Validate lại cùng bộ quy tắc
// (_shared/rules.ts), normalize phone, chống trùng theo phone_normalized
// ("Lead mới thắng" — chốt 2026-09-08): nếu đã tồn tại → ghi đè field mới,
// giữ nguyên id/created_at, trả resubmitted:true; không tạo bản ghi mới.
//
// Deploy:  supabase functions deploy submit-lead
// Secret:  supabase secrets set SB_SERVICE_ROLE_KEY=<service_role key>

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { normalizePhone, validateLead, type LeadInput } from "../_shared/rules.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY =
  Deno.env.get("SB_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ ok: false, message: "Method not allowed" }, 405);

  let body: Partial<LeadInput>;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ ok: false, message: "Body không hợp lệ." }, 400);
  }

  const errors = validateLead(body);
  if (Object.keys(errors).length > 0) {
    return jsonResponse({ ok: false, errors }, 422);
  }

  const phoneNorm = normalizePhone(body.phone ?? "");

  // consent_version = version policy_documents hiện hành
  const { data: policy } = await db
    .from("policy_documents")
    .select("version")
    .eq("slug", "data-privacy")
    .eq("is_current", true)
    .maybeSingle();
  const consentVersion = policy?.version ?? "unknown";
  const now = new Date().toISOString();

  const fields = {
    full_name: (body.full_name ?? "").trim(),
    phone: (body.phone ?? "").trim(),
    email: body.email?.trim() || null,
    course_interest: body.course_interest || null,
    current_level: body.current_level || null,
    learning_need: body.learning_need?.trim() || null,
    source: body.source!,
    consent: true,
    consent_version: consentVersion,
    consent_at: now,
  };

  try {
    // Đã tồn tại theo phone_normalized? → ghi đè (Lead mới thắng), giữ id/created_at.
    const { data: existing } = await db
      .from("leads")
      .select("id")
      .eq("phone_normalized", phoneNorm)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (existing) {
      const { error } = await db
        .from("leads")
        .update({ ...fields, updated_at: now })
        .eq("id", existing.id);
      if (error) throw error;
      return jsonResponse({ ok: true, id: existing.id, resubmitted: true });
    }

    const { data: created, error } = await db
      .from("leads")
      .insert(fields)
      .select("id")
      .single();
    if (error) throw error;
    return jsonResponse({ ok: true, id: created.id, resubmitted: false });
  } catch (e) {
    console.error("submit-lead error", e);
    return jsonResponse({ ok: false, message: "Lỗi máy chủ, vui lòng thử lại." }, 500);
  }
});
