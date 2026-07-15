import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function Auth_Middleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token inválido o ausente" });
  }

  const token = authHeader.slice("Bearer ".length).trim();

  if (!token) {
    return res.status(401).json({ message: "Token inválido o ausente" });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido o ausente" });
  }
}
