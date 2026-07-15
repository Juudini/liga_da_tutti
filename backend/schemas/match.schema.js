import { z } from "zod";

const goalSchema = z.object({
  playerNumber: z
    .number()
    .int()
    .min(1, "El número de camiseta debe ser mayor a 0"),
  playerName: z.string().min(1, "El nombre del jugador es obligatorio"),
  minute: z
    .number()
    .int()
    .min(0)
    .max(130, "El minuto debe estar entre 0 y 130"),
  team: z.enum(["local", "visitor"]),
});

const cardSchema = z.object({
  playerNumber: z
    .number()
    .int()
    .min(1, "El número de camiseta debe ser mayor a 0"),
  playerName: z.string().min(1, "El nombre del jugador es obligatorio"),
  minute: z
    .number()
    .int()
    .min(0)
    .max(130, "El minuto debe estar entre 0 y 130"),
  team: z.enum(["local", "visitor"]),
  cardType: z.enum(["amarilla", "roja"]),
});

export const matchSchema = z
  .object({
    localTeam: z.string().min(1, "El equipo local es obligatorio"),
    visitorTeam: z.string().min(1, "El equipo visitante es obligatorio"),

    tournament: z.preprocess(
      (value) => (value === "" ? null : value),
      z.string().nullable().optional(),
    ),
    date: z.coerce.date(),
    stadium: z.string().optional(),
    status: z
      .enum(["programado", "finalizado", "cancelado"])
      .default("programado"),
    localGoals: z.number().int().min(0).nullable().optional(),
    visitorGoals: z.number().int().min(0).nullable().optional(),
    goals: z.array(goalSchema).optional().default([]),
    cards: z.array(cardSchema).optional().default([]),
  })
  .refine((data) => data.localTeam !== data.visitorTeam, {
    message: "Un equipo no puede jugar contra sí mismo",
    path: ["visitorTeam"],
  })
  .refine(
    (data) =>
      data.status !== "finalizado" ||
      (data.localGoals != null && data.visitorGoals != null),
    {
      message:
        "Los goles de local y visitante son obligatorios cuando el partido está finalizado",
      path: ["localGoals"],
    },
  )
  .refine(
    (data) => {
      const localScorers = data.goals.filter((g) => g.team === "local").length;
      return data.localGoals == null || localScorers <= data.localGoals;
    },
    {
      message:
        "La cantidad de goleadores del equipo local no puede superar el marcador",
      path: ["goals"],
    },
  )
  .refine(
    (data) => {
      const visitorScorers = data.goals.filter(
        (g) => g.team === "visitor",
      ).length;
      return data.visitorGoals == null || visitorScorers <= data.visitorGoals;
    },
    {
      message:
        "La cantidad de goleadores del equipo visitante no puede superar el marcador",
      path: ["goals"],
    },
  );
