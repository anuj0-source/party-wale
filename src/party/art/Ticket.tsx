// src/party/art/Ticket.tsx
// Paper-style ticket with the PARTY WALE stamp + handwritten details.
// Variants: default | verified | tornTop | tornBottom

import React from 'react';
import { motion } from 'framer-motion';

export type TicketVariant = 'default' | 'verified' | 'tornTop' | 'tornBottom';

interface TicketProps {
  ticketNumber: string;
  variant?: TicketVariant;
  tilt?: number;          // base rotation in degrees
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const SIZES: Record<NonNullable<TicketProps['size']>, { w: number; font: number; pad: number }> = {
  sm: { w: 320, font: 0.85, pad: 16 },
  md: { w: 380, font: 1.0,  pad: 22 },
  lg: { w: 460, font: 1.15, pad: 30 },
};

export function Ticket({
  ticketNumber,
  variant = 'default',
  tilt = -1.5,
  size = 'md',
  className = '',
  style,
  children,
}: TicketProps) {
  const sz = SIZES[size];
  // For torn variants, we just clip a half of the ticket via a ragged mask
  const tornClip = variant === 'tornTop'
    ? 'polygon(0 0, 100% 0, 100% 48%, 96% 50%, 100% 52%, 100% 0, 0 0)' // actually: half top
    : variant === 'tornBottom'
      ? 'polygon(0 100%, 100% 100%, 100% 50%, 96% 52%, 100% 50%, 0 50%)'
      : undefined;

  // The full-content ticket is the same in all variants; clip is on the wrapper.
  return (
    <div
      className={`pw-ticket pw-ticket--${variant} ${className}`}
      style={{
        position: 'relative',
        width: sz.w,
        maxWidth: '92vw',
        fontSize: `${sz.font}rem`,
        padding: sz.pad,
        transform: `rotate(${tilt}deg)`,
        background: 'linear-gradient(180deg, var(--paper) 0%, var(--paper-deep) 100%)',
        color: 'var(--ink)',
        borderRadius: 6,
        boxShadow: 'var(--shadow-paper)',
        clipPath: tornClip,
        fontFamily: 'Inter, sans-serif',
        ...style,
      }}
    >
      {/* Subtle paper grain via SVG noise */}
      <svg
        aria-hidden
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08, pointerEvents: 'none', mixBlendMode: 'multiply' }}
      >
        <filter id="pw-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#pw-noise)" />
      </svg>

      {/* Tape on top corners */}
      {variant === 'default' || variant === 'verified' ? (
        <>
          <span className="pw-tape pw-tape--tl" />
          <span className="pw-tape pw-tape--tr" />
        </>
      ) : null}

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              fontFamily: 'Caveat, cursive',
              fontSize: '1.05rem',
              color: 'var(--maroon)',
              transform: 'rotate(-3deg)',
            }}
          >
            P.W. presents
          </div>
          <div
            style={{
              fontFamily: 'Caveat, cursive',
              fontSize: '1.05rem',
              color: 'var(--maroon)',
              transform: 'rotate(2deg)',
            }}
          >
            ★ since forever
          </div>
        </div>

        {/* Big title */}
        <div
          style={{
            fontFamily: 'Fraunces, serif',
            fontWeight: 900,
            fontSize: '2.2rem',
            lineHeight: 1,
            letterSpacing: '0.04em',
            color: 'var(--ink)',
            textAlign: 'center',
            margin: '10px 0 2px',
            transform: 'rotate(-0.6deg)',
          }}
        >
          PARTY WALE
        </div>

        {/* Stamp */}
        <div
          style={{
            display: 'inline-block',
            margin: '4px auto 12px',
            padding: '4px 10px',
            border: '2px solid var(--maroon)',
            color: 'var(--maroon)',
            fontFamily: 'Fraunces, serif',
            fontWeight: 800,
            fontSize: '0.78rem',
            letterSpacing: '0.3em',
            transform: 'rotate(-4deg)',
          }}
        >
          ENTRY PASS
        </div>

        {/* Info rows */}
        <div style={{ display: 'grid', gap: 6, marginTop: 8, marginBottom: 10 }}>
          <Row label="TICKET NO." value={`#${ticketNumber}`} />
          <Row label="VENUE" value="GOD KNOWS WHERE" />
          <Row label="TIME" value="JAB MANN KARE" />
          <Row label="ENTRY" value="ONE GOOD VIBE" />
          <Row label="CLASS" value="VIP ★" accent />
        </div>

        {/* Perforation divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '6px 0 12px',
            position: 'relative',
          }}
        >
          <span
            style={{
              width: 18, height: 18, borderRadius: '50%',
              background: 'var(--ink)', marginLeft: -sz.pad - 2,
            }}
          />
          <div
            style={{
              flex: 1,
              height: 0,
              borderTop: '2px dashed rgba(20,16,28,0.4)',
            }}
          />
          <span
            style={{
              width: 18, height: 18, borderRadius: '50%',
              background: 'var(--ink)', marginRight: -sz.pad - 2,
            }}
          />
        </div>

        {/* Barcode */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 1, height: 44, alignItems: 'stretch' }}>
          {Array.from({ length: 50 }).map((_, i) => {
            const w = (i * 7) % 5 === 0 ? 3 : (i % 3 === 0 ? 2 : 1);
            return (
              <span
                key={i}
                style={{
                  display: 'block',
                  width: w,
                  background: 'rgba(20,16,28,0.85)',
                  borderRadius: 1,
                }}
              />
            );
          })}
        </div>
        <div
          style={{
            fontFamily: 'Inter, monospace',
            fontSize: '0.7rem',
            textAlign: 'center',
            color: 'rgba(20,16,28,0.6)',
            marginTop: 4,
            letterSpacing: '0.1em',
          }}
        >
          {ticketNumber}-PW-{new Date().getFullYear()}
        </div>

        {/* Footer note */}
        <div
          style={{
            fontFamily: 'Caveat, cursive',
            color: 'var(--maroon)',
            fontSize: '0.95rem',
            textAlign: 'center',
            marginTop: 10,
            transform: 'rotate(-1deg)',
          }}
        >
          presented to the bouncer who is probably also the DJ
        </div>

        {/* Verified stamp overlay */}
        {variant === 'verified' && (
          <motion.div
            initial={{ scale: 2, rotate: -25, opacity: 0 }}
            animate={{ scale: 1, rotate: -12, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            style={{
              position: 'absolute',
              right: 18,
              bottom: 60,
              padding: '6px 14px',
              border: '3px solid var(--leaf)',
              color: 'var(--leaf)',
              fontFamily: 'Fraunces, serif',
              fontWeight: 900,
              fontSize: '1.2rem',
              letterSpacing: '0.18em',
              borderRadius: 4,
              background: 'rgba(95,184,122,0.08)',
              transformOrigin: 'center',
              pointerEvents: 'none',
            }}
          >
            VERIFIED ✓
          </motion.div>
        )}

        {children}
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: '0.62rem',
          letterSpacing: '0.18em',
          color: 'rgba(20,16,28,0.55)',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: 'Fraunces, serif',
          fontWeight: 800,
          fontSize: '0.95rem',
          color: accent ? 'var(--mustard)' : 'var(--ink)',
          textShadow: accent ? '0 0 0 currentColor' : undefined,
          letterSpacing: '0.04em',
        }}
      >
        {value}
      </span>
    </div>
  );
}
