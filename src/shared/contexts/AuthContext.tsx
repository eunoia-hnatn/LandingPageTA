import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/shared/lib/supabase";
import type { AppRole } from "@/shared/lib/database.types";
import { useIdleTimeout } from "@/shared/hooks/useIdleTimeout";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: AppRole;
  is_active: boolean;
}

export type AuthStatus = "loading" | "authed" | "anon";

interface AuthContextValue {
  status: AuthStatus;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  /** Đăng nhập. Ném Error với thông báo generic nếu thất bại. */
  signIn: (email: string, password: string) => Promise<void>;
  signOut: (reason?: string) => Promise<void>;
  /** Thông báo hệ thống cần hiển thị ở màn đăng nhập (vd: bị khoá, hết phiên). */
  notice: string | null;
  clearNotice: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const GENERIC_LOGIN_ERROR = "Email hoặc mật khẩu không đúng.";
const PROFILE_COLUMNS = "id, email, full_name, role, is_active";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [notice, setNotice] = useState<string | null>(null);
  const signingOut = useRef(false);

  const clearNotice = useCallback(() => setNotice(null), []);

  const signOut = useCallback(async (reason?: string) => {
    signingOut.current = true;
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setStatus("anon");
    if (reason) setNotice(reason);
    signingOut.current = false;
  }, []);

  const loadProfile = useCallback(
    async (userId: string): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select(PROFILE_COLUMNS)
        .eq("id", userId)
        .maybeSingle();
      if (error || !data) return null;
      return data as Profile;
    },
    [],
  );

  const refreshProfile = useCallback(async () => {
    if (!session?.user) return;
    const p = await loadProfile(session.user.id);
    if (p && !p.is_active) {
      await signOut("Tài khoản của bạn đã bị khoá. Vui lòng liên hệ Super Admin.");
      return;
    }
    setProfile(p);
  }, [session, loadProfile, signOut]);

  // Đồng bộ session từ Supabase Auth.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) setStatus("anon");
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      if (signingOut.current) return;
      setSession(next);
      if (!next) {
        setProfile(null);
        setStatus("anon");
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Nạp profile mỗi khi user thay đổi.
  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;
    let cancelled = false;
    setStatus("loading");
    loadProfile(userId).then(async (p) => {
      if (cancelled) return;
      if (!p) {
        await signOut("Không tìm thấy hồ sơ tài khoản. Vui lòng liên hệ Super Admin.");
        return;
      }
      if (!p.is_active) {
        await signOut("Tài khoản của bạn đã bị khoá. Vui lòng liên hệ Super Admin.");
        return;
      }
      setProfile(p);
      setStatus("authed");
    });
    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, loadProfile, signOut]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setNotice(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error || !data.user) throw new Error(GENERIC_LOGIN_ERROR);

      const p = await loadProfile(data.user.id);
      if (!p) {
        await supabase.auth.signOut();
        throw new Error("Không tìm thấy hồ sơ tài khoản. Vui lòng liên hệ Super Admin.");
      }
      if (!p.is_active) {
        await supabase.auth.signOut();
        throw new Error("Tài khoản của bạn đã bị khoá. Vui lòng liên hệ Super Admin.");
      }
      // session sẽ được onAuthStateChange cập nhật; set luôn để UI phản hồi nhanh.
      setProfile(p);
    },
    [loadProfile],
  );

  const idle = useIdleTimeout({
    enabled: status === "authed",
    onTimeout: () => {
      void signOut("Phiên làm việc đã hết hạn do không thao tác. Vui lòng đăng nhập lại.");
    },
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      session,
      user: session?.user ?? null,
      profile,
      signIn,
      signOut,
      notice,
      clearNotice,
      refreshProfile,
    }),
    [status, session, profile, signIn, signOut, notice, clearNotice, refreshProfile],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {idle.warning && status === "authed" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-[var(--radius-card,12px)] border border-[var(--color-border,#e2e8f0)] bg-white p-5 shadow-xl">
            <h2 className="text-base font-semibold text-[var(--color-text,#000)]">
              Bạn vẫn đang làm việc chứ?
            </h2>
            <p className="mt-1.5 text-[13px] text-[var(--color-text-secondary,#717174)]">
              Phiên sẽ tự đăng xuất sau{" "}
              <span className="font-semibold tabular-nums">
                {Math.floor(idle.secondsLeft / 60)}:{String(idle.secondsLeft % 60).padStart(2, "0")}
              </span>{" "}
              do không có thao tác.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => void signOut()}
                className="rounded-[var(--radius-control,8px)] px-3 py-1.5 text-[13px] font-medium text-[var(--color-text-secondary,#717174)] hover:bg-gray-100"
              >
                Đăng xuất
              </button>
              <button
                onClick={idle.stayActive}
                className="rounded-[var(--radius-control,8px)] bg-[var(--color-primary,#2C3481)] px-3 py-1.5 text-[13px] font-semibold text-white"
              >
                Tiếp tục làm việc
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
