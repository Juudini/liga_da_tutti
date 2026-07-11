import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { Auth_Middleware } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { tournamentSchema } from "../schemas/tournament.schema.js";
import {
  listTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
  ensureTournamentOwnership,
} from "../controllers/tournaments.controller.js";

const router = Router();

router.get("/", listTournaments);
router.get("/:id", getTournamentById);

router.post("/", Auth_Middleware, validate(tournamentSchema), createTournament);
router.put(
  "/:id",
  Auth_Middleware,
  ensureTournamentOwnership,
  validate(tournamentSchema),
  updateTournament,
);
router.delete("/:id", Auth_Middleware, authorize("admin"), deleteTournament);

export default router;
