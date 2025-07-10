import { z } from 'zod';

export const SettingsResponseSchema = z.object({
  mixPanelKey: z.string(),
  screeb_website_id: z.string(),
  muiKey: z.string(),
});

export type SettingsResponse = z.infer<typeof SettingsResponseSchema>;
