import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PartyProvider } from './contexts/PartyContext';
import { useParty } from './contexts/useParty';
import { TicketScreen } from './components/TicketScreen/TicketScreen';
import { TornTicketEntry } from './components/PartyEntry/TornTicketEntry';
import { PartyScene } from './components/PartyScene/PartyScene';

// ── Inner app reads from context ─────────────────────────────────────────────
function AppInner() {
  const { phase, setPhase, ticketNumber } = useParty();

  // Update page title for the entry phase
  useEffect(() => {
    if (phase === 'ticket') document.title = 'Party Wale — Ticket';
    if (phase === 'entry')  document.title = 'Party Wale — Entry';
  }, [phase]);

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
          <TicketScreen
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
          <TornTicketEntry
            ticketNumber={ticketNumber}
            onComplete={() => setPhase('party')}
          />
        </motion.div>
      )}

      {phase === 'party' && (
        <motion.div
          key="party"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          style={{ position: 'fixed', inset: 0, zIndex: 10 }}
        >
          <PartyScene />
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
