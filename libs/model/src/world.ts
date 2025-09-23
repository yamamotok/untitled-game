import z from 'zod';

import { GhostSchema } from './ghost';
import { PlayerSchema } from './player';

export const WorldSchema = z.object({
  players: PlayerSchema.array(),
  ghosts: GhostSchema.array().default([]),
});

export type World = z.infer<typeof WorldSchema>;
