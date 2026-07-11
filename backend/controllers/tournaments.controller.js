import { Tournament } from "../models/Tournament.js";

const toPublicTournament = (tournament) => ({
  id: tournament._id,
  name: tournament.name,
  createdBy: tournament.createdBy?.toString() ?? tournament.createdBy,
});

export const listTournaments = async (req, res, next) => {
  try {
    const tournaments = await Tournament.find().sort({ name: 1 });
    res.status(200).json({ tournaments: tournaments.map(toPublicTournament) });
  } catch (error) {
    next(error);
  }
};

export const getTournamentById = async (req, res, next) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({ message: "Torneo no encontrado" });
    }

    res.status(200).json({ tournament: toPublicTournament(tournament) });
  } catch (error) {
    next(error);
  }
};

export const createTournament = async (req, res, next) => {
  try {
    const tournament = await Tournament.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json({ tournament: toPublicTournament(tournament) });
  } catch (error) {
    next(error);
  }
};

export const updateTournament = async (req, res, next) => {
  try {
    Object.assign(req.tournament, req.body);
    await req.tournament.save();
    res.status(200).json({ tournament: toPublicTournament(req.tournament) });
  } catch (error) {
    next(error);
  }
};

export const deleteTournament = async (req, res, next) => {
  try {
    const tournament = await Tournament.findByIdAndDelete(req.params.id);

    if (!tournament) {
      return res.status(404).json({ message: "Torneo no encontrado" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const ensureTournamentOwnership = async (req, res, next) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({ message: "Torneo no encontrado" });
    }

    const isOwner = tournament.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
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
