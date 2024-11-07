import { z } from "zod";

export const preferencesSchema = z.object({
  defaultView: z.enum(["essentials", "favorites", "recents"]),
  roles: z.array(z.enum(["student", "employee"])),
  appearance: z.enum(["dark", "light", "system"]),
});

export type Preferences = z.infer<typeof preferencesSchema>;
