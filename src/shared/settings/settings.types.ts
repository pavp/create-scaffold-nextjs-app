import { z } from 'zod';

// API Response Schema (from backend)
export const SettingsResponseSchema = z.object({
  mixPanelKey: z.string(),
  screeb_website_id: z.string(),
  muiKey: z.string(), // Allow empty string - backend can send ""
});

export type SettingsResponse = z.infer<typeof SettingsResponseSchema>;
