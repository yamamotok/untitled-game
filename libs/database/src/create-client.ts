import { createClient as redisCreateClient } from 'redis';

type Client = ReturnType<typeof redisCreateClient>;

const singleton: {
  client?: Client;
  isCreating?: Promise<Client>;
} = {};

export async function createClient(): Promise<Client> {
  if (singleton.client) {
    return singleton.client;
  }

  if (singleton.isCreating) {
    return singleton.isCreating;
  }

  const creating = (async () => {
    const client = redisCreateClient();
    client.on('error', (err) => console.error('Redis client error:', err));

    try {
      await client.connect();
      singleton.client = client;
      return client;
    } catch (err) {
      console.error('Failed to create Redis client:', err);
      throw err;
    } finally {
      delete singleton.isCreating;
    }
  })();

  singleton.isCreating = creating;
  return creating;
}
