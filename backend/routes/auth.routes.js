import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { Auth_Middleware } from "../middleware/auth.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { login, me, register } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", Auth_Middleware, me);

export default router;
