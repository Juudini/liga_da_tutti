import { Router } from "express";
import { Auth_Middleware } from "../middleware/auth.js";
import {
  getStats,
  ensureStatsAccess,
} from "../controllers/stats.controller.js";

const router = Router();

router.get("/", Auth_Middleware, ensureStatsAccess, getStats);

export default router;
