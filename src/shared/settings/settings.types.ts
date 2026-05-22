import { z } from 'zod';

export const SettingsResponseSchema = z.object({
  muiKey: z.string(),
});

export type SettingsResponse = z.infer<typeof SettingsResponseSchema>;
