// src/components/PartyScene/PartyScene.tsx
// The redesigned party scene. Minimal UI, illustrated background dominates.

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParty } from '../../contexts/useParty';
import { Logo } from '../../party/art/Logo';
import { BackgroundScene } from '../../party/art/BackgroundScene';
import { DJ } from '../../party/art/DJ';
import { Crowd } from '../../party/art/Crowd';
import { YouTubePlayer } from '../YouTubePlayer/YouTubePlayer';
import { MusicPill } from '../MusicPill/MusicPill';
import { TicketChip } from '../TicketChip/TicketChip';
import { TicketModal } from '../TicketModal/TicketModal';
import { SocialLinks } from '../SocialLinks/SocialLinks';
import { Particles } from '../Particles/Particles';
import { copy } from '../../lib/copy';
import './PartyScene.css';

export function PartyScene() {
  const { isPlaying, isReady, currentSong } = useParty();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [ticketOpen, setTicketOpen] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const bgRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    document.title = `Party Wale — ${currentSong.title} (${currentSong.artist})`;
  }, [currentSong]);

  // Mouse parallax — smoothly shift the background towards the cursor
  useEffect(() => {
    if (isMobile) return;
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,   // -1 to +1
        y: (e.clientY / window.innerHeight - 0.5) * 2,  // -1 to +1
      };
    };
    window.addEventListener('mousemove', onMove);

    let currentX = 0, currentY = 0;
    const STRENGTH = 14; // max pixel shift
    const EASE = 0.06;   // smoothing (lower = slower/smoother)

    const tick = () => {
      currentX += (mouseRef.current.x * STRENGTH - currentX) * EASE;
      currentY += (mouseRef.current.y * STRENGTH - currentY) * EASE;
      if (bgRef.current) {
        bgRef.current.style.setProperty('--mx', `${currentX}px`);
        bgRef.current.style.setProperty('--my', `${currentY}px`);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile]);

  return (
    <div
      className={`party-scene ${isPlaying ? 'scene--party' : ''}`}
    >
      {/* ── Background with parallax ────────────────────────────── */}
      <div ref={bgRef} className="scene-bg" />

      {/* ── Lighting + Lasers + Particles ──────────────────────── */}
      <Lighting isPlaying={isPlaying} isMobile={isMobile} />
      <Lasers isPlaying={isPlaying} isMobile={isMobile} />
      <Particles isPlaying={isPlaying} isMobile={isMobile} />

      {/* ── Crowd (in front of booth, behind DJ) ──────────────── */}
      {/* <Crowd isMobile={isMobile} /> */}

      {/* ── DJ ──────────────────────────────────────────────────── */}
      {/* <DJ /> */}

      {/* ── Vignette + fog ──────────────────────────────────────── */}
      <div className="scene-fog" />
      <div className="scene-vignette" />

      {/* ── Loading state ───────────────────────────────────────── */}
      <AnimatePresence>
        {!isReady && (
          <motion.div
            className="scene-loading"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="scene-loading-spinner" />
            <span>{copy.partyLoading}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top-left brand ──────────────────────────────────────── */}
      <div className="scene-brand">
        <Logo size={48} tilt={-2} />
      </div>

      {/* ── Top-right chip + socials ────────────────────────────── */}
      <div className="scene-topright">
        <TicketChip onClick={() => setTicketOpen(true)} />
        <div className="scene-socials">
          <SocialLinks />
        </div>
      </div>

      {/* ── Music pill ──────────────────────────────────────────── */}
      <MusicPill />

      {/* ── Modals / overlays ──────────────────────────────────── */}
      <TicketModal isOpen={ticketOpen} onClose={() => setTicketOpen(false)} />

      {/* ── YouTube player (invisible) ──────────────────────────── */}
      <YouTubePlayer />
    </div>
  );
}

// ── Inline Lighting: warm beams + floor glow ──────────────────────────────
const BEAMS = [
  { color: '#f6b73c', delay: '0s',   duration: '2.2s', startAngle: -18, left: '12%' },
  { color: '#ff3d77', delay: '0.4s', duration: '2.8s', startAngle:  12, left: '38%' },
  { color: '#19d3da', delay: '0.8s', duration: '2.0s', startAngle:  -8, left: '62%' },
  { color: '#5fb87a', delay: '0.2s', duration: '3.0s', startAngle:  20, left: '88%' },
];

function Lighting({ isPlaying, isMobile = false }: { isPlaying: boolean; isMobile?: boolean }) {
  const beams = isMobile ? BEAMS.slice(0, 2) : BEAMS;
  return (
    <div className={`lighting ${isPlaying ? 'lighting--party' : 'lighting--dim'}`} aria-hidden>
      {beams.map((beam, i) => (
        <div
          key={i}
          className="lighting-beam"
          style={{
            ['--lc' as string]: beam.color,
            ['--ld' as string]: beam.delay,
            ['--ldu' as string]: beam.duration,
            left: beam.left,
          } as React.CSSProperties}
        />
      ))}
      <div className="lighting-floor" />
    </div>
  );
}

// ── Inline Lasers: a couple of event-driven sweep lines ────────────────────
const AMBIENT_LASERS = [
  { color: '#ff3d77', left: '8%',  top: '0%', angle: 18,  duration: '4s' },
  { color: '#19d3da', left: '90%', top: '0%', angle: -22, duration: '5s' },
];

function Lasers({ isPlaying, isMobile = false }: { isPlaying: boolean; isMobile?: boolean }) {
  if (!isPlaying) return null;
  const active = isMobile ? AMBIENT_LASERS.slice(0, 1) : AMBIENT_LASERS;
  return (
    <div className="lasers" aria-hidden>
      {active.map((laser, i) => (
        <div
          key={i}
          className="laser-line"
          style={{
            ['--lc' as string]: laser.color,
            ['--la' as string]: `${laser.angle}deg`,
            ['--ldu' as string]: laser.duration,
            left: laser.left,
            top: laser.top,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
