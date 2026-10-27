import { useEffect } from 'react';

export const EASE = [0.22, 1, 0.36, 1];

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

export const storage = {
  get(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable — the experience still works, it just won't remember */
    }
  },
};

export const COMMISSION_KEY = 'aurelle:commission';

// Whether the first-visit intro is still to play; pages delay their entrances while it does.
export const intro = {
  pending: (() => {
    try {
      return !sessionStorage.getItem('aurelle:intro') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  })(),
};
