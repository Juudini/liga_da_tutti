import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { Auth_Middleware } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { uploadTeamLogo, handleUploadErrors } from "../middleware/upload.js";
import { teamSchema } from "../schemas/team.schema.js";
import {
  listTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  ensureTeamOwnership,
} from "../controllers/teams.controller.js";

const router = Router();

router.get("/", listTeams);
router.get("/:id", getTeamById);

router.post(
  "/",
  Auth_Middleware,
  uploadTeamLogo,
  handleUploadErrors,
  validate(teamSchema),
  createTeam,
);
router.put(
  "/:id",
  Auth_Middleware,
  ensureTeamOwnership,
  uploadTeamLogo,
  handleUploadErrors,
  validate(teamSchema),
  updateTeam,
);
router.delete("/:id", Auth_Middleware, authorize("admin"), deleteTeam);

export default router;
