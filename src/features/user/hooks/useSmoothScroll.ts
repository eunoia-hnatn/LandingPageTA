/**
 * useSmoothScroll
 * ---------------
 * Intercepts every <a href="#…"> click on the page and performs a smooth,
 * header-offset-aware scroll with controllable duration.
 *
 * Usage: call once in App.tsx (or any top-level component).
 */
import { useEffect, useCallback } from 'react';

/** Scroll duration in milliseconds — tăng giá trị này để cuộn chậm hơn */
const SCROLL_DURATION = 900; // ms

/** Easing: easeInOutCubic — tăng tốc ở đầu, giảm tốc mượt ở cuối */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Returns the current fixed-header height in px. */
function getHeaderOffset(): number {
  const header = document.querySelector('header');
  return header ? header.getBoundingClientRect().height : 80;
}

/** Cancels any in-progress animated scroll */
let currentAnimation: number | null = null;

/**
 * Scrolls smoothly to a target position using requestAnimationFrame.
 * Duration và easing có thể tuỳ chỉnh.
 */
function animateScrollTo(targetY: number, duration: number): void {
  // Huỷ animation đang chạy nếu user click link khác giữa chừng
  if (currentAnimation !== null) {
    cancelAnimationFrame(currentAnimation);
    currentAnimation = null;
  }

  const startY = window.scrollY;
  const distance = targetY - startY;

  // Nếu đã đúng vị trí thì không cần scroll
  if (Math.abs(distance) < 1) return;

  const startTime = performance.now();

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1); // 0 → 1
    const eased = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * eased);

    if (progress < 1) {
      currentAnimation = requestAnimationFrame(step);
    } else {
      currentAnimation = null;
    }
  }

  currentAnimation = requestAnimationFrame(step);
}

/**
 * Scrolls smoothly to the element matching the hash, with header offset.
 * Also updates the URL hash without causing a page jump.
 */
export function scrollToHash(hash: string): void {
  if (!hash || hash === '#') {
    animateScrollTo(0, SCROLL_DURATION);
    window.history.pushState(null, '', window.location.pathname);
    return;
  }

  const id = hash.startsWith('#') ? hash.slice(1) : hash;
  const target = document.getElementById(id);
  if (!target) return;

  const headerOffset = getHeaderOffset();
  const targetY = target.getBoundingClientRect().top + window.scrollY - headerOffset - 8;

  animateScrollTo(targetY, SCROLL_DURATION);
  window.history.pushState(null, '', hash);
}

/**
 * Attaches a single delegated click listener to the document that intercepts
 * all internal anchor clicks (href starting with "#") and scrolls smoothly.
 */
export function useSmoothScroll(): void {
  const handleClick = useCallback((e: MouseEvent) => {
    const anchor = (e.target as HTMLElement).closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href') ?? '';
    if (!href.startsWith('#')) return; // external link – leave alone

    e.preventDefault();
    scrollToHash(href);
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [handleClick]);
}
