import { Match } from "../models/Match.js";
import { Team } from "../models/Team.js";
import { Tournament } from "../models/Tournament.js";
import { computeSummary, computeStandings } from "../utils/statistics.js";

export const ensureStatsAccess = async (req, res, next) => {
  try {
    if (req.user.role === "admin") {
      return next();
    }

    const { tournamentId } = req.query;

    if (!tournamentId) {
      return res.status(400).json({
        message: "Seleccioná uno de tus torneos para ver sus estadísticas",
      });
    }

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({ message: "Torneo no encontrado" });
    }

    if (tournament.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tenés permiso para esta acción" });
    }

    req.tournament = tournament;
    next();
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const { tournamentId } = req.query;

    const [matches, teams, totalTournaments] = await Promise.all([
      Match.find(),
      Team.find(),
      Tournament.countDocuments(),
    ]);

    const summary = computeSummary(matches, tournamentId);
    const standings = computeStandings(matches, teams, tournamentId);

    res.status(200).json({ ...summary, totalTournaments, standings });
  } catch (error) {
    next(error);
  }
};
