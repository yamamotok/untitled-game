import { savePlayer } from '@untitled-game/database';
import { update } from '@untitled-game/dispatcher';
import { PlayerSchema, RegisterPlayerCommand } from '@untitled-game/model';

export async function registerPlayer(command: RegisterPlayerCommand) {
  const randomPosition = { x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10) };
  const player = PlayerSchema.parse({ playerId: command.playerId, pos: randomPosition });
  await savePlayer(player);
  update();
  console.log(`[worker] Registered player: ${command.playerId}`);
}
