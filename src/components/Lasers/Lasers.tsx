import React from 'react';
import './Lasers.css';

interface LasersProps {
  isPlaying: boolean;
  bassDropActive: boolean;
  isMobile?: boolean;
}

// ── Default: only 2 slow atmospheric beams ─────────────────────────────────
const AMBIENT_LASERS = [
  { color: '#ff0090', x: '10%', y: '0%', angle: 18, duration: '4s',   delay: '0s' },
  { color: '#aa00ff', x: '85%', y: '0%', angle: -22, duration: '5s',  delay: '1.5s' },
];

// ── Bass drop: full burst ──────────────────────────────────────────────────
const BASSDROP_LASERS = [
  { color: '#ff0090', x: '0%',   y: '35%', angle: 28,  duration: '0.4s', delay: '0s' },
  { color: '#00ffff', x: '100%', y: '25%', angle: -22,  duration: '0.35s', delay: '0.05s' },
  { color: '#ffcc00', x: '0%',   y: '55%', angle: 20,  duration: '0.38s', delay: '0.1s' },
  { color: '#aa00ff', x: '100%', y: '65%', angle: -30,  duration: '0.42s', delay: '0s' },
  { color: '#00ff88', x: '25%',  y: '0%',  angle: 40,  duration: '0.3s',  delay: '0.08s' },
  { color: '#ff4400', x: '75%',  y: '0%',  angle: -38,  duration: '0.32s', delay: '0.03s' },
];

export function Lasers({ isPlaying, bassDropActive, isMobile = false }: LasersProps) {
  // During idle — no lasers
  if (!isPlaying && !bassDropActive) return null;

  // Which set to show
  const activeLasers = bassDropActive
    ? (isMobile ? BASSDROP_LASERS.slice(0, 4) : BASSDROP_LASERS)
    : (isMobile ? AMBIENT_LASERS.slice(0, 1) : AMBIENT_LASERS);

  return (
    <div
      className={`lasers-wrapper ${bassDropActive ? 'lasers--bassdrop' : 'lasers--ambient'}`}
      aria-hidden="true"
    >
      {activeLasers.map((laser, i) => (
        <div
          key={`${bassDropActive ? 'bd' : 'am'}-${i}`}
          className="laser-line"
          style={{
            '--lc':  laser.color,
            '--la':  `${laser.angle}deg`,
            '--ldu': laser.duration,
            '--ld':  laser.delay,
            left:    laser.x,
            top:     laser.y,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
