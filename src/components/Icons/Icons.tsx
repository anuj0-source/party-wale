/**
 * Clean SVG icon library — no emojis, no Unicode symbols.
 * All icons use the currentColor for easy theming.
 */
import React from 'react';

const defaultProps = { width: 18, height: 18, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export const IconPlay = ({ size = 18 }: { size?: number }) => (
  <svg {...defaultProps} width={size} height={size} viewBox="0 0 24 24">
    <polygon points="6,3 20,12 6,21" fill="currentColor" stroke="none" />
  </svg>
);

export const IconPause = ({ size = 18 }: { size?: number }) => (
  <svg {...defaultProps} width={size} height={size} viewBox="0 0 24 24">
    <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none" />
    <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconSkipBack = ({ size = 18 }: { size?: number }) => (
  <svg {...defaultProps} width={size} height={size} viewBox="0 0 24 24">
    <polygon points="19,20 9,12 19,4" fill="currentColor" stroke="none" />
    <line x1="5" y1="4" x2="5" y2="20" strokeWidth={2.5} strokeLinecap="round" />
  </svg>
);

export const IconSkipForward = ({ size = 18 }: { size?: number }) => (
  <svg {...defaultProps} width={size} height={size} viewBox="0 0 24 24">
    <polygon points="5,4 15,12 5,20" fill="currentColor" stroke="none" />
    <line x1="19" y1="4" x2="19" y2="20" strokeWidth={2.5} strokeLinecap="round" />
  </svg>
);

export const IconList = ({ size = 18 }: { size?: number }) => (
  <svg {...defaultProps} width={size} height={size} viewBox="0 0 24 24">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <circle cx="3.5" cy="6" r="1" fill="currentColor" stroke="none" />
    <circle cx="3.5" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="3.5" cy="18" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconMusicNote = ({ size = 24 }: { size?: number }) => (
  <svg {...defaultProps} width={size} height={size} viewBox="0 0 24 24">
    <path d="M9 18V5l12-2v13" strokeWidth={1.6} />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

export const IconVinyl = ({ size = 56 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
    {/* Outer disc */}
    <circle cx="28" cy="28" r="27" fill="url(#vinylGrad)" />
    {/* Groove rings */}
    <circle cx="28" cy="28" r="22" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
    <circle cx="28" cy="28" r="18" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
    <circle cx="28" cy="28" r="14" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
    {/* Label center */}
    <circle cx="28" cy="28" r="8" fill="url(#labelGrad)" />
    <circle cx="28" cy="28" r="2" fill="rgba(0,0,0,0.7)" />
    <defs>
      <radialGradient id="vinylGrad" cx="40%" cy="35%">
        <stop offset="0%" stopColor="#2a0a3a" />
        <stop offset="100%" stopColor="#050510" />
      </radialGradient>
      <radialGradient id="labelGrad" cx="50%" cy="50%">
        <stop offset="0%" stopColor="#ff0090" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#7700cc" stopOpacity="0.8" />
      </radialGradient>
    </defs>
  </svg>
);

export const IconWifi = ({ size = 14 }: { size?: number }) => (
  <svg {...defaultProps} width={size} height={size} viewBox="0 0 24 24" strokeWidth={1.8}>
    <polyline points="1,6 12,17 23,6" />
    <polyline points="4,10 12,17 20,10" />
  </svg>
);

export const IconShare = ({ size = 16 }: { size?: number }) => (
  <svg {...defaultProps} width={size} height={size} viewBox="0 0 24 24">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

export const IconCheck = ({ size = 16 }: { size?: number }) => (
  <svg {...defaultProps} width={size} height={size} viewBox="0 0 24 24">
    <polyline points="20,6 9,17 4,12" strokeWidth={2.5} />
  </svg>
);

export const IconAlert = ({ size = 14 }: { size?: number }) => (
  <svg {...defaultProps} width={size} height={size} viewBox="0 0 24 24">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" strokeWidth={2} />
    <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth={2} />
  </svg>
);

export const IconStar = ({ size = 16 }: { size?: number }) => (
  <svg {...defaultProps} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

export const IconBolt = ({ size = 14 }: { size?: number }) => (
  <svg {...defaultProps} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
  </svg>
);

export const IconMic = ({ size = 14 }: { size?: number }) => (
  <svg {...defaultProps} width={size} height={size} viewBox="0 0 24 24">
    <rect x="9" y="2" width="6" height="11" rx="3" />
    <path d="M19 10v1a7 7 0 01-14 0v-1" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);
