import Lenis from 'lenis';
import { useEffect } from 'react';

let lenis = null;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    let frame;
    const raf = (time) => {
      lenis?.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}

export function scrollToElement(el, offset = -96) {
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

let locks = 0;
export function lockScroll(locked) {
  locks = Math.max(0, locks + (locked ? 1 : -1));
  const on = locks > 0;
  if (lenis) on ? lenis.stop() : lenis.start();
  document.documentElement.style.overflow = on ? 'hidden' : '';
}
