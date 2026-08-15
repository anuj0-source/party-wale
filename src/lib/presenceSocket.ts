// Singleton WebSocket connection shared across all React renders/remounts.
// React StrictMode double-invokes effects; a module-level singleton prevents
// that from opening two sockets per tab.

type Listener = (count: number) => void;

let socket: WebSocket | null = null;
let retryTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<Listener>();
let latestCount: number | null = null;

function connect() {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return; // already alive
  }

  const isDev = import.meta.env.DEV;
  const wsUrl = isDev
    ? `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`
    : 'wss://party-wale-1.onrender.com';
  
  socket = new WebSocket(wsUrl);

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data as string);
      if (data.type === 'count') {
        latestCount = data.count;
        listeners.forEach((cb) => cb(data.count));
      }
    } catch { /* ignore */ }
  };

  socket.onclose = () => {
    socket = null;
    // Retry after 3s
    retryTimer = setTimeout(connect, 3000);
  };

  socket.onerror = () => {
    socket?.close();
  };
}

export function subscribeToPresence(listener: Listener): () => void {
  // Start the singleton if not yet running
  connect();

  listeners.add(listener);

  // Immediately call with the latest known count so the UI doesn't flicker
  if (latestCount !== null) {
    listener(latestCount);
  }

  return () => {
    listeners.delete(listener);
    // Don't close the socket — other listeners or future remounts may need it.
    // It will stay open until the tab is closed (the server handles cleanup).
  };
}
