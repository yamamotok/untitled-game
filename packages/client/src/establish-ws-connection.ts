import { RegisterPlayerCommand, World, WorldSchema } from '@untitled-game/model';

interface WsOptions {
  playerId: string;
  onUpdate: (world: World) => void;
}

export type WsConnection = {
  sendCommand: (cmd: unknown) => void;
};

export function establishWsConnection(options: WsOptions): WsConnection {
  const { onUpdate, playerId } = options;

  const wsUrl = 'ws://localhost:8080';

  console.log(`Connecting to ${wsUrl} ...`);

  const conn: { ws: WebSocket | null } = { ws: null };

  const registerPlayer: RegisterPlayerCommand = {
    type: 'register-player',
    playerId,
    payload: {},
  };

  try {
    const ws = new WebSocket(wsUrl);

    ws.addEventListener('open', () => {
      console.log('Connected. Waiting for message...');
      ws.send(JSON.stringify(registerPlayer));
    });

    ws.addEventListener('message', (ev: MessageEvent) => {
      try {
        const obj = JSON.parse(ev.data);
        const result = WorldSchema.safeParse(obj);
        if (result.success) {
          console.log('[ui] received world update');
          onUpdate(result.data);
        } else {
          console.error(result.error);
        }
      } catch {
        // The message is not a valid JSON, we ignore it
      }
    });

    ws.addEventListener('error', (ev) => {
      console.error(ev);
      console.log('WebSocket error. See console.');
    });

    ws.addEventListener('close', () => {
      // keep the last message on screen
      console.log('[ui] websocket closed');
    });

    conn.ws = ws;
  } catch (e) {
    console.error(e);
    console.log('Failed to create WebSocket. See console.');
  }

  return {
    sendCommand: (cmd: unknown) => {
      const ws = conn.ws;
      if (!ws) {
        return;
      }
      const data = JSON.stringify(cmd);
      if (ws.readyState === ws.OPEN) {
        ws.send(data);
      }
    },
  };
}
