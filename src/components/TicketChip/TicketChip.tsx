// src/components/TicketChip/TicketChip.tsx
// Small handwritten ticket chip in the top-right. Opens TicketModal.

import React from 'react';
import { useParty } from '../../contexts/useParty';
import './TicketChip.css';

interface TicketChipProps {
  onClick: () => void;
}

export function TicketChip({ onClick }: TicketChipProps) {
  const { ticketNumber } = useParty();
  return (
    <button className="ticket-chip" onClick={onClick} aria-label="View your ticket">
      #{ticketNumber}
    </button>
  );
}
