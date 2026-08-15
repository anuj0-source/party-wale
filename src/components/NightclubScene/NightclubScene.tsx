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
import { PartyStats } from '../PartyStats/PartyStats';
import { ShareParty } from '../ShareParty/ShareParty';
import './NightclubScene.css';

export function NightclubScene() {
  const { isPlaying, bassDropActive, isReady } = useParty();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div className={`nightclub-scene ${isPlaying ? 'scene--party' : 'scene--ambient'}`}>
      {/* ── Ghibli Background ── */}
      <div className="scene-bg" />

      {/* ── Ambient fog overlay ── */}
      <div className="scene-fog" aria-hidden="true" />

      {/* ── Particles (canvas layer) ── */}
      <Particles isPlaying={isPlaying} bassDropActive={bassDropActive} isMobile={isMobile} />

      {/* ── Lighting beams ── */}
      <Lighting isPlaying={isPlaying} bassDropActive={bassDropActive} isMobile={isMobile} />

      {/* ── Lasers ── */}
      <Lasers isPlaying={isPlaying} bassDropActive={bassDropActive} isMobile={isMobile} />

      {/* ── Main content layout ── */}
      <div className="scene-content">

        {/* ── Top: stats + share ── */}
        <div className="scene-topbar">
          <div className="scene-brand">
            <span className="scene-brand-emoji">🎉</span>
            <span className="scene-brand-name">PARTY WALE</span>
          </div>
          {!isMobile && (
            <div className="scene-topbar-right">
              <PartyStats />
            </div>
          )}
        </div>

        {/* ── Middle: club stage ── */}
        <div className="scene-stage">
          {/* DJ at center-back */}
          <div className="scene-dj-area">
            <DJ isPlaying={isPlaying} bassDropActive={bassDropActive} />
          </div>

          {/* Bass drop text */}
          <AnimatePresence>
            {bassDropActive && (
              <motion.div
                className="scene-bassdrop-text"
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.5, y: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                🔥 BASS DROP 🔥
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading state */}
          {!isReady && (
            <div className="scene-loading">
              <div className="scene-loading-spinner" />
              <span>LOADING YOUTUBE...</span>
            </div>
          )}
        </div>

        {/* ── Crowd row ── */}
        <div className="scene-crowd-row">
          <Crowd isPlaying={isPlaying} bassDropActive={bassDropActive} isMobile={isMobile} />
        </div>

        {/* ── Bottom: controls panel ── */}
        <div className="scene-bottom">
          {/* Music controls (full width, no YT panel) */}
          <div className="scene-controls-panel">
            <MusicControls />
          </div>

          {/* Right side: stats + share on desktop */}
          {!isMobile && (
            <div className="scene-side-panel">
              <ShareParty />
            </div>
          )}
        </div>

        {/* YouTube IFrame API — invisible 1×1px, required for playback */}
        <YouTubePlayer />

        {/* ── Mobile: stats + share stacked below ── */}
        {isMobile && (
          <div className="scene-mobile-footer">
            <PartyStats />
            <ShareParty />
          </div>
        )}
      </div>

      {/* ── Scene-wide bass drop camera shake ── */}
      {bassDropActive && <div className="scene-shake-overlay" aria-hidden="true" />}
    </div>
  );
}
