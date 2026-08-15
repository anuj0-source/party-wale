import React, { useState } from 'react';
import { useParty } from '../../contexts/PartyContext';
import './PartyStats.css';

export function PartyStats() {
  const { ticketNumber, isPlaying, partyEnergy, currentSong } = useParty();

  const vibe = Math.round(partyEnergy);
  const vibeLabel = vibe >= 80 ? 'MAX' : vibe >= 50 ? 'HIGH' : 'LOW';
  const statusLabel = isPlaying ? 'LIVE' : 'PAUSED';

  return (
    <div className="party-stats">
      {/* Ticket badge */}
      <div className="ps-ticket-badge">
        <div className="ps-badge-header">PARTY WALE</div>
        <div className="ps-ticket-num">TICKET #{ticketNumber}</div>
        <div className="ps-row">
          <span className="ps-label">STATUS</span>
          <span className="ps-value">{statusLabel}</span>
        </div>
        <div className="ps-row">
          <span className="ps-label">SONG</span>
          <span className="ps-value ps-song-name">{currentSong.title}</span>
        </div>
        <div className="ps-row">
          <span className="ps-label">VIBE</span>
          <span className="ps-value">{vibeLabel} {vibe}%</span>
        </div>
      </div>

      {/* Energy meter */}
      <div className="ps-energy-meter">
        <div className="ps-energy-label">
          <span>PARTY ENERGY</span>
          <span className="ps-energy-pct">{vibe}%</span>
        </div>
        <div className="ps-energy-bar-track">
          <div
            className="ps-energy-bar-fill"
            style={{ width: `${vibe}%` }}
          />
        </div>
      </div>
    </div>
  );
}
