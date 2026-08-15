import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParty } from '../../contexts/PartyContext';
import './TicketModal.css';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TicketModal({ isOpen, onClose }: TicketModalProps) {
  const { ticketNumber, currentSong, partyEnergy, isPlaying } = useParty();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const vibe = Math.round(partyEnergy);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="tm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="tm-modal"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            {/* Ticket card */}
            <div className="tm-ticket">
              <div className="tm-glow-border" />

              {/* Header */}
              <div className="tm-header">
                <div className="tm-logo-mark">PW</div>
                <div className="tm-brand">
                  <span className="tm-brand-main">PARTY WALE</span>
                  <span className="tm-brand-sub">EXCLUSIVE ENTRY PASS</span>
                </div>
                <div className="tm-logo-mark">VIP</div>
              </div>

              {/* Divider with notches */}
              <div className="tm-divider">
                <div className="tm-notch tm-notch--left" />
                <div className="tm-dashes" />
                <div className="tm-notch tm-notch--right" />
              </div>

              {/* Info rows */}
              <div className="tm-info">
                <div className="tm-row">
                  <span className="tm-label">TICKET NO.</span>
                  <span className="tm-value">#{ticketNumber}</span>
                </div>
                <div className="tm-row">
                  <span className="tm-label">VENUE</span>
                  <span className="tm-value">PARTY WALE HQ</span>
                </div>
                <div className="tm-row">
                  <span className="tm-label">DATE</span>
                  <span className="tm-value">TONIGHT</span>
                </div>
                <div className="tm-row">
                  <span className="tm-label">CLASS</span>
                  <span className="tm-value tm-value--vip">VIP ACCESS</span>
                </div>
                <div className="tm-row">
                  <span className="tm-label">NOW PLAYING</span>
                  <span className="tm-value tm-value--song">{currentSong.title}</span>
                </div>
                <div className="tm-row">
                  <span className="tm-label">STATUS</span>
                  <span className="tm-value">{isPlaying ? 'LIVE' : 'PAUSED'}</span>
                </div>
                <div className="tm-row">
                  <span className="tm-label">VIBE</span>
                  <span className="tm-value">{vibe >= 80 ? 'MAX' : vibe >= 50 ? 'HIGH' : 'LOW'} — {vibe}%</span>
                </div>
              </div>

              {/* Divider */}
              <div className="tm-divider">
                <div className="tm-notch tm-notch--left" />
                <div className="tm-dashes" />
                <div className="tm-notch tm-notch--right" />
              </div>

              {/* Barcode */}
              <div className="tm-barcode-section">
                <div className="tm-barcode">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="tm-bar" style={{ width: `${i % 3 === 0 ? 2 : 1}px` }} />
                  ))}
                </div>
                <span className="tm-barcode-num">{ticketNumber}-PW-{new Date().getFullYear()}</span>
              </div>

              {/* Close */}
              <button className="tm-close" onClick={onClose} aria-label="Close ticket">
                ESC
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
