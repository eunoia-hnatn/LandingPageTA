import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Loader2, Lock, Plus, Trash2, Unlock } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FormField, SelectField, TextField } from "@/components/shared/FormField";
import { useAuth } from "@/lib/use-auth";
import { ROLE_LABEL, type AppRole } from "@/shared/lib/permissions";
import {
  createAccount,
  listAccounts,
  setAccountActive,
  updateAccountRole,
  type AccountRecord,
} from "@/services/accounts";

function initials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0]?.[0] ?? "").concat(parts[parts.length - 1]?.[0] ?? "").toUpperCase();
}

const EMPTY_FORM = { full_name: "", email: "", password: "", role: "cskh" as AppRole };
const ROLE_OPTIONS: AppRole[] = ["super_admin", "marketing", "cskh"];

export function AccountsPage() {
  const { profile } = useAuth();
  const [accounts, setAccounts] = useState<AccountRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [rowBusy, setRowBusy] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const res = await listAccounts();
    if (res.ok && res.users) setAccounts(res.users);
    else setLoadError(res.error ?? "Không tải được danh sách tài khoản.");
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const activeSuperAdmins = accounts.filter((a) => a.role === "super_admin" && a.is_active).length;

  async function handleRole(account: AccountRecord, role: AppRole) {
    setRowBusy(account.id);
    setRowError(null);
    const res = await updateAccountRole(account.id, role);
    if (res.ok) await refresh();
    else setRowError(res.error ?? "Không đổi được vai trò.");
    setRowBusy(null);
  }

  async function handleActive(account: AccountRecord) {
    setRowBusy(account.id);
    setRowError(null);
    const res = await setAccountActive(account.id, !account.is_active);
    if (res.ok) await refresh();
    else setRowError(res.error ?? "Không đổi được trạng thái.");
    setRowBusy(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    if (!form.full_name.trim() || !form.email.trim() || !form.password.trim()) {
      setFormError("Vui lòng nhập đầy đủ họ tên, email và mật khẩu.");
      return;
    }
    if (form.password.length < 8) {
      setFormError("Mật khẩu tối thiểu 8 ký tự.");
      return;
    }
    setSubmitting(true);
    const res = await createAccount({
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
    });
    setSubmitting(false);
    if (!res.ok) {
      setFormError(res.error ?? "Không tạo được tài khoản.");
      return;
    }
    setIsModalOpen(false);
    setForm(EMPTY_FORM);
    await refresh();
  }

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <PageHeader
        title="Quản lý tài khoản"
        subtitle="Tạo, đổi vai trò và khoá tài khoản đăng nhập hệ thống. Hệ thống luôn giữ ít nhất 1 Super Admin đang hoạt động."
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-[var(--color-border)] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-[15px] font-semibold text-[var(--color-text)]">Tài khoản đăng nhập</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {accounts.length} tài khoản · {activeSuperAdmins} Super Admin đang hoạt động
            </p>
          </div>
          <Button size="sm" onClick={() => { setForm(EMPTY_FORM); setFormError(null); setIsModalOpen(true); }}>
            <Plus className="h-3.5 w-3.5" />
            Thêm tài khoản
          </Button>
        </div>

        {rowError && (
          <div className="border-b border-red-100 bg-red-50 px-5 py-2.5 text-[12px] text-red-600">{rowError}</div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-[13px] text-[var(--color-text-secondary)]">
            <Loader2 className="h-4 w-4 animate-spin" /> Đang tải…
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <p className="text-[13px] text-red-600">{loadError}</p>
            <Button size="sm" variant="outline" onClick={() => void refresh()}>Thử lại</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[11px] uppercase tracking-wide text-[var(--color-text-secondary)]">
                  <th scope="col" className="px-5 py-3 font-semibold">Tài khoản</th>
                  <th scope="col" className="px-3 py-3 font-semibold">Vai trò</th>
                  <th scope="col" className="px-3 py-3 font-semibold">Trạng thái</th>
                  <th scope="col" className="px-3 py-3 text-right font-semibold">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => {
                  const isSelf = account.id === profile?.id;
                  const isLastActiveSuperAdmin =
                    account.role === "super_admin" && account.is_active && activeSuperAdmins <= 1;
                  const busy = rowBusy === account.id;
                  return (
                    <tr key={account.id} className="border-b border-[var(--color-border)] text-[13px] last:border-0 hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[11px] font-semibold text-[var(--color-primary-dark)]">
                            {initials(account.full_name || account.email)}
                          </div>
                          <div>
                            <p className="font-medium text-[var(--color-text)]">
                              {account.full_name || "(chưa đặt tên)"}
                              {isSelf && (
                                <span className="ml-1.5 text-[11px] font-normal text-[var(--color-text-secondary)]">(bạn)</span>
                              )}
                            </p>
                            <p className="text-[12px] text-[var(--color-text-secondary)]">{account.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <SelectField
                          value={account.role}
                          disabled={busy || isLastActiveSuperAdmin}
                          onChange={(e) => void handleRole(account, e.target.value as AppRole)}
                          className="w-40"
                          aria-label={`Vai trò của ${account.full_name || account.email}`}
                        >
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                          ))}
                        </SelectField>
                      </td>
                      <td className="px-3 py-3">
                        <Badge tone={account.is_active ? "success" : "danger"}>
                          {account.is_active ? "Đang hoạt động" : "Đã khóa"}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {busy && <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--color-text-secondary)]" />}
                          <button
                            onClick={() => void handleActive(account)}
                            disabled={busy || isSelf || isLastActiveSuperAdmin}
                            title={
                              isSelf
                                ? "Không thể khoá tài khoản của chính bạn"
                                : isLastActiveSuperAdmin
                                  ? "Không thể khoá Super Admin cuối cùng"
                                  : account.is_active ? "Khóa tài khoản" : "Mở khóa"
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-control)] text-[var(--color-text-secondary)] hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-30"
                          >
                            {account.is_active ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                          </button>
                          <button
                            disabled
                            title="Xoá tài khoản cần thao tác trực tiếp trong Supabase (giữ an toàn dữ liệu liên kết)"
                            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-control)] text-red-500 opacity-30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thêm tài khoản đăng nhập"
        description="Tài khoản mới có thể đăng nhập ngay bằng email và mật khẩu bên dưới."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)} disabled={submitting}>Hủy</Button>
            <Button size="sm" onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Tạo tài khoản"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {formError && (
            <div className="rounded-[var(--radius-control)] border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-600">
              {formError}
            </div>
          )}
          <FormField label="Họ và tên" required>
            <TextField value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} placeholder="Nguyễn Văn A" />
          </FormField>
          <FormField label="Email đăng nhập" required>
            <TextField type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="ten@huyway.edu.vn" />
          </FormField>
          <FormField label="Mật khẩu tạm thời" required>
            <TextField type="text" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="Tối thiểu 8 ký tự" />
          </FormField>
          <FormField label="Vai trò" required>
            <SelectField value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as AppRole }))}>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{ROLE_LABEL[r]}</option>
              ))}
            </SelectField>
          </FormField>
        </form>
      </Dialog>
    </div>
  );
}
