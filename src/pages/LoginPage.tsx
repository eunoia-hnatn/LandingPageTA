import { useState, type FormEvent } from "react";
import { Loader2, Lock, Mail } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { Button } from "@/components/ui/button";
import { SEED_ACCOUNTS, ROLE_LABEL } from "@/data/mockAuth";
import logoUrl from "../../HUYWAY_Logo.svg";

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    window.setTimeout(() => {
      const result = login(email, password);
      if (!result.ok) setError(result.error ?? "Đăng nhập thất bại. Vui lòng thử lại.");
      setIsSubmitting(false);
    }, 450);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <img src={logoUrl} alt="HuyWay" className="h-16 w-24 object-contain" />
          <h1 className="text-[16px] font-bold tracking-tight text-[var(--color-text)]">HUYWAY ENGLISH</h1>
          <p className="text-[12px] text-[var(--color-text-secondary)]">Internal Admin System</p>
        </div>

        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-1 text-[16px] font-semibold text-[var(--color-text)]">Đăng nhập quản trị</h2>
          <p className="mb-5 text-[13px] text-[var(--color-text-secondary)]">
            Nhập email và mật khẩu tài khoản CMS để tiếp tục.
          </p>

          {error && (
            <div className="mb-4 rounded-[var(--radius-control)] border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <label className="flex flex-col gap-1.5 text-[12px] font-medium text-[var(--color-text)]">
              Email
              <div className="relative">
                <Mail className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ten@huyway.edu.vn"
                  className="h-10 w-full rounded-[var(--radius-control)] border border-[var(--color-border)] pl-8 pr-3 text-[13px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </label>
            <label className="flex flex-col gap-1.5 text-[12px] font-medium text-[var(--color-text)]">
              Mật khẩu
              <div className="relative">
                <Lock className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 w-full rounded-[var(--radius-control)] border border-[var(--color-border)] pl-8 pr-3 text-[13px] outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </label>

            <Button type="submit" disabled={isSubmitting} className="mt-1 h-10 w-full">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Đăng nhập"}
            </Button>
          </form>
        </div>

        <div className="mt-5 rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] bg-white/60 p-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
            Tài khoản demo (môi trường thử nghiệm)
          </p>
          <div className="flex flex-col gap-1">
            {SEED_ACCOUNTS.map((account) => (
              <button
                key={account.id}
                type="button"
                onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                  setError(null);
                }}
                className="flex items-center justify-between rounded-[var(--radius-control)] px-2.5 py-1.5 text-left text-[12px] transition-colors hover:bg-gray-50"
              >
                <span className="font-medium text-[var(--color-text)]">{ROLE_LABEL[account.role]}</span>
                <span className="text-[var(--color-text-secondary)]">{account.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
