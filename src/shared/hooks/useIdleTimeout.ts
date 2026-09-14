import { useCallback, useEffect, useRef, useState } from "react";

interface Options {
  /** Bật/tắt bộ đếm (chỉ chạy khi đã đăng nhập). */
  enabled: boolean;
  /** Tổng thời gian không thao tác trước khi đăng xuất (ms). Mặc định 30 phút. */
  idleMs?: number;
  /** Cảnh báo trước khi hết giờ (ms). Mặc định 2 phút. */
  warnBeforeMs?: number;
  /** Gọi khi hết giờ. */
  onTimeout: () => void;
}

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"] as const;

/**
 * Tự đăng xuất sau `idleMs` không tương tác, phát cảnh báo trước `warnBeforeMs`.
 * Khi modal cảnh báo đang hiện, hoạt động chuột/phím KHÔNG tự gia hạn — buộc bấm "Tiếp tục".
 */
export function useIdleTimeout({
  enabled,
  idleMs = 30 * 60_000,
  warnBeforeMs = 2 * 60_000,
  onTimeout,
}: Options) {
  const [warning, setWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(Math.round(warnBeforeMs / 1000));

  const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const outTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);
  const warningRef = useRef(false);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  const clearAll = useCallback(() => {
    if (warnTimer.current) clearTimeout(warnTimer.current);
    if (outTimer.current) clearTimeout(outTimer.current);
    if (tick.current) clearInterval(tick.current);
    warnTimer.current = outTimer.current = tick.current = null;
  }, []);

  const armTimers = useCallback(() => {
    clearAll();
    warningRef.current = false;
    setWarning(false);
    warnTimer.current = setTimeout(() => {
      warningRef.current = true;
      setWarning(true);
      setSecondsLeft(Math.round(warnBeforeMs / 1000));
      tick.current = setInterval(() => {
        setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
      }, 1000);
    }, Math.max(0, idleMs - warnBeforeMs));
    outTimer.current = setTimeout(() => {
      clearAll();
      onTimeoutRef.current();
    }, idleMs);
  }, [clearAll, idleMs, warnBeforeMs]);

  const stayActive = useCallback(() => {
    if (enabled) armTimers();
  }, [enabled, armTimers]);

  useEffect(() => {
    if (!enabled) {
      clearAll();
      warningRef.current = false;
      setWarning(false);
      return;
    }
    armTimers();
    const onActivity = () => {
      // Đang cảnh báo → chỉ "Tiếp tục làm việc" mới gia hạn.
      if (warningRef.current) return;
      armTimers();
    };
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    return () => {
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, onActivity));
      clearAll();
    };
  }, [enabled, armTimers, clearAll]);

  return { warning, secondsLeft, stayActive };
}
