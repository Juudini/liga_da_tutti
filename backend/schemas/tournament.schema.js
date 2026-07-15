import { z } from "zod";

export const tournamentSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
});
