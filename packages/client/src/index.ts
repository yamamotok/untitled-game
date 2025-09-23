import { ulid } from 'ulid';

import { MoveCommand, ThrowCommand } from '@untitled-game/model';

import { establishWsConnection } from './establish-ws-connection';
import { initPixi } from './init-pixi';

// Generate or get Player ID
function getPlayerId(): string {
  const key = 'untitled-game-playerId';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = ulid();
    sessionStorage.setItem(key, id);
  }
  return id;
}

// Initialize Pixi.js and keep UI context
const ui = await initPixi();

// Establish WebSocket connection and input handling
const connection = establishWsConnection({ playerId: getPlayerId(), onUpdate: ui.onUpdate });

// Map Arrow keys to directions and send move commands to the server
const Directions = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
} as const;

window.addEventListener('keydown', (ev: KeyboardEvent) => {
  if (ev.code === 'Space') {
    ev.preventDefault();
    const cmd: ThrowCommand = {
      type: 'throw',
      playerId: getPlayerId(),
      payload: {},
    };
    connection.sendCommand(cmd);
    return;
  }

  const dir = Directions[ev.key as keyof typeof Directions];
  if (!dir) {
    return;
  }

  // Prevent the page from scrolling when using arrow keys
  ev.preventDefault();

  const cmd: MoveCommand = {
    type: 'move',
    playerId: getPlayerId(),
    payload: {
      direction: dir,
    },
  };

  connection.sendCommand(cmd);
});
