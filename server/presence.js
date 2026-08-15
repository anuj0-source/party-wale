// server/presence.js
// Simple WebSocket presence server.
// Tracks every connected browser tab and broadcasts the live count.

import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';

const PORT = 3001;

const httpServer = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Party Wale Presence Server');
});

const wss = new WebSocketServer({ server: httpServer });

let connectedClients = 0;

function broadcast(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

wss.on('connection', (ws) => {
  connectedClients++;
  console.log(`[+] Client connected. Total: ${connectedClients}`);

  // Send current count immediately to the newly connected client
  ws.send(JSON.stringify({ type: 'count', count: connectedClients }));

  // Broadcast new count to ALL clients
  broadcast({ type: 'count', count: connectedClients });

  ws.on('close', () => {
    connectedClients--;
    console.log(`[-] Client disconnected. Total: ${connectedClients}`);
    broadcast({ type: 'count', count: connectedClients });
  });

  ws.on('error', () => {
    // Ignore individual socket errors; cleanup is handled by 'close'
  });
});

httpServer.listen(PORT, () => {
  console.log(`🎉 Presence server running on ws://localhost:${PORT}`);
});
