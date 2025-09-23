import { client, savePlayer } from '@untitled-game/database';
import { update } from '@untitled-game/dispatcher';
import { MoveCommand, PlayerSchema } from '@untitled-game/model';

// World dimensions from specs: 16x16 grid
const WORLD_WIDTH = 10;
const WORLD_HEIGHT = 10;

export async function move(command: MoveCommand) {
  const { direction } = command.payload;
  const playerId = command.playerId;

  const cl = await client();
  const key = `player#${playerId}`;
  const json = await cl.get(key);

  if (!json) {
    // Player not found; ignore move
    return;
  }

  console.log('[worker] Player %s is moving %s', playerId, direction);

  const player = PlayerSchema.parse(JSON.parse(json));

  // Calculate new position based on direction
  let { x, y } = player.pos;
  switch (direction) {
    case 'right':
      x += 1;
      break;
    case 'left':
      x -= 1;
      break;
    case 'up':
      y -= 1; // y decreases when moving up in screen coordinates
      break;
    case 'down':
      y += 1;
      break;
  }

  // Clamp to world bounds [0, 15]
  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
  player.pos.x = clamp(x, 0, WORLD_WIDTH - 1);
  player.pos.y = clamp(y, 0, WORLD_HEIGHT - 1);

  await savePlayer(player);
  await update();
}
