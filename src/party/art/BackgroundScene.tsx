// src/party/art/BackgroundScene.tsx
// The illustrated Indian party interior.
// Always renders an inline-SVG scene; the .webp version is layered
// on top if /art/background-scene.webp exists.

import React, { useEffect, useState } from 'react';
import { art, artExists } from '../../lib/art-fallback';
import { useParty } from '../../contexts/useParty';

interface BackgroundSceneProps {
  isMobile?: boolean;
}

/**
 * The scene is a fixed, full-viewport background. The illustration is drawn
 * directly in SVG so it scales, themes, and animates without external assets.
 *
 * Layered, back-to-front:
 *   1. Wall (warm maroon)
 *   2. Bollywood-poster wallpaper pattern (faint)
 *   3. Two ceiling fans (rotating)
 *   4. String of fairy lights
 *   5. Disco ball + reflection
 *   6. Wall-mounted speakers (L & R)
 *   7. Hindi signage (stuck on wall)
 *   8. Two potted plants in the corners
 *   9. Bare bulb hanging on a wire
 *  10. DJ booth counter (lower third)
 *  11. EQ visualizer panel on the booth
 *  12. Floor with subtle reflection
 */
export function BackgroundScene({ isMobile = false }: BackgroundSceneProps) {
  const { partyEnergy } = useParty();
  const [hasArt, setHasArt] = useState<boolean | null>(null);
  useEffect(() => {
    artExists(isMobile ? art.backgroundMob : art.background).then(setHasArt);
  }, [isMobile]);

  // Real-art layer (designer file) sits ON TOP of the SVG scene as a
  // direct overlay. So if a designer eventually ships a hand-painted
  // background, the SVG remains as a permanent, theme-correct fallback.
  return (
    <div
      className="pw-bg"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background:
          'radial-gradient(ellipse at 50% 30%, #4a1a3a 0%, var(--maroon-deep) 45%, var(--ink) 100%)',
        zIndex: 0,
      }}
    >
      <InlineScene isMobile={isMobile} energy={partyEnergy} />

      {hasArt && (
        <img
          src={isMobile ? art.backgroundMob : art.background}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
            zIndex: 1,
            mixBlendMode: 'screen',
            opacity: 0.55,
          }}
        />
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// The inline scene
// ──────────────────────────────────────────────────────────────────────────

function InlineScene({ isMobile, energy }: { isMobile: boolean; energy: number }) {
  // isMobile reserved for future layout tweaks
  void isMobile;
  const eqBars = Array.from({ length: 18 }).map((_, i) => i);
  const eqHeight = 8 + Math.round((energy / 100) * 36);

  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      aria-hidden
    >
      <defs>
        {/* Wall texture — faint vertical bands */}
        <pattern id="wallPattern" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="rgba(0,0,0,0)" />
          <line x1="7" y1="0" x2="7" y2="14" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
        </pattern>

        {/* Paper-poster wallpaper accent */}
        <pattern id="posterDots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1.4" fill="rgba(246,183,60,0.06)" />
        </pattern>

        {/* Floor reflection gradient */}
        <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,61,119,0.18)" />
          <stop offset="60%" stopColor="rgba(25,211,218,0.04)" />
          <stop offset="100%" stopColor="rgba(20,16,28,0)" />
        </linearGradient>

        {/* Fairy-light gradient */}
        <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(246,183,60,0.55)" />
          <stop offset="100%" stopColor="rgba(246,183,60,0)" />
        </radialGradient>
      </defs>

      {/* Wall base */}
      <rect x="0" y="0" width="1600" height="900" fill="url(#wallPattern)" />
      <rect x="0" y="0" width="1600" height="900" fill="url(#posterDots)" />

      {/* Moulding (chair rail) */}
      <rect x="0" y="540" width="1600" height="6" fill="rgba(246,236,217,0.08)" />
      <rect x="0" y="546" width="1600" height="2" fill="rgba(0,0,0,0.35)" />

      {/* ── Ceiling fans (rotating) ──────────────────────────────────────── */}
      <Fan cx={300} cy={120} r={70} />
      <Fan cx={1300} cy={120} r={70} />

      {/* ── String of fairy lights ───────────────────────────────────────── */}
      <FairyLights />

      {/* ── Disco ball (centre-top) ─────────────────────────────────────── */}
      <DiscoBall cx={800} cy={170} r={42} />

      {/* ── Wall-mounted speakers ───────────────────────────────────────── */}
      <SpeakerStack x={120} y={200} />
      <SpeakerStack x={1400} y={200} flip />

      {/* ── Bare bulb hanging on a wire ─────────────────────────────────── */}
      <BareBulb x={1100} y={70} />

      {/* ── Hindi / English wall signs ──────────────────────────────────── */}
      <WallSign x={460} y={260} rotate={-4} label="DJ BHAIYA" color="#f6b73c" />
      <WallSign x={900} y={250} rotate={2}  label="आज FULL MASTI" color="#ff3d77" devanagari />
      <WallSign x={200} y={400} rotate={3}  label="बस आज की रात" color="#19d3da" devanagari small />
      <WallSign x={1180} y={380} rotate={-3} label="ENTRY FREE NAHI HAI 😭" color="#5fb87a" />
      <WallPoster x={620} y={320} />

      {/* ── Plants ──────────────────────────────────────────────────────── */}
      <Plant x={80} y={650} />
      <Plant x={1500} y={650} flip />

      {/* ── Floor ───────────────────────────────────────────────────────── */}
      <rect x="0" y="700" width="1600" height="200" fill="rgba(0,0,0,0.35)" />
      <rect x="0" y="700" width="1600" height="200" fill="url(#floorGrad)" />
      {/* Floor lines */}
      <line x1="0" y1="700" x2="1600" y2="700" stroke="rgba(246,236,217,0.05)" />
      <line x1="0" y1="900" x2="1600" y2="900" stroke="rgba(0,0,0,0.5)" />

      {/* ── DJ booth (the long counter at the front) ────────────────────── */}
      <g>
        {/* Booth body */}
        <rect x="500" y="640" width="600" height="100" fill="#1a0f24" stroke="rgba(246,236,217,0.08)" />
        {/* Booth top */}
        <rect x="490" y="630" width="620" height="20" fill="#2a1a36" stroke="rgba(246,236,217,0.1)" />
        {/* Booth face wood panels */}
        <line x1="600" y1="640" x2="600" y2="740" stroke="rgba(246,236,217,0.05)" />
        <line x1="700" y1="640" x2="700" y2="740" stroke="rgba(246,236,217,0.05)" />
        <line x1="800" y1="640" x2="800" y2="740" stroke="rgba(246,236,217,0.05)" />
        <line x1="900" y1="640" x2="900" y2="740" stroke="rgba(246,236,217,0.05)" />
        <line x1="1000" y1="640" x2="1000" y2="740" stroke="rgba(246,236,217,0.05)" />

        {/* "PW" hand-painted on the booth face */}
        <text
          x="800"
          y="725"
          textAnchor="middle"
          fontFamily="Fraunces, serif"
          fontWeight="900"
          fontSize="42"
          fill="rgba(246,183,60,0.7)"
          transform="rotate(-2 800 720)"
          style={{ letterSpacing: '0.15em' }}
        >
          PARTY WALE
        </text>

        {/* EQ visualizer panel */}
        <g transform="translate(560, 660)">
          <rect x="0" y="0" width="480" height="44" fill="rgba(0,0,0,0.5)" stroke="rgba(246,183,60,0.4)" rx="3" />
          {eqBars.map((i) => {
            const phase = (i / eqBars.length) * Math.PI * 2;
            const h = eqHeight + Math.sin(phase + performance.now() / 200) * 8;
            return (
              <rect
                key={i}
                x={6 + i * 26}
                y={42 - Math.max(4, h)}
                width="16"
                height={Math.max(4, h)}
                fill="url(#eqGrad)"
                opacity="0.85"
              />
            );
          })}
          <text
            x="240"
            y="58"
            textAnchor="middle"
            fontFamily="Caveat, cursive"
            fontSize="14"
            fill="rgba(246,236,217,0.5)"
          >
            DJ BHAIYA MIXING…
          </text>
        </g>
        <defs>
          <linearGradient id="eqGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ff3d77" />
            <stop offset="60%" stopColor="#f6b73c" />
            <stop offset="100%" stopColor="#19d3da" />
          </linearGradient>
        </defs>

        {/* Mixer knobs on either side */}
        <circle cx="540" cy="650" r="5" fill="#f6b73c" />
        <circle cx="555" cy="650" r="5" fill="#ff3d77" />
        <circle cx="1060" cy="650" r="5" fill="#19d3da" />
        <circle cx="1045" cy="650" r="5" fill="#5fb87a" />
      </g>

      {/* If the designer's photo-real version exists, hide a lot of the
          inline detail by lowering the SVG's opacity. */}
      {/* (No-op here — designer file uses mix-blend-mode: screen above.) */}
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Sub-components (kept here so the scene is self-contained)
// ──────────────────────────────────────────────────────────────────────────

function Fan({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      {/* Mount */}
      <line x1={cx} y1={0} x2={cx} y2={cy - r - 4} stroke="rgba(246,236,217,0.15)" strokeWidth="2" />
      <circle cx={cx} cy={cy - r - 4} r="4" fill="rgba(246,236,217,0.2)" />
      <g
        style={{
          transformOrigin: `${cx}px ${cy}px`,
          animation: 'pw-fan-spin 2.4s linear infinite',
        }}
      >
        <ellipse cx={cx + r * 0.6} cy={cy} rx={r * 0.7} ry={r * 0.25} fill="rgba(246,236,217,0.12)" stroke="rgba(246,236,217,0.25)" />
        <ellipse cx={cx - r * 0.6} cy={cy} rx={r * 0.7} ry={r * 0.25} fill="rgba(246,236,217,0.12)" stroke="rgba(246,236,217,0.25)" />
        <ellipse cx={cx} cy={cy + r * 0.6} rx={r * 0.25} ry={r * 0.7} fill="rgba(246,236,217,0.12)" stroke="rgba(246,236,217,0.25)" />
        <ellipse cx={cx} cy={cy - r * 0.6} rx={r * 0.25} ry={r * 0.7} fill="rgba(246,236,217,0.12)" stroke="rgba(246,236,217,0.25)" />
        <circle cx={cx} cy={cy} r="6" fill="rgba(246,236,217,0.4)" />
      </g>
    </g>
  );
}

function FairyLights() {
  const bulbs = Array.from({ length: 24 });
  return (
    <g>
      {/* Wire */}
      <path
        d="M 0 80 Q 200 130 400 100 T 800 110 T 1200 100 T 1600 80"
        fill="none"
        stroke="rgba(246,236,217,0.18)"
        strokeWidth="1.2"
      />
      {bulbs.map((_, i) => {
        const x = (i / bulbs.length) * 1600;
        // Approximate the catenary curve for y
        const t = i / bulbs.length;
        const y = 80 + Math.sin(t * Math.PI) * 35;
        const colors = ['#f6b73c', '#ff3d77', '#19d3da', '#5fb87a'];
        const c = colors[i % colors.length];
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="14" fill="url(#bulbGlow)" />
            <circle cx={x} cy={y} r="3.5" fill={c} opacity="0.9">
              <animate
                attributeName="opacity"
                values="0.6;1;0.6"
                dur={`${1.6 + (i % 5) * 0.25}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        );
      })}
    </g>
  );
}

function DiscoBall({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <line x1={cx} y1={0} x2={cx} y2={cy - r - 8} stroke="rgba(246,236,217,0.2)" strokeWidth="1.5" />
      <g
        style={{
          transformOrigin: `${cx}px ${cy}px`,
          animation: 'pw-disco-spin 6s linear infinite',
        }}
      >
        <circle cx={cx} cy={cy} r={r} fill="#1a0f24" stroke="rgba(246,236,217,0.4)" />
        {/* Faceted mirror effect */}
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const x1 = cx + Math.cos(a) * (r - 2);
          const y1 = cy + Math.sin(a) * (r - 2);
          return <line key={i} x1={cx} y1={cy} x2={x1} y2={y1} stroke="rgba(246,236,217,0.18)" strokeWidth="0.6" />;
        })}
        {Array.from({ length: 5 }).map((_, i) => (
          <circle key={i} cx={cx} cy={cy} r={r * 0.2 * (i + 1)} fill="none" stroke="rgba(246,236,217,0.1)" />
        ))}
        <circle cx={cx - r * 0.3} cy={cy - r * 0.3} r="4" fill="rgba(255,255,255,0.6)" />
      </g>
      {/* Cone of light */}
      <path
        d={`M ${cx - 30} ${cy + r} L ${cx + 30} ${cy + r} L ${cx + 200} 700 L ${cx - 200} 700 Z`}
        fill="rgba(246,183,60,0.05)"
      />
    </g>
  );
}

function SpeakerStack({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x}, ${y}) ${flip ? 'scale(-1,1)' : ''}`}>
      {/* Speaker cabinet */}
      <rect x="0" y="0" width="90" height="220" fill="#1a0f24" stroke="rgba(246,236,217,0.2)" />
      {/* Top speaker */}
      <circle cx="45" cy="55" r="28" fill="#0a0510" stroke="rgba(246,236,217,0.25)" strokeWidth="2" />
      <circle cx="45" cy="55" r="14" fill="rgba(255,61,119,0.15)" stroke="rgba(255,61,119,0.4)" />
      <circle cx="45" cy="55" r="4" fill="rgba(255,61,119,0.6)" />
      {/* Bottom speaker */}
      <circle cx="45" cy="155" r="32" fill="#0a0510" stroke="rgba(246,236,217,0.25)" strokeWidth="2" />
      <circle cx="45" cy="155" r="18" fill="rgba(25,211,218,0.15)" stroke="rgba(25,211,218,0.4)" />
      <circle cx="45" cy="155" r="6" fill="rgba(25,211,218,0.6)" />
      {/* LED bar */}
      <rect x="10" y="200" width="70" height="6" fill="rgba(0,0,0,0.5)" />
      <rect x="10" y="200" width="50" height="6" fill="var(--hot, #ff3d77)" opacity="0.8">
        <animate attributeName="width" values="20;70;35;65;20" dur="2.4s" repeatCount="indefinite" />
      </rect>
    </g>
  );
}

function BareBulb({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line x1={x} y1={0} x2={x} y2={y + 30} stroke="rgba(246,236,217,0.18)" strokeWidth="1.5" />
      <circle cx={x} cy={y + 30} r="32" fill="url(#bulbGlow)" />
      <ellipse cx={x} cy={y + 30} rx="10" ry="14" fill="#f6b73c" stroke="#14101c" strokeWidth="1.2" />
      <rect x={x - 4} y={y + 14} width="8" height="6" fill="#3a2a4f" />
    </g>
  );
}

function WallSign({
  x, y, rotate, label, color, devanagari, small,
}: { x: number; y: number; rotate: number; label: string; color: string; devanagari?: boolean; small?: boolean }) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotate})`}>
      {/* Tape */}
      <rect x="-6" y="-6" width="22" height="6" fill="rgba(246,236,217,0.25)" />
      <rect x={label.length * (small ? 5 : 7)} y="-6" width="22" height="6" fill="rgba(246,236,217,0.25)" />
      {/* Card */}
      <rect x="0" y="0" width={label.length * (small ? 10.5 : 12) + 20} height={small ? 28 : 36} fill="rgba(246,236,217,0.95)" stroke="rgba(20,16,28,0.3)" />
      <text
        x={(label.length * (small ? 10.5 : 12) + 20) / 2}
        y={small ? 19 : 24}
        textAnchor="middle"
        fontFamily={devanagari ? 'Caveat, cursive' : 'Fraunces, serif'}
        fontWeight={devanagari ? 700 : 900}
        fontSize={small ? '16' : '22'}
        fill={color}
        style={{ letterSpacing: devanagari ? '0' : '0.05em' }}
      >
        {label}
      </text>
    </g>
  );
}

function WallPoster({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="0" y="0" width="320" height="200" fill="rgba(246,183,60,0.85)" stroke="rgba(20,16,28,0.3)" />
      <rect x="0" y="0" width="320" height="200" fill="url(#posterDots)" />
      <text
        x="160"
        y="60"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontWeight="900"
        fontSize="36"
        fill="#14101c"
        transform="rotate(-3 160 50)"
      >
        आज रात
      </text>
      <text
        x="160"
        y="110"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontWeight="900"
        fontSize="40"
        fill="#6b1535"
        transform="rotate(-2 160 100)"
      >
        PARTY
      </text>
      <text
        x="160"
        y="150"
        textAnchor="middle"
        fontFamily="Caveat, cursive"
        fontSize="22"
        fill="#14101c"
      >
        no entry without vibe
      </text>
      <text
        x="160"
        y="180"
        textAnchor="middle"
        fontFamily="Caveat, cursive"
        fontSize="16"
        fill="rgba(20,16,28,0.6)"
      >
        — printed in the backroom —
      </text>
    </g>
  );
}

function Plant({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x}, ${y}) ${flip ? 'scale(-1,1)' : ''}`}>
      {/* Pot */}
      <path d="M 0 100 L 10 160 L 70 160 L 80 100 Z" fill="#6b1535" />
      <ellipse cx="40" cy="100" rx="40" ry="8" fill="#8b1f43" />
      {/* Leaves */}
      <g>
        <ellipse cx="20" cy="60" rx="20" ry="40" fill="#5fb87a" transform="rotate(-30 20 60)" />
        <ellipse cx="60" cy="55" rx="22" ry="44" fill="#3a8a55" transform="rotate(25 60 55)" />
        <ellipse cx="40" cy="30" rx="18" ry="38" fill="#5fb87a" />
        <ellipse cx="15" cy="40" rx="14" ry="28" fill="#4a9c66" transform="rotate(-15 15 40)" />
      </g>
    </g>
  );
}
