import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TicketVerification.css';

type ScanState = 'idle' | 'scanning' | 'verified' | 'entering';

interface TicketVerificationProps {
  ticketNumber: string;
  onEnter: () => void;
}

export function TicketVerification({ ticketNumber, onEnter }: TicketVerificationProps) {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Auto-start scan after brief pause
    timerRef.current = setTimeout(() => setScanState('scanning'), 600);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  useEffect(() => {
    if (scanState === 'scanning') {
      timerRef.current = setTimeout(() => setScanState('verified'), 2800);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [scanState]);

  return (
    <div className="ticket-screen">
      {/* Background particles */}
      <div className="tv-particles" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="tv-particle" style={{ '--i': i } as React.CSSProperties} />
        ))}
      </div>

      <motion.div
        className="ticket-container"
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* Ticket card */}
        <div className={`ticket-card ${scanState === 'verified' || scanState === 'entering' ? 'ticket-card--verified' : ''}`}>
          {/* Glow border */}
          <div className="ticket-glow-border" />

          {/* Header */}
          <div className="ticket-header">
            <div className="ticket-logo-mark">PW</div>
            <div className="ticket-brand">
              <span className="ticket-brand-main">PARTY WALE</span>
              <span className="ticket-brand-sub">EXCLUSIVE ENTRY PASS</span>
            </div>
            <div className="ticket-logo-mark">VIP</div>
          </div>

          {/* Divider */}
          <div className="ticket-divider">
            <div className="ticket-notch ticket-notch--left" />
            <div className="ticket-dashes" />
            <div className="ticket-notch ticket-notch--right" />
          </div>

          {/* Ticket info */}
          <div className="ticket-info">
            <div className="ticket-info-row">
              <span className="ticket-label">TICKET NO.</span>
              <span className="ticket-value">#{ticketNumber}</span>
            </div>
            <div className="ticket-info-row">
              <span className="ticket-label">VENUE</span>
              <span className="ticket-value">PARTY WALE HQ</span>
            </div>
            <div className="ticket-info-row">
              <span className="ticket-label">DATE</span>
              <span className="ticket-value">TONIGHT</span>
            </div>
            <div className="ticket-info-row">
              <span className="ticket-label">CLASS</span>
              <span className="ticket-value ticket-value--vip">VIP ACCESS</span>
            </div>
          </div>

          {/* Divider */}
          <div className="ticket-divider">
            <div className="ticket-notch ticket-notch--left" />
            <div className="ticket-dashes" />
            <div className="ticket-notch ticket-notch--right" />
          </div>

          {/* Barcode */}
          <div className="ticket-barcode-section">
            <div className="ticket-barcode">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="barcode-bar"
                  style={{ width: `${Math.random() > 0.5 ? 2 : 1}px` } as React.CSSProperties}
                />
              ))}
            </div>
            <span className="ticket-barcode-num">
              {ticketNumber}-PW-{new Date().getFullYear()}
            </span>
          </div>

          {/* Laser scanner */}
          <AnimatePresence>
            {scanState === 'scanning' && (
              <motion.div
                className="ticket-laser"
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.2, ease: 'linear' }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Status message */}
        <div className="ticket-status">
          <AnimatePresence mode="wait">
            {scanState === 'idle' && (
              <motion.p
                key="idle"
                className="ticket-status-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                PREPARING YOUR TICKET...
              </motion.p>
            )}
            {scanState === 'scanning' && (
              <motion.p
                key="scanning"
                className="ticket-status-text ticket-status-text--scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="scan-dot" />
                SCANNING YOUR TICKET...
              </motion.p>
            )}
            {scanState === 'verified' && (
              <motion.div
                key="verified"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="ticket-verified-group"
              >
                <p className="ticket-status-text ticket-status-text--verified">
                  TICKET VERIFIED
                </p>
                <motion.button
                  id="btn-enter-party"
                  className="btn-enter"
                  onClick={() => {
                    setScanState('entering');
                    onEnter();
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  ENTER THE CLUB
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
