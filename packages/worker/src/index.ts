import { client, newClient } from '@untitled-game/database';
import {
  isMoveCommand,
  isRegisterPlayerCommand,
  isThrowCommand,
  isUnregisterPlayerCommand,
} from '@untitled-game/model';

import { move } from './commands/move';
import { registerPlayer } from './commands/register-player';
import { throwGhost } from './commands/throw';
import { unregisterPlayer } from './commands/unregister-player';

export const NotificationChannelName = 'notification';
export const CommandQueueKey = 'command';

async function processCommand() {
  const cl = await client();
  const popped = await cl.rPop(CommandQueueKey);
  if (!popped) {
    return;
  }

  const command: { type: string } = JSON.parse(popped);
  console.log('[worker] Processing command: %s (%d)', command.type, process.pid);

  if (isRegisterPlayerCommand(command)) {
    registerPlayer(command);
  } else if (isUnregisterPlayerCommand(command)) {
    unregisterPlayer(command);
  } else if (isMoveCommand(command)) {
    move(command);
  } else if (isThrowCommand(command)) {
    throwGhost(command);
  }
}

const subscriptionClient = await newClient();
await subscriptionClient.subscribe(NotificationChannelName, (message: string) => {
  console.log('[worker] Received notification: %s (%d)', message, process.pid);
  processCommand();
});

console.log('[worker] Listening for commands (%d)', process.pid);
