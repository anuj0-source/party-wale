import React from 'react';
import './DJ.css';

interface DJProps {
  isPlaying: boolean;
  bassDropActive: boolean;
}

/**
 * DJ component — rendered as an atmospheric spotlight + booth glow layer.
 * The actual illustrated DJ is part of the background image.
 * This component adds:
 *   - A radial spotlight halo centered on the background's DJ position
 *   - A subtle booth glow that pulses with the music
 *   - A bass drop flash burst
 *
 * This makes the background DJ feel "live" and integrated without
 * placing a competing CSS stick figure over him.
 */
export function DJ({ isPlaying, bassDropActive }: DJProps) {
  return (
    <div
      className={`dj-overlay ${isPlaying ? 'dj--playing' : 'dj--idle'} ${bassDropActive ? 'dj--bassdrop' : ''}`}
      aria-label="DJ booth"
    >
      {/* Booth backlight glow — behind the DJ */}
      <div className="dj-booth-glow" />

      {/* Spotlight halo from above */}
      <div className="dj-spotlight" />

      {/* Inner warm lamp glow (matches the warm ceiling lamps in bg) */}
      <div className="dj-lamp-glow" />

      {/* Waveform visualizer on the "screen" area */}
      {isPlaying && (
        <div className="dj-waveform" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="dj-waveform-bar"
              style={{ '--bi': i } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* Bass drop burst */}
      {bassDropActive && (
        <div className="dj-bassdrop-burst" aria-hidden="true" />
      )}
    </div>
  );
}
