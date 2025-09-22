import { WebSocketServer } from 'ws';

const PORT = process.env.WS_PORT ? parseInt(process.env.WS_PORT, 10) : 8080;

const wss = new WebSocketServer({ port: PORT });

wss.on('listening', () => {
  console.log(`[ws] WebSocket server listening on ws://localhost:${PORT}`);
  console.log(`[ws] Process ID: ${process.pid}`);
});

wss.on('connection', (ws, req) => {
  const client = req.socket.remoteAddress;
  console.log(`[ws] client connected: ${client}`);
  try {
    ws.send('hello');
  } catch (err) {
    console.error('[ws] failed to send hello', err);
  }

  ws.on('close', () => {
    console.log(`[ws] client disconnected: ${client}`);
  });

  ws.on('error', (err) => {
    console.error('[ws] client error:', err);
  });
});

wss.on('error', (err) => {
  console.error('[ws] server error:', err);
});
