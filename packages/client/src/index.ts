const log = (msg: string): void => {
  const el = document.getElementById('log');
  if (el) {
    el.textContent = msg;
  } else {
    console.log('[ui]', msg);
  }
};

// Derive WebSocket URL from query (?ws=...), keeping the same default for compatibility
const wsUrl: string = new URLSearchParams(window.location.search).get('ws') ?? 'ws://localhost:8080';

log(`Connecting to ${wsUrl} ...`);

try {
  const ws = new WebSocket(wsUrl);

  ws.addEventListener('open', () => {
    log('Connected. Waiting for message...');
  });

  ws.addEventListener('message', (ev: MessageEvent) => {
    log(String(ev.data));
  });

  ws.addEventListener('error', (ev) => {
    console.error(ev);
    log('WebSocket error. See console.');
  });

  ws.addEventListener('close', () => {
    // keep the last message on screen
    console.log('[ui] websocket closed');
  });
} catch (e) {
  console.error(e);
  log('Failed to create WebSocket. See console.');
}
