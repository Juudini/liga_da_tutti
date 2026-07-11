import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./config/env.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import teamsRoutes from "./routes/teams.routes.js";
import tournamentsRoutes from "./routes/tournaments.routes.js";
import matchesRoutes from "./routes/matches.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());

  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  app.use("/api/health", healthRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/teams", teamsRoutes);
  app.use("/api/tournaments", tournamentsRoutes);
  app.use("/api/matches", matchesRoutes);
  app.use("/api/stats", statsRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
