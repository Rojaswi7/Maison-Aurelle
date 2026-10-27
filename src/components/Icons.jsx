const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const Star = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 1.5l2 8.5 8.5 2-8.5 2-2 8.5-2-8.5L1.5 12l8.5-2z" fill="currentColor" />
  </svg>
);

export const Arrow = ({ size = 16, dir = 'right' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} style={{ transform: dir === 'left' ? 'scaleX(-1)' : undefined }}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);

export const Close = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M5 5l14 14M19 5L5 19" />
  </svg>
);

export const Check = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth={1.8}>
    <path d="M4 12.5l5 5L20 6.5" />
  </svg>
);

export const LinkIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" />
  </svg>
);

export const CalendarIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);

export const Pin = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

export const Video = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <rect x="3" y="6" width="13" height="12" rx="2" />
    <path d="M16 10.5l5-3v9l-5-3" />
  </svg>
);
