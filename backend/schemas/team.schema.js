import { z } from "zod";

export const teamSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  dt: z.string().optional(),
});
