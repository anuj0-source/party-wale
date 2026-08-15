import React, { useState, useEffect } from 'react';
import { subscribeToPresence } from '../../lib/presenceSocket';
import './ActiveUsers.css';

export function ActiveUsers() {
  const [count, setCount] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(true);

  useEffect(() => {
    // Show connecting state briefly, then wait for real data
    const timer = setTimeout(() => setConnecting(false), 1500);
    const unsubscribe = subscribeToPresence((n) => {
      setCount(n);
      setConnecting(false);
    });
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  // Still connecting — show a subtle pulsing dot
  if (count === null && connecting) {
    return (
      <div className="active-users-badge active-users-badge--connecting">
        <span className="active-users-dot active-users-dot--pulse" />
        <span className="active-users-text">connecting...</span>
      </div>
    );
  }

  if (count === null) return null;

  return (
    <div className="active-users-badge">
      <span className="active-users-dot" />
      <span className="active-users-text">
        {count.toLocaleString()} {count === 1 ? 'person is' : 'people are'} vibing
      </span>
    </div>
  );
}
