import { deletePlayer } from '@untitled-game/database';
import { update } from '@untitled-game/dispatcher';
import { UnregisterPlayerCommand } from '@untitled-game/model';

export async function unregisterPlayer(command: UnregisterPlayerCommand) {
  const playerId = command.playerId;
  await deletePlayer({ playerId });
  update();
  console.log(`[worker] Unregistered player: ${playerId}`);
}
