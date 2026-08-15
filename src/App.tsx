import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PartyProvider, useParty } from './contexts/PartyContext';
import { TicketVerification } from './components/TicketVerification/TicketVerification';
import { PartyEntry } from './components/PartyEntry/PartyEntry';
import { NightclubScene } from './components/NightclubScene/NightclubScene';

// ── Inner app reads from context ─────────────────────────────────────────────
function AppInner() {
  const { phase, setPhase, ticketNumber } = useParty();

  return (
    <AnimatePresence mode="wait">
      {phase === 'ticket' && (
        <motion.div
          key="ticket"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
          style={{ position: 'fixed', inset: 0, zIndex: 100 }}
        >
          <TicketVerification
            ticketNumber={ticketNumber}
            onEnter={() => setPhase('entry')}
          />
        </motion.div>
      )}

      {phase === 'entry' && (
        <motion.div
          key="entry"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ position: 'fixed', inset: 0, zIndex: 90 }}
        >
          <PartyEntry onComplete={() => setPhase('party')} />
        </motion.div>
      )}

      {phase === 'party' && (
        <motion.div
          key="party"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{ position: 'fixed', inset: 0, zIndex: 10 }}
        >
          <NightclubScene />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Root: wrap in provider ────────────────────────────────────────────────────
export default function App() {
  return (
    <PartyProvider>
      <AppInner />
    </PartyProvider>
  );
}
