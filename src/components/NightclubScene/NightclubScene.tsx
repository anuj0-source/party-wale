import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParty } from '../../contexts/PartyContext';
import { DJ } from '../DJ/DJ';
import { Crowd } from '../Crowd/Crowd';
import { Lighting } from '../Lighting/Lighting';
import { Lasers } from '../Lasers/Lasers';
import { Particles } from '../Particles/Particles';
import { YouTubePlayer } from '../YouTubePlayer/YouTubePlayer';
import { MusicControls } from '../MusicControls/MusicControls';
import { TicketModal } from '../TicketModal/TicketModal';
import { ActiveUsers } from '../ActiveUsers/ActiveUsers';
import { SocialLinks } from '../SocialLinks/SocialLinks';
import './NightclubScene.css';

export function NightclubScene() {
  const { isPlaying, isReady, ticketNumber } = useParty();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [ticketOpen, setTicketOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div className={`nightclub-scene ${isPlaying ? 'scene--party' : 'scene--ambient'}`}>

      {/* ── Layer 1: Background ── */}
      <div className="scene-bg" />

      {/* ── Vignette overlay ── */}
      <div className="scene-vignette" aria-hidden="true" />

      {/* ── Layer 2: Atmospheric fog ── */}
      <div className="scene-fog" aria-hidden="true" />

      {/* ── Layer 3: Lighting (spotlights) ── */}
      <Lighting isPlaying={isPlaying} isMobile={isMobile} />

      {/* ── Layer 4: Lasers (reduced, event-driven) ── */}
      <Lasers isPlaying={isPlaying} isMobile={isMobile} />

      {/* ── Layer 5: Particles (atmospheric dust) ── */}
      <Particles isPlaying={isPlaying} isMobile={isMobile} />

      {/* ── Layer 6: DJ at centre-back ── */}
      <div className="scene-dj-layer">
        <DJ isPlaying={isPlaying} />
      </div>


      {/* ── Loading ── */}
      {!isReady && (
        <div className="scene-loading">
          <div className="scene-loading-spinner" />
          <span>LOADING...</span>
        </div>
      )}

      {/* ── Active Users Badge ── */}
      <ActiveUsers />

      {/* ── Social Links (Top Right) ── */}
      <SocialLinks />

      {/* ── Layer 8: Top bar (minimal) ── */}
      <div className="scene-topbar">
        {/* Left: Brand */}
        <div className="scene-brand">
          <span className="scene-brand-dot" />
          <span className="scene-brand-name">PARTY WALE</span>
        </div>

        {/* Right: Ticket chip */}
        <button
          id="btn-ticket-chip"
          className="scene-ticket-chip"
          onClick={() => setTicketOpen(true)}
          title="View your ticket"
          aria-label="Open ticket"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
          </svg>
          #{ticketNumber}
        </button>
      </div>

      {/* ── Music pill (fixed, outside flow) ── */}
      <MusicControls />

      {/* ── Ticket modal ── */}
      <TicketModal isOpen={ticketOpen} onClose={() => setTicketOpen(false)} />

      {/* ── YouTube IFrame API ── */}
      <YouTubePlayer />
    </div>
  );
}
