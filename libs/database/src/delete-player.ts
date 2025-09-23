import { client } from './client';

export async function deletePlayer({ playerId }: { playerId: string }) {
  const cl = await client();

  const key = `player#${playerId}`;

  return cl.del(key);
}
