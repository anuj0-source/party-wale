import React from 'react';
import './DJ.css';

interface DJProps {
  isPlaying: boolean;
  bassDropActive: boolean;
}

export function DJ({ isPlaying, bassDropActive }: DJProps) {
  return (
    <div
      className={`dj-wrapper ${isPlaying ? 'dj--dancing' : 'dj--idle'} ${bassDropActive ? 'dj--bassdrop' : ''}`}
      aria-label="DJ booth"
    >
      {/* Booth */}
      <div className="dj-booth">
        <div className="dj-booth-screen">
          {isPlaying ? (
            <div className="dj-booth-waveform">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="dj-waveform-bar" style={{ '--bi': i } as React.CSSProperties} />
              ))}
            </div>
          ) : (
            <span className="dj-booth-idle-text">❚❚</span>
          )}
        </div>
        <div className="dj-booth-controls">
          <div className="dj-knob" />
          <div className="dj-knob dj-knob--big" />
          <div className="dj-knob" />
        </div>
        <div className="dj-booth-platter">
          <div className="dj-platter" />
          <div className="dj-platter" />
        </div>
      </div>

      {/* DJ Character */}
      <div className="dj-character">
        {/* Head */}
        <div className="dj-head">
          <div className="dj-headphones">
            <div className="dj-headphone dj-headphone--left" />
            <div className="dj-headphone dj-headphone--right" />
            <div className="dj-headband" />
          </div>
          <div className="dj-face">
            <div className="dj-eyes">
              <div className="dj-eye" />
              <div className="dj-eye" />
            </div>
          </div>
        </div>
        {/* Body */}
        <div className="dj-body">
          <div className="dj-arm dj-arm--left" />
          <div className="dj-torso" />
          <div className="dj-arm dj-arm--right" />
        </div>
      </div>

      {/* Bass drop flash */}
      {bassDropActive && (
        <div className="dj-bassdrop-flash" aria-hidden="true" />
      )}
    </div>
  );
}
