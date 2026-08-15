// src/contexts/useParty.ts
// Re-exports of useParty hook + PartyContext object. Lives in its own file
// so React Fast Refresh works correctly with PartyContext.tsx (a file
// exporting both a hook and a component breaks HMR).

import { createContext, useContext } from 'react';
import type { PartyContextValue } from './PartyContext';

export const PartyContext = createContext<PartyContextValue | null>(null);

export function useParty(): PartyContextValue {
  const ctx = useContext(PartyContext);
  if (!ctx) throw new Error('useParty must be used inside PartyProvider');
  return ctx;
}