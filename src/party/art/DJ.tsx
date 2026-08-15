// src/party/art/DJ.tsx
// The illustrated DJ character. Tries /art/dj-*.webp first; otherwise
// renders an inline-SVG illustrated DJ. Image source swaps based on
// isPlaying + bassDrop.

import React, { useEffect, useState } from 'react';
import { art, artExists } from '../../lib/art-fallback';
import { useParty } from '../../contexts/useParty';

interface DJProps {
  className?: string;
}

export function DJ({ className = '' }: DJProps) {
  const { isPlaying } = useParty();
  const [hasArt, setHasArt] = useState<boolean | null>(null);
  useEffect(() => { artExists(art.djIdle).then(setHasArt); }, []);

  const variant = !isPlaying ? 'idle' : 'dance';
  const src = variant === 'dance' ? art.djDance : art.djIdle;

  return (
    <div
      className={`pw-dj ${className}`}
      style={{
        position: 'absolute',
        left: '50%',
        bottom: '12%',
        transform: 'translateX(-50%)',
        width: 'min(420px, 55vw)',
        aspectRatio: '1 / 1.05',
        zIndex: 5,
        pointerEvents: 'none',
        animation: isPlaying
            ? 'pw-dj-bob 0.7s ease-in-out infinite alternate'
            : 'pw-dj-bob 1.6s ease-in-out infinite alternate',
      }}
      aria-label="DJ"
    >
      {hasArt ? (
        <img
          src={src}
          alt="DJ at the booth"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'bottom',
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))',
          }}
        />
      ) : (
        <InlineDJ variant={variant} />
      )}
    </div>
  );
}

// ─── Inline-SVG DJ illustration ─────────────────────────────────────────────
// A hand-drawn-looking DJ character with three variants: idle, dance, bassdrop.

function InlineDJ({ variant }: { variant: 'idle' | 'dance' | 'bassdrop' }) {
  const armL = variant === 'bassdrop' ? -70 : variant === 'dance' ? -30 : -15;
  const armR = variant === 'bassdrop' ? 70  : variant === 'dance' ? 30  : 15;
  const headTilt = variant === 'bassdrop' ? 6 : variant === 'dance' ? -3 : 0;

  return (
    <svg viewBox="0 0 300 320" width="100%" height="100%" aria-hidden>
      <defs>
        <linearGradient id="djShirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff3d77" />
          <stop offset="100%" stopColor="#6b1535" />
        </linearGradient>
        <linearGradient id="djSkin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2a87a" />
          <stop offset="100%" stopColor="#b97a4f" />
        </linearGradient>
      </defs>

      {/* Drop shadow under feet */}
      <ellipse cx="150" cy="310" rx="80" ry="8" fill="rgba(0,0,0,0.35)" />

      {/* Legs (lower) */}
      <rect x="118" y="240" width="22" height="70" fill="#14101c" rx="4" />
      <rect x="160" y="240" width="22" height="70" fill="#14101c" rx="4" />
      {/* Shoes */}
      <ellipse cx="129" cy="308" rx="18" ry="6" fill="#f6b73c" />
      <ellipse cx="171" cy="308" rx="18" ry="6" fill="#f6b73c" />

      {/* Torso (oversize shirt) */}
      <path
        d="M 80 130 L 90 250 L 210 250 L 220 130 Z"
        fill="url(#djShirt)"
        stroke="#14101c"
        strokeWidth="2.5"
      />
      {/* Shirt logo */}
      <text
        x="150"
        y="200"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontWeight="900"
        fontSize="22"
        fill="#f6ecd9"
        transform="rotate(-3 150 200)"
      >
        PW
      </text>

      {/* Left arm (player's left) — animated */}
      <g
        style={{
          transformOrigin: '90px 140px',
          transform: `rotate(${armL}deg)`,
          transition: 'transform 0.25s var(--ease-paper)',
        }}
      >
        <rect x="84" y="138" width="20" height="80" fill="url(#djShirt)" stroke="#14101c" strokeWidth="2" rx="6" />
        <circle cx="94" cy="220" r="10" fill="url(#djSkin)" stroke="#14101c" strokeWidth="2" />
      </g>

      {/* Right arm */}
      <g
        style={{
          transformOrigin: '210px 140px',
          transform: `rotate(${armR}deg)`,
          transition: 'transform 0.25s var(--ease-paper)',
        }}
      >
        <rect x="196" y="138" width="20" height="80" fill="url(#djShirt)" stroke="#14101c" strokeWidth="2" rx="6" />
        <circle cx="206" cy="220" r="10" fill="url(#djSkin)" stroke="#14101c" strokeWidth="2" />
      </g>

      {/* Head + neck */}
      <g
        style={{
          transformOrigin: '150px 90px',
          transform: `rotate(${headTilt}deg)`,
          transition: 'transform 0.3s var(--ease-paper)',
        }}
      >
        {/* Neck */}
        <rect x="140" y="120" width="20" height="20" fill="url(#djSkin)" stroke="#14101c" strokeWidth="2" />
        {/* Head */}
        <ellipse cx="150" cy="80" rx="38" ry="42" fill="url(#djSkin)" stroke="#14101c" strokeWidth="2.5" />
        {/* Hair */}
        <path
          d="M 112 75 Q 120 35 150 30 Q 180 35 188 75 Q 188 60 175 50 Q 165 45 150 45 Q 135 45 125 50 Q 112 60 112 75 Z"
          fill="#14101c"
        />
        {/* Sunglasses */}
        <rect x="120" y="72" width="20" height="14" rx="3" fill="#14101c" />
        <rect x="160" y="72" width="20" height="14" rx="3" fill="#14101c" />
        <line x1="140" y1="78" x2="160" y2="78" stroke="#14101c" strokeWidth="2" />
        {/* Sunglasses reflection */}
        <line x1="124" y1="76" x2="128" y2="76" stroke="#f6b73c" strokeWidth="1.2" opacity="0.8" />
        <line x1="164" y1="76" x2="168" y2="76" stroke="#f6b73c" strokeWidth="1.2" opacity="0.8" />
        {/* Smile */}
        <path
          d="M 138 102 Q 150 112 162 102"
          fill="none"
          stroke="#14101c"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Headphones around neck */}
        <path
          d="M 110 80 Q 100 110 120 130 L 125 132 Q 110 115 118 88"
          fill="none"
          stroke="#14101c"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 190 80 Q 200 110 180 130 L 175 132 Q 190 115 182 88"
          fill="none"
          stroke="#14101c"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <ellipse cx="118" cy="132" rx="8" ry="11" fill="#19d3da" stroke="#14101c" strokeWidth="2" />
        <ellipse cx="182" cy="132" rx="8" ry="11" fill="#19d3da" stroke="#14101c" strokeWidth="2" />
      </g>

      {/* Gold chain */}
      <path
        d="M 130 150 Q 150 165 170 150"
        fill="none"
        stroke="#f6b73c"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="150" cy="160" r="4" fill="#f6b73c" />
    </svg>
  );
}
