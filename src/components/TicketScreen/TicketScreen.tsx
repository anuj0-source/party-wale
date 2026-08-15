// src/components/TicketScreen/TicketScreen.tsx
// Physical-paper-ticket landing. Scan → verify → ENTER PARTY.

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Ticket } from '../../party/art/Ticket';
import { copy } from '../../lib/copy';
import './TicketScreen.css';

type ScanState = 'idle' | 'scanning' | 'verified' | 'entering';

interface TicketScreenProps {
  ticketNumber: string;
  onEnter: () => void;
}

export function TicketScreen({ ticketNumber, onEnter }: TicketScreenProps) {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setScanState('scanning'), 600);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  useEffect(() => {
    if (scanState === 'scanning') {
      timerRef.current = setTimeout(() => setScanState('verified'), 2400);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [scanState]);

  return (
    <div className="ticket-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div style={{ position: 'relative' }}>
          <Ticket
            ticketNumber={ticketNumber}
            variant={scanState === 'verified' || scanState === 'entering' ? 'verified' : 'default'}
            tilt={-1.5}
            size="md"
          >
            {/* Scan bar — overlays ticket */}
            <AnimatePresence>
              {scanState === 'scanning' && (
                <motion.div
                  className="pw-scan-bar"
                  initial={{ top: '0%', opacity: 0 }}
                  animate={{ top: '95%', opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.0, ease: 'linear' }}
                />
              )}
            </AnimatePresence>
          </Ticket>
        </div>

        <div className="ticket-status">
          <AnimatePresence mode="wait">
            {scanState === 'idle' && (
              <motion.p
                key="idle"
                className="ticket-status-text"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
              >
                {copy.ticketPreparing}
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
                {copy.ticketScanning}
              </motion.p>
            )}
            {scanState === 'verified' && (
              <motion.div
                key="verified"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}
              >
                <p className="ticket-status-text ticket-status-text--verified">
                  {copy.ticketVerified}
                </p>
                <motion.button
                  className="btn-enter"
                  onClick={() => {
                    setScanState('entering');
                    onEnter();
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {copy.ticketEnter}
                  <span className="btn-enter-arrow">→</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="ticket-screen-mark">
        printed in a <strong>backroom</strong> · since forever
      </div>
    </div>
  );
}
