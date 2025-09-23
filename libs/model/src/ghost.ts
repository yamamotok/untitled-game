import z from 'zod';

const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const GhostSchema = z.object({
  id: z.string(),
  playerId: z.string(),
  pos: PositionSchema,
  /**
   * Time in milliseconds since epoch when the ghost was born.
   */
  birthTime: z.number(),
});

export type Ghost = z.infer<typeof GhostSchema>;
