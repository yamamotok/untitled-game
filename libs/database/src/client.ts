import { createClient as redisCreateClient } from 'redis';

export type RedisClient = ReturnType<typeof redisCreateClient>;

let shared: RedisClient | null = null;
let sharedCreating: Promise<RedisClient> | null = null;

export async function client(): Promise<RedisClient> {
  if (shared) {
    return shared;
  }
  if (sharedCreating) {
    return sharedCreating;
  }

  const creating = (async () => {
    const client = redisCreateClient();
    client.on('error', (err) => console.error('Redis client error:', err));

    try {
      await client.connect();
      shared = client;
      return client;
    } catch (err) {
      console.error('Failed to create Redis client:', err);
      throw err;
    } finally {
      sharedCreating = null;
    }
  })();

  sharedCreating = creating;
  return creating;
}

export async function newClient(): Promise<RedisClient> {
  try {
    const client = redisCreateClient();
    client.on('error', (err) => console.error('Redis client error:', err));
    await client.connect();
    return client;
  } catch (err) {
    console.error('Failed to create Redis client:', err);
    throw err;
  }
}
