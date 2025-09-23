import { ulid } from 'ulid';

import { client } from '@untitled-game/database';
import { saveGhost } from '@untitled-game/database';
import { update } from '@untitled-game/dispatcher';
import { Ghost, PlayerSchema, ThrowCommand } from '@untitled-game/model';

export async function throwGhost(command: ThrowCommand) {
  const playerId = command.playerId;

  const cl = await client();
  const key = `player#${playerId}`;
  const json = await cl.get(key);
  if (!json) {
    // Player not found; ignore throw
    return;
  }

  const player = PlayerSchema.parse(JSON.parse(json));

  const ghost: Ghost = {
    id: ulid(),
    playerId,
    pos: { x: player.pos.x, y: player.pos.y },
    birthTime: Date.now(),
  };
  await saveGhost(ghost);
  await update();
}
