// src/components/TicketModal/TicketModal.tsx
// Reuses the paper Ticket artwork. Shows extra context (now playing, status, vibe).

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useParty } from '../../contexts/useParty';
import { Ticket } from '../../party/art/Ticket';
import './TicketModal.css';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TicketModal({ isOpen, onClose }: TicketModalProps) {
  const { ticketNumber, currentSong, partyEnergy, isPlaying } = useParty();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const vibe = Math.round(partyEnergy);
  const vibeLabel = vibe >= 80 ? 'MAX 🔥' : vibe >= 50 ? 'HIGH' : 'LOW';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="tm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="tm-modal"
            initial={{ opacity: 0, scale: 0.85, x: '-50%', y: 'calc(-50% + 30px)' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, x: '-50%', y: 'calc(-50% + 20px)' }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <Ticket
              ticketNumber={ticketNumber}
              variant="verified"
              tilt={-1.5}
              size="md"
            />
            <div className="tm-extras">
              <div className="tm-row">
                <span>NOW PLAYING</span>
                <span className="tm-song">{currentSong.title}</span>
              </div>
              <div className="tm-row">
                <span>STATUS</span>
                <span className={isPlaying ? 'tm-live' : 'tm-paused'}>
                  {isPlaying ? '● LIVE' : '⏸ PAUSED'}
                </span>
              </div>
              <div className="tm-row">
                <span>VIBE</span>
                <span>{vibeLabel} — {vibe}%</span>
              </div>
            </div>
            <button className="tm-close" onClick={onClose}>ESC</button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
