import React from 'react';
import './Lighting.css';

interface LightingProps {
  isPlaying: boolean;
  isMobile?: boolean;
}

const BEAMS = [
  { color: '#ff0090', delay: '0s', duration: '2.2s', startAngle: -20 },
  { color: '#00ffff', delay: '0.4s', duration: '2.8s', startAngle: 15 },
  { color: '#ffcc00', delay: '0.8s', duration: '2s', startAngle: -10 },
  { color: '#ff6600', delay: '0.2s', duration: '3s', startAngle: 25 },
  { color: '#aa00ff', delay: '1s', duration: '2.4s', startAngle: -30 },
  { color: '#00ff88', delay: '0.6s', duration: '1.8s', startAngle: 5 },
];

export function Lighting({ isPlaying, isMobile = false }: LightingProps) {
  const beams = isMobile ? BEAMS.slice(0, 3) : BEAMS;

  return (
    <div className={`lighting-wrapper ${isPlaying ? 'lighting--party' : 'lighting--dim'}`}>
      {beams.map((beam, i) => (
        <div
          key={i}
          className="light-beam"
          style={{
            '--lc': beam.color,
            '--ld': beam.delay,
            '--ldu': beam.duration,
            '--la': `${beam.startAngle}deg`,
            '--li': i,
          } as React.CSSProperties}
        />
      ))}
      {/* Ambient glow from floor */}
      <div className="lighting-floor-glow" />
    </div>
  );
}
