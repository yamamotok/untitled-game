import { z } from 'zod';

function createTypeCheck<T>(type?: string): (obj: unknown) => obj is T {
  return (obj: unknown): obj is T => {
    if (!obj || typeof obj !== 'object' || !('type' in obj)) {
      return false;
    }
    return type ? obj.type === type : true;
  };
}

export const CommandSchema = z.object({
  type: z.string(),
  playerId: z.string(),
  payload: z.record(z.string(), z.unknown()).default(() => ({})),
});
export type Command = z.infer<typeof CommandSchema>;
export const isCommand = createTypeCheck<Command>();

export const RegisterPlayerCommandSchema = CommandSchema.extend({
  type: z.literal('register-player').default('register-player'),
});
export type RegisterPlayerCommand = z.infer<typeof RegisterPlayerCommandSchema>;
export const isRegisterPlayerCommand = createTypeCheck<RegisterPlayerCommand>('register-player');

export const UnregisterPlayerCommandSchema = CommandSchema.extend({
  type: z.literal('unregister-player').default('unregister-player'),
});
export type UnregisterPlayerCommand = z.infer<typeof UnregisterPlayerCommandSchema>;
export const isUnregisterPlayerCommand =
  createTypeCheck<UnregisterPlayerCommand>('unregister-player');

export const MoveCommandSchema = CommandSchema.extend({
  type: z.literal('move').default('move'),
  payload: z.object({
    direction: z.enum(['right', 'left', 'up', 'down']),
  }),
});
export type MoveCommand = z.infer<typeof MoveCommandSchema>;
export const isMoveCommand = createTypeCheck<MoveCommand>('move');

export const ThrowCommandSchema = CommandSchema.extend({
  type: z.literal('throw').default('throw'),
});
export type ThrowCommand = z.infer<typeof ThrowCommandSchema>;
export const isThrowCommand = createTypeCheck<ThrowCommand>('throw');
