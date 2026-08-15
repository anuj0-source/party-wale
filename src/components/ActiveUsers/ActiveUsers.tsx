import React, { useState, useEffect } from 'react';
import { subscribeToPresence } from '../../lib/presenceSocket';
import './ActiveUsers.css';

export function ActiveUsers() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // Returns an unsubscribe function; the socket itself is a singleton
    // so StrictMode double-invocation only registers/unregisters the listener,
    // never opens a second connection.
    const unsubscribe = subscribeToPresence((n) => setCount(n));
    return unsubscribe;
  }, []);

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
