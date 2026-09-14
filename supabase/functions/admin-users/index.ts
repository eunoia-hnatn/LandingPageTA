// admin-users — quản lý tài khoản nội bộ (14.2)
//
// Chỉ Super Admin (đã đăng nhập) được gọi. Dùng service_role để tạo user /
// đổi vai trò / bật-tắt hoạt động, đồng thời ghi audit_log.
//
// Deploy:  supabase functions deploy admin-users
// Secrets cần có (tự set nếu chưa):
//   supabase secrets set SB_SERVICE_ROLE_KEY=<service_role key>
//   (SUPABASE_URL / SUPABASE_ANON_KEY được nền tảng cấp sẵn khi chạy trên Supabase)
//
// Body:
//   { action: "list" }
//   { action: "create",     email, password, full_name, role }
//   { action: "update_role", user_id, role }
//   { action: "set_active",  user_id, is_active }

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

type AppRole = "super_admin" | "marketing" | "cskh";
const ROLES: AppRole[] = ["super_admin", "marketing", "cskh"];

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_ROLE_KEY =
  Deno.env.get("SB_SERVICE_ROLE_KEY") ??
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function fail(msg: string, status = 400) {
  return jsonResponse({ ok: false, error: msg }, status);
}

async function countActiveSuperAdmins(exceptId?: string): Promise<number> {
  let q = admin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "super_admin")
    .eq("is_active", true);
  if (exceptId) q = q.neq("id", exceptId);
  const { count, error } = await q;
  if (error) throw error;
  return count ?? 0;
}

async function writeAudit(
  actorId: string,
  action: string,
  entityId: string,
  diff: Record<string, unknown>,
) {
  await admin.from("audit_log").insert({
    actor_id: actorId,
    action,
    entity: "profiles",
    entity_id: entityId,
    diff,
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return fail("Method not allowed", 405);

  // --- Xác thực caller ---
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return fail("Thiếu token xác thực.", 401);

  const caller = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: userData, error: userErr } = await caller.auth.getUser();
  if (userErr || !userData.user) return fail("Phiên đăng nhập không hợp lệ.", 401);
  const callerId = userData.user.id;

  const { data: callerProfile, error: profErr } = await admin
    .from("profiles")
    .select("role, is_active")
    .eq("id", callerId)
    .single();
  if (profErr || !callerProfile) return fail("Không tìm thấy hồ sơ người gọi.", 403);
  if (callerProfile.role !== "super_admin" || !callerProfile.is_active) {
    return fail("Chỉ Super Admin mới có quyền quản lý tài khoản.", 403);
  }

  // --- Payload ---
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail("Body không phải JSON hợp lệ.");
  }
  const action = String(body.action ?? "");

  try {
    switch (action) {
      case "list": {
        const { data, error } = await admin
          .from("profiles")
          .select("id, email, full_name, role, is_active, created_at")
          .order("created_at", { ascending: true });
        if (error) throw error;
        return jsonResponse({ ok: true, users: data });
      }

      case "create": {
        const email = String(body.email ?? "").trim().toLowerCase();
        const password = String(body.password ?? "");
        const full_name = String(body.full_name ?? "").trim();
        const role = String(body.role ?? "") as AppRole;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Email không hợp lệ.");
        if (password.length < 8) return fail("Mật khẩu tối thiểu 8 ký tự.");
        if (full_name.length < 2 || full_name.length > 120) return fail("Họ tên 2–120 ký tự.");
        if (!ROLES.includes(role)) return fail("Vai trò không hợp lệ.");

        const { data: created, error } = await admin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name, role },
        });
        if (error) return fail(error.message);

        // Trigger handle_new_user() đã tạo profiles; đồng bộ created_by + đảm bảo dữ liệu.
        await admin
          .from("profiles")
          .update({ full_name, role, created_by: callerId })
          .eq("id", created.user.id);

        await writeAudit(callerId, "create_user", created.user.id, { email, role });
        return jsonResponse({
          ok: true,
          user: { id: created.user.id, email, full_name, role, is_active: true },
        });
      }

      case "update_role": {
        const userId = String(body.user_id ?? "");
        const role = String(body.role ?? "") as AppRole;
        if (!userId) return fail("Thiếu user_id.");
        if (!ROLES.includes(role)) return fail("Vai trò không hợp lệ.");

        const { data: target, error: tErr } = await admin
          .from("profiles")
          .select("role, is_active")
          .eq("id", userId)
          .single();
        if (tErr || !target) return fail("Không tìm thấy tài khoản.", 404);

        if (
          target.role === "super_admin" &&
          target.is_active &&
          role !== "super_admin" &&
          (await countActiveSuperAdmins(userId)) === 0
        ) {
          return fail("Không thể hạ cấp Super Admin cuối cùng đang hoạt động.");
        }

        const { error } = await admin.from("profiles").update({ role }).eq("id", userId);
        if (error) return fail(error.message);
        await writeAudit(callerId, "update_role", userId, { from: target.role, to: role });
        return jsonResponse({ ok: true });
      }

      case "set_active": {
        const userId = String(body.user_id ?? "");
        const isActive = Boolean(body.is_active);
        if (!userId) return fail("Thiếu user_id.");
        if (userId === callerId && !isActive) {
          return fail("Không thể tự khoá tài khoản của chính bạn.");
        }

        const { data: target, error: tErr } = await admin
          .from("profiles")
          .select("role, is_active")
          .eq("id", userId)
          .single();
        if (tErr || !target) return fail("Không tìm thấy tài khoản.", 404);

        if (
          target.role === "super_admin" &&
          target.is_active &&
          !isActive &&
          (await countActiveSuperAdmins(userId)) === 0
        ) {
          return fail("Không thể khoá Super Admin cuối cùng đang hoạt động.");
        }

        const { error } = await admin
          .from("profiles")
          .update({ is_active: isActive })
          .eq("id", userId);
        if (error) return fail(error.message);
        await writeAudit(callerId, isActive ? "activate" : "deactivate", userId, {
          is_active: isActive,
        });
        return jsonResponse({ ok: true });
      }

      default:
        return fail(`Action không hỗ trợ: ${action || "(trống)"}`);
    }
  } catch (e) {
    console.error("admin-users error", e);
    return fail("Lỗi máy chủ khi xử lý yêu cầu.", 500);
  }
});
