import React from 'react';
import './Crowd.css';

interface CrowdProps {
  isPlaying: boolean;
  bassDropActive: boolean;
  isMobile?: boolean;
}

const CROWD_PEOPLE = [
  { emoji: '🕺', speed: 0.35, offset: 0 },
  { emoji: '💃', speed: 0.3, offset: 0.1 },
  { emoji: '🙌', speed: 0.4, offset: 0.05 },
  { emoji: '🕺', speed: 0.32, offset: 0.15 },
  { emoji: '💃', speed: 0.38, offset: 0.08 },
  { emoji: '🙌', speed: 0.28, offset: 0.2 },
  { emoji: '🕺', speed: 0.36, offset: 0.12 },
  { emoji: '💃', speed: 0.33, offset: 0.03 },
  { emoji: '🙌', speed: 0.41, offset: 0.18 },
  { emoji: '🕺', speed: 0.29, offset: 0.07 },
  { emoji: '💃', speed: 0.37, offset: 0.14 },
  { emoji: '🙌', speed: 0.34, offset: 0.09 },
];

export function Crowd({ isPlaying, bassDropActive, isMobile = false }: CrowdProps) {
  const people = isMobile ? CROWD_PEOPLE.slice(0, 7) : CROWD_PEOPLE;

  return (
    <div
      className={`crowd-wrapper ${isPlaying ? 'crowd--dancing' : 'crowd--idle'} ${bassDropActive ? 'crowd--bassdrop' : ''}`}
      aria-label="Dancing crowd"
    >
      {people.map((person, i) => (
        <div
          key={i}
          className="crowd-person"
          style={{
            '--cd-speed': `${person.speed}s`,
            '--cd-offset': `${person.offset}s`,
            '--cd-i': i,
          } as React.CSSProperties}
        >
          <span className="crowd-emoji">{person.emoji}</span>
          <div className="crowd-silhouette" />
        </div>
      ))}
    </div>
  );
}
