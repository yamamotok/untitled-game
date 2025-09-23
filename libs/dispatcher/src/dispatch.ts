import { client } from '@untitled-game/database';
import { Command } from '@untitled-game/model';

const NotificationChannelName = 'notification';
const CommandQueueKey = 'command';

export async function dispatch(command: Command) {
  const cl = await client();
  await cl.rPush(CommandQueueKey, JSON.stringify(command));
  await cl.publish(NotificationChannelName, command.type);
}
