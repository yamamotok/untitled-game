import { Player } from '@untitled-game/model';

import { client } from './client';

export async function savePlayer(player: Player) {
  const cl = await client();

  const key = `player#${player.playerId}`;

  return cl.set(key, JSON.stringify(player));
}
