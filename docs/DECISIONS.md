# Nhật ký quyết định nghiệp vụ

> Ghi ngắn: bối cảnh · quyết định · lý do · file liên quan. Không chép code.

## Nguồn sự thật của giao diện Landing = `docs/design export/code.html`
- Bối cảnh: Landing trước đó được dựng từ nhiều nguồn chắp vá (mockup nhánh `feat/admin-dashboard`
  cũ + các section tự viết theo plan 02/03a/03b). Khách cung cấp 1 bản export tĩnh hoàn chỉnh
  (`docs/design export/code.html` + `DESIGN.md` + `screen.png`, hệ thiết kế "The Open Door") và
  yêu cầu **sao chép y hệt 100%** trước, nối logic sau.
- Quyết định:
  1. **`DESIGN.md` gốc bị thay thế hoàn toàn** bằng bản trong `docs/design export/DESIGN.md`
     (hệ token Material-3-role đầy đủ: `primary/primary-container/on-primary/surface-slate/hairline/...`).
     Bản cũ (draft đơn giản hơn) coi như deprecated.
  2. `tailwind.config.js` được nạp lại qua `@config "../tailwind.config.js"` trong `src/index.css`
     (Tailwind v4) để các class trong export (`bg-primary-container`, `text-on-surface`,
     `font-headline`, `text-label-lg`, `p-space-32`, …) hoạt động **y hệt**, không cần dịch sang
     arbitrary-value. Các scale cũ (`brand`, `accent`, `ink` số…) được merge thêm vào, chỉ bỏ đúng
     1 key `ink` (đổi từ scale số sang giá trị phẳng `#000000` theo export — không key nào khác đụng độ).
  3. Toàn bộ 13 module trong export được port thành component/section 1:1 (class Tailwind giữ
     nguyên chuỗi, chỉ đổi `class→className`, `for→htmlFor`, inline `onclick`→React state cho
     modal Cam kết + accordion FAQ (`<details>` gốc) + toggle "Cảm ơn" ở Hero form).
  4. **Chưa nối logic**: form Hero chỉ đổi trạng thái hiển thị nội bộ (không gọi `submit-lead`),
     modal/accordion dùng state cục bộ (là hành vi UI thuần, không phải nghiệp vụ). `<LeadForm>`,
     `useSiteContent`, `<CtaBand>` xây ở các đợt trước (Nhóm 1/2) **chưa bị xoá** nhưng tạm không
     dùng trong các section mới — sẽ nối lại ở lượt "logic" kế tiếp theo đúng yêu cầu khách.
  5. Xoá các file mockup cũ không còn dùng: `sections/Instructor.tsx`, `sections/SocialProof.tsx`,
     `sections/Contact.tsx`, `user.css` (shim Tailwind v3 cũ — không component mới nào cần).
  6. `config/sections.ts` (hợp đồng section-id) cập nhật id/nhãn khớp đúng export
     (`ve-chung-toi, lo-trinh-hoc, quy-trinh, doi-ngu, cam-nhan-hoc-vien, cam-ket, faq, dang-ky`) —
     khác với id đã định nghĩa trước đó theo plan 02/03a/03b (`ve-huyway, cong-nghe, giang-vien,
     hoc-vien, ket-qua-thuc-te`…). **Plan 02/03a/03b coi như deprecated cho phần UI** — id/section
     giờ theo export, không theo các plan đó nữa.
- Lý do: Khách đã có bản thiết kế cuối cùng, ưu tiên khớp pixel hơn là tiếp tục dựng theo spec
  suy diễn từ nhiều tài liệu plan. Giảm rủi ro lệch hình do dịch tay Tailwind.
- File liên quan: `DESIGN.md`, `tailwind.config.js`, `src/index.css`, `index.html`,
  toàn bộ `src/features/user/{components,sections,pages}/*`, `src/features/user/config/sections.ts`.

## Định danh vai trò dùng `snake_case`
- Bối cảnh: Code cũ dùng `Role = "super-admin"` (gạch ngang); Supabase enum & plan dùng `super_admin`.
- Quyết định: Chuẩn hoá toàn bộ về `super_admin | marketing | cskh` khớp enum `public.app_role`.
- Lý do: Tránh phải map qua lại giữa DB và FE; enum Postgres không nhận gạch ngang thuận tiện.
- File liên quan: `supabase/migrations/0001_auth_foundation.sql`, `src/types/auth.ts`, `src/shared/lib/permissions.ts`, `src/data/mockAuth.ts`.

## Luồng xác thực: Supabase Auth + bảng `profiles` tách vai trò
- Bối cảnh: 14.1/14.2 cần đăng nhập thật, 3 vai trò, khoá tài khoản, ràng buộc ≥1 Super Admin.
- Quyết định:
  - `auth.users` giữ credential; `public.profiles` (1–1) giữ `role`, `is_active`, `full_name`.
  - Trigger `handle_new_user()` tạo `profiles` tự động khi có user mới (role lấy từ `raw_user_meta_data.role`, fallback `cskh`).
  - RLS mọi bảng admin gate qua `public.current_app_role()` (SECURITY DEFINER đọc role của `auth.uid()`).
  - Đăng nhập sai → lỗi generic "Email hoặc mật khẩu không đúng" (không lộ email tồn tại).
  - `profile.is_active = false` khi đang có phiên → tự `signOut()` + thông báo.
- Lý do: Không lưu role trong JWT app_metadata để đổi vai trò có hiệu lực ngay ở lần refresh kế; RLS là hàng rào thật thay vì lọc phía client.
- File liên quan: `supabase/migrations/0001_auth_foundation.sql`, `src/shared/contexts/AuthContext.tsx`, `src/shared/components/ProtectedRoute.tsx`.

## Ràng buộc "luôn còn ≥1 Super Admin đang hoạt động"
- Bối cảnh: 14.2 — không được để hệ thống mất toàn bộ Super Admin.
- Quyết định: Chặn 2 lớp:
  1. Trigger DB `guard_last_super_admin()` (BEFORE UPDATE/DELETE trên `profiles`) raise exception nếu thao tác đưa số Super Admin `is_active` về 0.
  2. Edge Function `admin-users` double-check trước khi gọi.
- Lý do: Trigger là chốt cuối kể cả khi thao tác trực tiếp trên DB; Edge check cho thông báo lỗi thân thiện.
- File liên quan: `supabase/migrations/0001_auth_foundation.sql`, `supabase/functions/admin-users/index.ts`.

## Quản lý tài khoản đi qua Edge Function `admin-users` (service role)
- Bối cảnh: Tạo user / đổi role / khoá cần quyền `service_role`, không thể làm từ client anon.
- Quyết định: 1 Edge Function `admin-users` xác minh JWT caller + `current_app_role() = 'super_admin'`, rồi dùng `supabase.auth.admin` + cập nhật `profiles`, ghi `audit_log`.
- Lý do: Không lộ service key ra client; tập trung kiểm tra quyền + ghi vết ở 1 chỗ.
- File liên quan: `supabase/functions/admin-users/index.ts`, `src/services/accounts.ts`, `src/pages/AccountsPage.tsx`.

## Chống trùng Lead: "Lead mới thắng" (ghi đè theo phone_normalized)
- Bối cảnh: 1 người có thể submit form nhiều lần (nhiều vị trí CTA). Không được tạo bản ghi rác.
- Quyết định: Edge Function `submit-lead` normalize SĐT (`+84`→`0`, bỏ khoảng trắng/-/()), tra `leads.phone_normalized`. Nếu đã tồn tại → **UPDATE** toàn bộ field bằng dữ liệu mới, `updated_at=now()`, **giữ nguyên `id` + `created_at`** gốc, trả `resubmitted:true`. Không tạo bản ghi thứ 2.
- Lý do: Chốt với khách 2026-09-08 (plan Nhóm 4 §7.3) — dữ liệu mới nhất phản ánh đúng nhu cầu hiện tại của khách; giữ id gốc để lịch sử/assign không đứt.
- File liên quan: `supabase/functions/submit-lead/index.ts`, `supabase/migrations/0001b_leads_policy.sql`.

## Ghi vết version đồng ý (consent_version / consent_at)
- Bối cảnh: 17.1 — cần chứng minh khách đã đồng ý với đúng bản chính sách nào, lúc nào.
- Quyết định: Khi ghi Lead, Edge Function đọc `policy_documents` bản `is_current` của slug `data-privacy`, lấy `version` gắn vào `leads.consent_version`; `consent_at = now()` (server). Client chỉ gửi `consent: true/false`. DB có `CHECK (consent = true)` — không thể lách.
- Lý do: Nguồn thời gian + version phải là server, không tin client. Bản chính sách đổi → Lead cũ vẫn giữ version đã đồng ý.
- File liên quan: `supabase/functions/submit-lead/index.ts`, `src/shared/forms/fields/ConsentCheckbox.tsx`, `src/shared/hooks/usePolicyDocument.ts`.

## Validate Lead: 1 nguồn chân lý, mirror sang Edge Function
- Bối cảnh: Quy tắc SĐT/email/độ dài phải khớp giữa client (UX) và server (chống bypass).
- Quyết định: `src/shared/forms/rules.ts` là nguồn chân lý. `supabase/functions/_shared/rules.ts` là **bản sao khớp nội dung** (Deno standalone, không import ngoài) — có test so khớp (chưa viết, vitest chưa cài). SĐT VN: `^0(3|5|7|8|9)[0-9]{8}$` sau normalize. Email: RFC 5322 rút gọn, **không** ép `@gmail.com` (chốt 2026-09-08).
- Lý do: Edge Function chạy Deno không import được module client; copy + test parity an toàn hơn symlink/bundle phức tạp.
- File liên quan: `src/shared/forms/rules.ts`, `supabase/functions/_shared/rules.ts`.

## Session timeout: 30 phút không thao tác
- Bối cảnh: 14.1 — chốt với khách 2026-09-08.
- Quyết định: `useIdleTimeout` tự `signOut()` sau 30' không tương tác (mousemove/keydown/click/scroll/touch), cảnh báo modal trước 2'. Brute-force dùng giới hạn mặc định của Supabase Auth (không viết khoá tuỳ biến).
- Lý do: Khách chốt con số; tiết kiệm thời gian triển khai.
- File liên quan: `src/shared/hooks/useIdleTimeout.ts`, `src/shared/contexts/AuthContext.tsx`.
