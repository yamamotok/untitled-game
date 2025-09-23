import { ulid } from 'ulid';
import z from 'zod';

const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const PlayerSchema = z.object({
  playerId: z.string().default(() => ulid()),
  pos: PositionSchema.default({ x: 0, y: 0 }),
});

export type Player = z.infer<typeof PlayerSchema>;
