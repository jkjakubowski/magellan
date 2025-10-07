import { z } from "zod";

export const tripSchema = z.object({
  date: z.string().optional().nullable(),
  intention: z.string().min(3),
  substance: z.string().optional().nullable(),
  dose: z.string().optional().nullable(),
  setting: z.string().optional().nullable(),
  safety_flags: z.array(z.string()).optional(),
  tag_ids: z.array(z.string()).optional()
});
