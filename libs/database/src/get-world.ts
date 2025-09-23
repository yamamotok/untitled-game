import { Ghost, GhostSchema, Player, PlayerSchema, WorldSchema } from '@untitled-game/model';

import { client } from './client';

export async function getWorld() {
  const cl = await client();

  const players: Player[] = [];
  for await (const keys of cl.scanIterator({
    MATCH: 'player#*',
  })) {
    if (keys.length < 1) {
      continue;
    }
    const chunk = await cl.mGet(keys);
    chunk
      .filter((item) => item !== null)
      .map((item) => {
        players.push(PlayerSchema.parse(JSON.parse(item!)));
      });
  }

  const ghosts: Ghost[] = [];
  for await (const keys of cl.scanIterator({
    MATCH: 'ghost#*',
  })) {
    if (keys.length < 1) {
      continue;
    }
    const chunk = await cl.mGet(keys);
    for (let i = 0; i < chunk.length; i++) {
      const item = chunk[i];
      if (item === null) {
        continue;
      }
      const key = keys[i];
      const g = GhostSchema.parse(JSON.parse(item));
      if (g.birthTime + 3000 < Date.now()) {
        await cl.del(key);
      } else {
        ghosts.push(g);
      }
    }
  }

  return WorldSchema.parse({ players, ghosts });
}
