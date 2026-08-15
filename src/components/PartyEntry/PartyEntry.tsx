import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PartyEntry.css';

interface PartyEntryProps {
  onComplete: () => void;
}

type EntryStage = 'doors' | 'lights' | 'reveal' | 'welcome';

// Removed SVGs to use pure background art

export function PartyEntry({ onComplete }: PartyEntryProps) {
  const [stage, setStage] = useState<EntryStage>('doors');
  const [doorsOpen, setDoorsOpen] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setDoorsOpen(true), 400);
    const t2 = setTimeout(() => setStage('lights'), 1800);
    const t3 = setTimeout(() => setStage('reveal'), 2800);
    const t4 = setTimeout(() => setStage('welcome'), 3600);
    const t5 = setTimeout(() => onComplete(), 5200);
    return () => { [t1, t2, t3, t4, t5].forEach(clearTimeout); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="party-entry">
      <div className="pe-scene">
        <div className="pe-scene-bg" />

        {/* Light beams */}
        <AnimatePresence>
          {(stage === 'lights' || stage === 'reveal' || stage === 'welcome') && (
            <>
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="pe-light-beam"
                  style={{ '--beam-i': i } as React.CSSProperties}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ delay: i * 0.18, duration: 0.4 }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Removed CSS generated peoples for a cleaner look */}

        {/* Text overlays */}
        <AnimatePresence mode="wait">
          {stage === 'reveal' && (
            <motion.div
              key="youre-in"
              className="pe-text-overlay pe-text-overlay--big"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              YOU'RE IN
            </motion.div>
          )}
          {stage === 'welcome' && (
            <motion.div
              key="welcome"
              className="pe-text-overlay pe-text-overlay--welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="pe-welcome-sub">WELCOME TO</span>
              <span className="pe-welcome-main">PARTY WALE</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Left door */}
      <motion.div
        className="pe-door pe-door--left"
        animate={{ x: doorsOpen ? '-100%' : '0%' }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="pe-door-inner">
          <div className="pe-door-handle pe-door-handle--right" />
          <div className="pe-door-panel" />
          <div className="pe-door-logo">
            <span className="pe-door-monogram">PW</span>
            <span className="pe-door-text">PARTY</span>
            <span className="pe-door-text">WALE</span>
          </div>
        </div>
      </motion.div>

      {/* Right door */}
      <motion.div
        className="pe-door pe-door--right"
        animate={{ x: doorsOpen ? '100%' : '0%' }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="pe-door-inner">
          <div className="pe-door-handle pe-door-handle--left" />
          <div className="pe-door-panel" />
          <div className="pe-door-logo">
            <span className="pe-door-monogram">VIP</span>
            <span className="pe-door-text">VIP</span>
            <span className="pe-door-text">ONLY</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
