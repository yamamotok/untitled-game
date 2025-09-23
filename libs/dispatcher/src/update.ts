import { client, getWorld } from '@untitled-game/database';

const UpdateChannelName = 'update';

export async function update() {
  const cl = await client();
  const world = await getWorld();
  await cl.publish(UpdateChannelName, JSON.stringify(world));
}
