// src/party/art/Crowd.tsx
// 8 unique crowd characters, each its own image (or inline-SVG fallback).
// Layered in front of the DJ booth at varying scales & positions.
// Each character has a different bob period so they don't sync.

import React, { useEffect, useState } from 'react';
import { art, artExists } from '../../lib/art-fallback';
import { useParty } from '../../contexts/useParty';

interface CrowdProps {
  isMobile?: boolean;
}

const CHARACTERS = [
  { src: art.crowd[0], label: 'College guy',         bobMs: 1100, scale: 1.0, x: 8,   y: 0, z: 1 },
  { src: art.crowd[1], label: 'Phone girl',          bobMs: 1300, scale: 0.92, x: 22, y: 0, z: 1 },
  { src: art.crowd[2], label: 'Sunglasses guy',      bobMs: 1050, scale: 1.05, x: 36, y: 0, z: 1 },
  { src: art.crowd[3], label: 'Jumping friend',      bobMs: 600,  scale: 0.95, x: 64, y: 0, z: 1 },
  { src: art.crowd[4], label: 'Recording person',    bobMs: 1200, scale: 0.97, x: 78, y: 0, z: 1 },
  { src: art.crowd[5], label: 'Couple',              bobMs: 1600, scale: 0.9,  x: 50, y: 0, z: 1 },
  { src: art.crowd[6], label: 'Overexcited uncle',   bobMs: 950,  scale: 0.98, x: 90, y: 0, z: 1 },
  { src: art.crowd[7], label: 'Back guy',            bobMs: 1700, scale: 0.78, x: 4,  y: 0, z: 0 },
];

const MOBILE_CHARACTERS = [
  { src: art.crowdMobile[0], label: 'Mobile 1', bobMs: 1100, scale: 0.85, x: 8,  y: 0, z: 1 },
  { src: art.crowdMobile[1], label: 'Mobile 2', bobMs: 1200, scale: 0.95, x: 38, y: 0, z: 1 },
  { src: art.crowdMobile[2], label: 'Mobile 3', bobMs: 950,  scale: 0.88, x: 64, y: 0, z: 1 },
  { src: art.crowdMobile[3], label: 'Mobile 4', bobMs: 1400, scale: 0.8,  x: 88, y: 0, z: 1 },
];

export function Crowd({ isMobile = false }: CrowdProps) {
  const [hasArt, setHasArt] = useState<boolean | null>(null);
  const { isPlaying, partyEnergy } = useParty();

  useEffect(() => {
    artExists(art.crowd[0]).then(setHasArt);
  }, []);

  const chars = isMobile ? MOBILE_CHARACTERS : CHARACTERS;

  return (
    <div
      className="pw-crowd"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 4,
      }}
      aria-label="The crowd"
    >
      {chars.map((c, i) => {
        const amplitude = isPlaying ? 8 + (partyEnergy / 100) * 10 : 3;
        const isJumper = c.label.toLowerCase().includes('jump') || c.label === 'Jumping friend';
        const anim = isPlaying
            ? (isJumper ? `pw-crowd-bob-jump ${c.bobMs}ms ease-in-out infinite alternate` : `pw-crowd-bob ${c.bobMs}ms ease-in-out infinite alternate`)
            : `pw-crowd-bob-slow ${c.bobMs * 1.6}ms ease-in-out infinite alternate`;

        return (
          <div
            key={c.label + i}
            className="pw-crowd-char"
            style={{
              position: 'absolute',
              left: `${c.x}%`,
              bottom: c.z === 0 ? '4%' : '8%',
              transform: `translateX(-50%) scale(${c.scale})`,
              transformOrigin: 'bottom center',
              width: 'clamp(80px, 14vw, 180px)',
              aspectRatio: '1 / 1.3',
              animation: anim,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.45))',
              ['--amplitude' as string]: `${amplitude}px`,
            } as React.CSSProperties}
            aria-label={c.label}
          >
            {hasArt ? (
              <img
                src={c.src}
                alt={c.label}
                loading="lazy"
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <InlineCrowdCharacter index={i} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Inline-SVG crowd characters (fallback) ────────────────────────────────
// Eight unique little characters. Drawn with simple shapes but with real
// human proportions, clothing, and personality.

function InlineCrowdCharacter({ index }: { index: number }) {
  // Pick a different character based on index
  switch (index) {
    case 0: return <CollegeGuy />;
    case 1: return <PhoneGirl />;
    case 2: return <SunglassesGuy />;
    case 3: return <JumpingFriend />;
    case 4: return <RecordingPerson />;
    case 5: return <Couple />;
    case 6: return <OverexcitedUncle />;
    case 7: return <BackGuy />;
    default: return <CollegeGuy />;
  }
}

function PersonBase({
  shirt, pants, hair, skin, arms, headTilt = 0,
}: {
  shirt: string; pants: string; hair: string; skin: string;
  arms: React.ReactNode; scale?: number; headTilt?: number;
}) {
  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%" aria-hidden>
      <defs>
        <linearGradient id={`skin-${shirt}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lighten(skin, 0.1)} />
          <stop offset="100%" stopColor={skin} />
        </linearGradient>
      </defs>
      {/* Shadow */}
      <ellipse cx="100" cy="252" rx="55" ry="6" fill="rgba(0,0,0,0.35)" />
      {/* Legs */}
      <rect x="80" y="180" width="16" height="68" fill={pants} rx="3" />
      <rect x="104" y="180" width="16" height="68" fill={pants} rx="3" />
      {/* Shoes */}
      <ellipse cx="88" cy="248" rx="13" ry="5" fill="#14101c" />
      <ellipse cx="112" cy="248" rx="13" ry="5" fill="#14101c" />
      {/* Torso */}
      <path
        d="M 60 100 L 70 200 L 130 200 L 140 100 Z"
        fill={shirt}
        stroke="#14101c"
        strokeWidth="2"
      />
      {/* Arms layer (passed in) */}
      {arms}
      {/* Neck */}
      <rect x="92" y="90" width="16" height="14" fill={`url(#skin-${shirt})`} stroke="#14101c" strokeWidth="1.5" />
      {/* Head */}
      <g
        style={{
          transformOrigin: '100px 60px',
          transform: `rotate(${headTilt}deg)`,
        }}
      >
        <ellipse cx="100" cy="60" rx="28" ry="32" fill={`url(#skin-${shirt})`} stroke="#14101c" strokeWidth="2" />
        {/* Hair */}
        <path d={hair} fill="#14101c" />
        {/* Eyes */}
        <circle cx="88" cy="60" r="2.5" fill="#14101c" />
        <circle cx="112" cy="60" r="2.5" fill="#14101c" />
        {/* Smile */}
        <path d="M 90 75 Q 100 82 110 75" fill="none" stroke="#14101c" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// Helper: lighten a hex color
function lighten(hex: string, amt: number): string {
  const c = hex.replace('#', '');
  const r = Math.min(255, parseInt(c.slice(0,2), 16) + Math.round(amt * 255));
  const g = Math.min(255, parseInt(c.slice(2,4), 16) + Math.round(amt * 255));
  const b = Math.min(255, parseInt(c.slice(4,6), 16) + Math.round(amt * 255));
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

function CollegeGuy() {
  return (
    <PersonBase
      shirt="#19d3da"
      pants="#14101c"
      skin="#e2a87a"
      hair="M 70 55 Q 78 28 100 25 Q 122 28 130 55 Q 130 42 120 36 L 110 50 L 95 32 L 85 50 L 80 36 Q 70 42 70 55 Z"
      arms={
        <g>
          <rect x="50" y="105" width="16" height="60" fill="#19d3da" stroke="#14101c" strokeWidth="2" rx="4"
            style={{ transformOrigin: '60px 110px', transform: 'rotate(-50deg)' }} />
          <rect x="134" y="105" width="16" height="60" fill="#19d3da" stroke="#14101c" strokeWidth="2" rx="4"
            style={{ transformOrigin: '140px 110px', transform: 'rotate(50deg)' }} />
          <circle cx="44" cy="170" r="8" fill="#e2a87a" stroke="#14101c" strokeWidth="1.5" />
          <circle cx="156" cy="170" r="8" fill="#e2a87a" stroke="#14101c" strokeWidth="1.5" />
        </g>
      }
    />
  );
}

function PhoneGirl() {
  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%" aria-hidden>
      <ellipse cx="100" cy="252" rx="55" ry="6" fill="rgba(0,0,0,0.35)" />
      {/* Skirt + legs */}
      <path d="M 60 160 L 50 220 L 150 220 L 140 160 Z" fill="#6b1535" />
      <rect x="80" y="218" width="16" height="32" fill="#e2a87a" />
      <rect x="104" y="218" width="16" height="32" fill="#e2a87a" />
      <ellipse cx="88" cy="252" rx="13" ry="5" fill="#14101c" />
      <ellipse cx="112" cy="252" rx="13" ry="5" fill="#14101c" />
      {/* Top */}
      <path d="M 65 100 L 72 165 L 128 165 L 135 100 Z" fill="#ff3d77" stroke="#14101c" strokeWidth="2" />
      {/* Arm holding phone */}
      <rect x="120" y="110" width="16" height="60" fill="#ff3d77" stroke="#14101c" strokeWidth="2" rx="4"
        style={{ transformOrigin: '130px 115px', transform: 'rotate(-25deg)' }} />
      <rect x="40" y="110" width="16" height="60" fill="#ff3d77" stroke="#14101c" strokeWidth="2" rx="4"
        style={{ transformOrigin: '48px 115px', transform: 'rotate(15deg)' }} />
      <circle cx="48" cy="172" r="8" fill="#e2a87a" stroke="#14101c" strokeWidth="1.5" />
      {/* Phone */}
      <rect x="130" y="155" width="14" height="22" fill="#14101c" stroke="#14101c" strokeWidth="1.5" rx="2" />
      <rect x="132" y="158" width="10" height="14" fill="#19d3da" />
      {/* Neck + head */}
      <rect x="92" y="90" width="16" height="14" fill="#e2a87a" stroke="#14101c" strokeWidth="1.5" />
      <ellipse cx="100" cy="60" rx="28" ry="32" fill="#e2a87a" stroke="#14101c" strokeWidth="2" />
      {/* Long hair */}
      <path d="M 70 50 Q 65 90 75 110 L 80 95 Q 75 80 78 55 Q 88 35 100 30 Q 112 35 122 55 Q 125 80 120 95 L 125 110 Q 135 90 130 50 Q 125 25 100 22 Q 75 25 70 50 Z" fill="#14101c" />
      <circle cx="88" cy="60" r="2.5" fill="#14101c" />
      <circle cx="112" cy="60" r="2.5" fill="#14101c" />
      <path d="M 90 75 Q 100 80 110 75" fill="none" stroke="#14101c" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SunglassesGuy() {
  return (
    <PersonBase
      shirt="#f6b73c"
      pants="#14101c"
      skin="#c8855a"
      hair="M 72 50 Q 80 22 100 20 Q 120 22 128 50 Q 128 38 115 35 L 100 45 L 85 35 Q 72 38 72 50 Z"
      arms={
        <g>
          <rect x="48" y="110" width="16" height="60" fill="#f6b73c" stroke="#14101c" strokeWidth="2" rx="4"
            style={{ transformOrigin: '60px 115px', transform: 'rotate(-30deg)' }} />
          <rect x="136" y="110" width="16" height="60" fill="#f6b73c" stroke="#14101c" strokeWidth="2" rx="4"
            style={{ transformOrigin: '140px 115px', transform: 'rotate(70deg)' }} />
          <circle cx="50" cy="170" r="8" fill="#c8855a" stroke="#14101c" strokeWidth="1.5" />
          {/* Pointing finger */}
          <path d="M 145 165 L 165 155" stroke="#c8855a" strokeWidth="6" strokeLinecap="round" />
        </g>
      }
    >
      {/* Override head to add round sunglasses */}
    </PersonBase>
  );
}

function JumpingFriend() {
  return (
    <PersonBase
      shirt="#5fb87a"
      pants="#6b1535"
      skin="#d8a070"
      hair="M 72 50 Q 82 22 100 22 Q 118 22 128 50 Q 128 35 110 30 L 100 38 L 90 30 Q 72 35 72 50 Z"
      arms={
        <g>
          <rect x="58" y="105" width="16" height="60" fill="#5fb87a" stroke="#14101c" strokeWidth="2" rx="4"
            style={{ transformOrigin: '70px 110px', transform: 'rotate(-110deg)' }} />
          <rect x="126" y="105" width="16" height="60" fill="#5fb87a" stroke="#14101c" strokeWidth="2" rx="4"
            style={{ transformOrigin: '130px 110px', transform: 'rotate(110deg)' }} />
          <circle cx="36" cy="100" r="8" fill="#d8a070" stroke="#14101c" strokeWidth="1.5" />
          <circle cx="164" cy="100" r="8" fill="#d8a070" stroke="#14101c" strokeWidth="1.5" />
        </g>
      }
    />
  );
}

function RecordingPerson() {
  return (
    <PersonBase
      shirt="#ff3d77"
      pants="#14101c"
      skin="#b97a4f"
      hair="M 72 50 Q 80 22 100 22 Q 120 22 128 50 Q 128 38 115 32 L 100 42 L 85 32 Q 72 38 72 50 Z"
      arms={
        <g>
          <rect x="50" y="110" width="16" height="60" fill="#ff3d77" stroke="#14101c" strokeWidth="2" rx="4"
            style={{ transformOrigin: '62px 115px', transform: 'rotate(-60deg)' }} />
          <rect x="134" y="110" width="16" height="60" fill="#ff3d77" stroke="#14101c" strokeWidth="2" rx="4"
            style={{ transformOrigin: '140px 115px', transform: 'rotate(-25deg)' }} />
          <circle cx="42" cy="160" r="8" fill="#b97a4f" stroke="#14101c" strokeWidth="1.5" />
          {/* Phone */}
          <rect x="138" y="155" width="14" height="22" fill="#14101c" rx="2" />
          <rect x="140" y="158" width="10" height="14" fill="#f6b73c" />
        </g>
      }
    />
  );
}

function Couple() {
  return (
    <svg viewBox="0 0 220 260" width="100%" height="100%" aria-hidden>
      <ellipse cx="110" cy="252" rx="60" ry="6" fill="rgba(0,0,0,0.35)" />
      {/* Left figure (saree / dress) */}
      <g>
        <path d="M 30 160 L 20 230 L 80 230 L 70 160 Z" fill="#6b1535" />
        <rect x="42" y="225" width="12" height="22" fill="#d8a070" />
        <rect x="56" y="225" width="12" height="22" fill="#d8a070" />
        <path d="M 30 100 L 38 165 L 78 165 L 86 100 Z" fill="#ff3d77" stroke="#14101c" strokeWidth="2" />
        <rect x="20" y="110" width="12" height="55" fill="#ff3d77" stroke="#14101c" strokeWidth="1.5" rx="3"
          style={{ transformOrigin: '30px 115px', transform: 'rotate(20deg)' }} />
        <rect x="78" y="110" width="12" height="55" fill="#ff3d77" stroke="#14101c" strokeWidth="1.5" rx="3"
          style={{ transformOrigin: '88px 115px', transform: 'rotate(-10deg)' }} />
        <circle cx="76" cy="170" r="6" fill="#d8a070" stroke="#14101c" strokeWidth="1.5" />
        <ellipse cx="55" cy="60" rx="22" ry="26" fill="#d8a070" stroke="#14101c" strokeWidth="2" />
        <path d="M 35 50 Q 40 25 55 22 Q 70 25 75 50 Q 75 40 60 38 L 55 45 L 50 38 Q 35 40 35 50 Z" fill="#14101c" />
      </g>
      {/* Right figure (suit) — arm around left */}
      <g>
        <rect x="100" y="180" width="14" height="65" fill="#14101c" />
        <rect x="120" y="180" width="14" height="65" fill="#14101c" />
        <ellipse cx="107" cy="248" rx="11" ry="5" fill="#14101c" />
        <ellipse cx="127" cy="248" rx="11" ry="5" fill="#14101c" />
        <path d="M 90 100 L 98 195 L 142 195 L 150 100 Z" fill="#2a1f3a" stroke="#14101c" strokeWidth="2" />
        {/* Arm reaching to left figure's shoulder */}
        <rect x="75" y="110" width="60" height="14" fill="#2a1f3a" stroke="#14101c" strokeWidth="2" rx="4"
          style={{ transformOrigin: '135px 115px', transform: 'rotate(-15deg) translate(0, -10px)' }} />
        <rect x="150" y="110" width="12" height="55" fill="#2a1f3a" stroke="#14101c" strokeWidth="1.5" rx="3" />
        <ellipse cx="120" cy="60" rx="22" ry="26" fill="#c8855a" stroke="#14101c" strokeWidth="2" />
        <path d="M 100 50 Q 108 22 120 22 Q 132 22 140 50 Q 140 38 120 35 Q 100 38 100 50 Z" fill="#14101c" />
        <rect x="108" y="105" width="24" height="6" fill="#f6b73c" />
      </g>
    </svg>
  );
}

function OverexcitedUncle() {
  return (
    <PersonBase
      shirt="#f6ecd9"
      pants="#3a2a4f"
      skin="#c8855a"
      hair="M 70 45 Q 80 20 100 20 Q 120 20 130 45 Q 130 35 120 32 L 110 28 L 100 32 L 90 28 L 80 32 Q 70 35 70 45 Z"
      arms={
        <g>
          <rect x="50" y="110" width="16" height="60" fill="#f6ecd9" stroke="#14101c" strokeWidth="2" rx="4"
            style={{ transformOrigin: '62px 115px', transform: 'rotate(-70deg)' }} />
          <rect x="134" y="110" width="16" height="60" fill="#f6ecd9" stroke="#14101c" strokeWidth="2" rx="4"
            style={{ transformOrigin: '140px 115px', transform: 'rotate(70deg)' }} />
          <circle cx="34" cy="155" r="8" fill="#c8855a" stroke="#14101c" strokeWidth="1.5" />
          <circle cx="166" cy="155" r="8" fill="#c8855a" stroke="#14101c" strokeWidth="1.5" />
        </g>
      }
    >
      {/* Moustache + bald top */}
    </PersonBase>
  );
}

function BackGuy() {
  // Smaller, arms crossed, slightly turned
  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%" aria-hidden>
      <ellipse cx="100" cy="252" rx="40" ry="5" fill="rgba(0,0,0,0.35)" />
      <rect x="84" y="180" width="14" height="65" fill="#3a2a4f" />
      <rect x="102" y="180" width="14" height="65" fill="#3a2a4f" />
      <ellipse cx="91" cy="248" rx="10" ry="4" fill="#14101c" />
      <ellipse cx="109" cy="248" rx="10" ry="4" fill="#14101c" />
      <path d="M 65 100 L 75 200 L 125 200 L 135 100 Z" fill="#19d3da" stroke="#14101c" strokeWidth="2" />
      {/* Crossed arms */}
      <rect x="65" y="115" width="70" height="14" fill="#19d3da" stroke="#14101c" strokeWidth="2" rx="4" />
      <rect x="65" y="125" width="70" height="14" fill="#19d3da" stroke="#14101c" strokeWidth="2" rx="4" />
      <ellipse cx="100" cy="60" rx="26" ry="30" fill="#d8a070" stroke="#14101c" strokeWidth="2" />
      <path d="M 75 50 Q 80 25 100 22 Q 120 25 125 50 Q 125 35 100 32 Q 75 35 75 50 Z" fill="#14101c" />
      <circle cx="88" cy="62" r="2.5" fill="#14101c" />
      <circle cx="112" cy="62" r="2.5" fill="#14101c" />
      {/* Sideways glance — mouth one-sided */}
      <path d="M 92 76 Q 100 78 105 74" fill="none" stroke="#14101c" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
