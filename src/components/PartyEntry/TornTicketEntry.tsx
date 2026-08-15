// src/components/PartyEntry/TornTicketEntry.tsx
// After "ENTER PARTY" is clicked, the verified ticket is shown briefly,
// then splits in half along the perforation and falls away while the
// party scene fades in behind it. ~2.2s total.

import React, { useEffect } from 'react';
import { Ticket } from '../../party/art/Ticket';
import './TornTicketEntry.css';

interface TornTicketEntryProps {
  ticketNumber: string;
  onComplete: () => void;
}

export function TornTicketEntry({ ticketNumber, onComplete }: TornTicketEntryProps) {
  useEffect(() => {
    const t = setTimeout(() => onComplete(), 2200);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="torn-entry">
      {/* The scene that fades in BEHIND the tearing ticket */}
      <div className="torn-entry__scene" />

      {/* Top half of the torn ticket */}
      <div className="torn-entry__top">
        <Ticket
          ticketNumber={ticketNumber}
          variant="tornTop"
          tilt={-2}
          size="md"
        />
      </div>

      {/* Bottom half of the torn ticket */}
      <div className="torn-entry__bottom">
        <Ticket
          ticketNumber={ticketNumber}
          variant="tornBottom"
          tilt={-1}
          size="md"
        />
      </div>

      {/* A few floating paper debris bits */}
      <div className="torn-entry__debris" aria-hidden>
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
