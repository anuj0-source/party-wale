import React from 'react';
import './Lasers.css';

interface LasersProps {
  isPlaying: boolean;
  bassDropActive: boolean;
  isMobile?: boolean;
}

const LASERS = [
  { color: '#ff0090', x1: '0%', y1: '40%', angle: 25, duration: '1.8s', delay: '0s' },
  { color: '#00ffff', x1: '100%', y1: '30%', angle: -20, duration: '2.2s', delay: '0.3s' },
  { color: '#ffcc00', x1: '0%', y1: '60%', angle: 18, duration: '1.5s', delay: '0.6s' },
  { color: '#aa00ff', x1: '100%', y1: '70%', angle: -28, duration: '2.5s', delay: '0.1s' },
  { color: '#00ff88', x1: '20%', y1: '0%', angle: 35, duration: '1.9s', delay: '0.8s' },
  { color: '#ff6600', x1: '80%', y1: '0%', angle: -35, duration: '2s', delay: '0.4s' },
];

export function Lasers({ isPlaying, bassDropActive, isMobile = false }: LasersProps) {
  const lasers = isMobile ? LASERS.slice(0, 3) : LASERS;

  return (
    <div
      className={`lasers-wrapper ${isPlaying ? 'lasers--party' : 'lasers--dim'} ${bassDropActive ? 'lasers--bassdrop' : ''}`}
    >
      {lasers.map((laser, i) => (
        <div
          key={i}
          className="laser-line"
          style={{
            '--lc': laser.color,
            '--la': `${laser.angle}deg`,
            '--ldu': laser.duration,
            '--ld': laser.delay,
            left: laser.x1,
            top: laser.y1,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
