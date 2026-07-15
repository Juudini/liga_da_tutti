import path from "node:path";
import { unlink } from "node:fs/promises";
import { Team } from "../models/Team.js";
import { UPLOADS_DIR } from "../middleware/upload.js";

const toPublicTeam = (team) => ({
  id: team._id,
  name: team.name,
  dt: team.dt,
  logoUrl: team.logoUrl,
  createdBy: team.createdBy?.toString() ?? team.createdBy,
});

function buildLogoUrl(req) {
  if (!req.file) return undefined;
  return `/uploads/teams/${req.file.filename}`;
}

async function deleteLogoFile(logoUrl) {
  if (!logoUrl) return;
  const filename = path.basename(logoUrl);
  try {
    await unlink(path.join(UPLOADS_DIR, filename));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

export const listTeams = async (req, res, next) => {
  try {
    const teams = await Team.find().sort({ name: 1 });
    res.status(200).json({ teams: teams.map(toPublicTeam) });
  } catch (error) {
    next(error);
  }
};

export const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }

    res.status(200).json({ team: toPublicTeam(team) });
  } catch (error) {
    next(error);
  }
};

export const createTeam = async (req, res, next) => {
  try {
    const logoUrl = buildLogoUrl(req);
    const team = await Team.create({
      ...req.body,
      logoUrl,
      createdBy: req.user.id,
    });
    res.status(201).json({ team: toPublicTeam(team) });
  } catch (error) {
    next(error);
  }
};

export const updateTeam = async (req, res, next) => {
  try {
    const logoUrl = buildLogoUrl(req);
    const previousLogoUrl = req.team.logoUrl;

    Object.assign(req.team, req.body);
    if (logoUrl) req.team.logoUrl = logoUrl;
    await req.team.save();

    if (logoUrl && previousLogoUrl) {
      await deleteLogoFile(previousLogoUrl);
    }

    res.status(200).json({ team: toPublicTeam(req.team) });
  } catch (error) {
    next(error);
  }
};

export const deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }

    await deleteLogoFile(team.logoUrl);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const ensureTeamOwnership = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }

    const isOwner = team.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "No tenés permiso para esta acción" });
    }

    req.team = team;
    next();
  } catch (error) {
    next(error);
  }
};
