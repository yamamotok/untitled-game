import { WebSocketServer } from 'ws';

import { newClient } from '@untitled-game/database';
import { dispatch } from '@untitled-game/dispatcher';
import {
  isCommand,
  isRegisterPlayerCommand,
  UnregisterPlayerCommandSchema,
} from '@untitled-game/model';

const PORT = process.env.WS_PORT ? parseInt(process.env.WS_PORT, 10) : 8080;

// Start WebSocket server
const wss = new WebSocketServer({ port: PORT });
wss.on('listening', () => {
  console.log(`[ws] WebSocket server listening on ws://localhost:${PORT}`);
  console.log(`[ws] Process ID: ${process.pid}`);
});

wss.on('error', (err) => {
  console.error('[ws] server error:', err);
});

// Subscribe to updates from the database, broadcasting them to all connected clients
const updateSubscription = await newClient();
updateSubscription.subscribe('update', (message) => {
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
});

wss.on('connection', (ws, req) => {
  const client = req.socket.remoteAddress;
  console.log(`[ws] client connected: ${client}`);

  const f = new (class {
    playerId: string = '';
  })();

  ws.on('message', (message: string) => {
    try {
      const obj = JSON.parse(message);
      if (isCommand(obj)) {
        if (isRegisterPlayerCommand(obj)) {
          f.playerId = obj.playerId;
        }
        dispatch(obj);
      }
    } catch (e) {
      console.error('[ws] malformed message:', e);
    }
  });

  ws.on('close', () => {
    const playerId = f.playerId;
    if (playerId) {
      dispatch(UnregisterPlayerCommandSchema.parse({ playerId }));
    }
    console.log(`[ws] client disconnected: ${client}`);
  });

  ws.on('error', (err) => {
    const playerId = f.playerId;
    if (playerId) {
      dispatch(UnregisterPlayerCommandSchema.parse({ playerId }));
    }
    console.error('[ws] client error:', err);
  });

  ws.send('Connected');
});
