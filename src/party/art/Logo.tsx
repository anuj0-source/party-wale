// src/party/art/Logo.tsx
// Hand-designed PARTY WALE wordmark.
// Tries /art/logo-wordmark.webp first, otherwise renders an inline SVG.

import React, { useEffect, useState } from 'react';
import { art, artExists } from '../../lib/art-fallback';

interface LogoProps {
  size?: number;
  withSubtitle?: boolean;
  tilt?: number;       // degrees of rotation
}

export function Logo({ size = 56, withSubtitle = false, tilt = -2 }: LogoProps) {
  const [hasArt, setHasArt] = useState<boolean | null>(null);
  useEffect(() => { artExists(art.logo).then(setHasArt); }, []);

  const style: React.CSSProperties = {
    transform: `rotate(${tilt}deg)`,
    transformOrigin: 'left center',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  };

  if (hasArt) {
    return (
      <div style={style} className="pw-logo">
        <img
          src={art.logo}
          alt="PARTY WALE"
          style={{ height: size, width: 'auto' }}
          onError={() => setHasArt(false)}
        />
        {withSubtitle && (
          <span className="pw-logo-sub">est. since internet</span>
        )}
      </div>
    );
  }

  // Inline-SVG fallback — a hand-drawn looking wordmark.
  return (
    <div style={style} className="pw-logo">
      <svg
        viewBox="0 0 230 60"
        height={size}
        width="auto"
        aria-label="PARTY WALE"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="pwGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f6b73c" />
            <stop offset="55%" stopColor="#ff3d77" />
            <stop offset="100%" stopColor="#19d3da" />
          </linearGradient>
        </defs>
        <g fontFamily="Fraunces, 'Times New Roman', serif" fontWeight="900" fontSize="32" letterSpacing="3">
          <text x="2" y="36" fill="url(#pwGrad)" stroke="#14101c" strokeWidth="0.6">
            PARTY
          </text>
          <text x="150" y="36" fill="#f6ecd9" stroke="#14101c" strokeWidth="0.6" fontFamily="sans-serif">
            वाले
          </text>
        </g>
        {/* hand-drawn underline */}
        <path
          d="M5 46 Q 80 52 150 44 T 225 47"
          fill="none"
          stroke="#f6b73c"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* disco-ball dot */}
        <g transform="translate(182, 8)">
          <circle r="4" fill="#19d3da" stroke="#14101c" strokeWidth="0.8" />
          <circle r="1" fill="#f6ecd9" cx="-1" cy="-1" />
        </g>
      </svg>
      {withSubtitle && (
        <span
          className="pw-logo-sub"
          style={{
            fontFamily: 'Caveat, cursive',
            color: 'rgba(246, 236, 217, 0.6)',
            fontSize: 14,
            transform: 'rotate(-3deg)',
            display: 'inline-block',
            marginTop: 4,
          }}
        >
          est. since internet
        </span>
      )}
    </div>
  );
}
