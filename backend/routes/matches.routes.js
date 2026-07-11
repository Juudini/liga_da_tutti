import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { Auth_Middleware } from "../middleware/auth.js";
import { matchSchema } from "../schemas/match.schema.js";
import {
  listMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
  ensureMatchOwnership,
} from "../controllers/matches.controller.js";

const router = Router();

router.get("/", listMatches);
router.get("/:id", getMatchById);

router.post("/", Auth_Middleware, validate(matchSchema), createMatch);
router.put(
  "/:id",
  Auth_Middleware,
  ensureMatchOwnership,
  validate(matchSchema),
  updateMatch,
);
router.delete("/:id", Auth_Middleware, ensureMatchOwnership, deleteMatch);

export default router;
