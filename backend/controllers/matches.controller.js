import { Match } from "../models/Match.js";

const toPublicTeamRef = (team) => {
  if (!team) return null;
  return { id: team._id, name: team.name, dt: team.dt, logoUrl: team.logoUrl };
};

const toPublicUserRef = (user) => {
  if (!user) return null;
  return { id: user._id, name: user.name, email: user.email };
};

const toPublicTournamentRef = (tournament) => {
  if (!tournament) return null;
  return { id: tournament._id, name: tournament.name };
};

const toPublicMatch = (match) => ({
  id: match._id,
  localTeam: toPublicTeamRef(match.localTeam),
  visitorTeam: toPublicTeamRef(match.visitorTeam),
  tournament: toPublicTournamentRef(match.tournament),
  date: match.date,
  stadium: match.stadium,
  status: match.status,
  localGoals: match.localGoals,
  visitorGoals: match.visitorGoals,
  goals: match.goals,
  cards: match.cards,
  createdBy: toPublicUserRef(match.createdBy),
});

const POPULATE_FIELDS = "localTeam visitorTeam tournament createdBy";

export const listMatches = async (req, res, next) => {
  try {
    const matches = await Match.find()
      .sort({ date: 1 })
      .populate(POPULATE_FIELDS);
    res.status(200).json({ matches: matches.map(toPublicMatch) });
  } catch (error) {
    next(error);
  }
};

export const getMatchById = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id).populate(POPULATE_FIELDS);

    if (!match) {
      return res.status(404).json({ message: "Partido no encontrado" });
    }

    res.status(200).json({ match: toPublicMatch(match) });
  } catch (error) {
    next(error);
  }
};

export const createMatch = async (req, res, next) => {
  try {
    const match = await Match.create({ ...req.body, createdBy: req.user.id });
    await match.populate(POPULATE_FIELDS);
    res.status(201).json({ match: toPublicMatch(match) });
  } catch (error) {
    next(error);
  }
};

export const updateMatch = async (req, res, next) => {
  try {
    const match = req.match;
    Object.assign(match, req.body);
    await match.save();
    await match.populate(POPULATE_FIELDS);
    res.status(200).json({ match: toPublicMatch(match) });
  } catch (error) {
    next(error);
  }
};

export const deleteMatch = async (req, res, next) => {
  try {
    await req.match.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const ensureMatchOwnership = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: "Partido no encontrado" });
    }

    if (match.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tenés permiso para esta acción" });
    }

    req.match = match;
    next();
  } catch (error) {
    next(error);
  }
};
