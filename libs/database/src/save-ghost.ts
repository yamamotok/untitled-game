import { Ghost } from '@untitled-game/model';

import { client } from './client';

// Save ghost with a TTL so it disappears automatically from the world snapshot
export async function saveGhost(ghost: Ghost, ttlSeconds: number = 4) {
  const cl = await client();
  const key = `ghost#${ghost.id}`;
  await cl.set(key, JSON.stringify(ghost), {
    EX: ttlSeconds,
  });
}
