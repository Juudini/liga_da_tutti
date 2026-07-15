import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Team } from "../models/Team.js";
import { Tournament } from "../models/Tournament.js";
import { Match } from "../models/Match.js";

const USERS_SEED = [
  {
    name: "Admin Liga",
    email: "admin@liga.com",
    passwordHash: "admin123",
    role: "admin",
  },
  {
    name: "Juan Pérez",
    email: "juan@liga.com",
    passwordHash: "juan123",
    role: "common",
  },
  {
    name: "María Gómez",
    email: "maria@liga.com",
    passwordHash: "maria123",
    role: "common",
  },
];

const TEAMS_SEED = [
  {
    name: "Los Pibes FC",
    dt: "Carlos Bilardo",
    createdByEmail: "juan@liga.com",
  },
  {
    name: "Deportivo Barrio",
    dt: "Marcelo Gallardo",
    createdByEmail: "juan@liga.com",
  },
  {
    name: "Atlético Esquina",
    dt: "Diego Simeone",
    createdByEmail: "maria@liga.com",
  },
  {
    name: "Unión Potrero",
    dt: "Ricardo Gareca",
    createdByEmail: "maria@liga.com",
  },
  {
    name: "Real Cancha",
    dt: "Martín Demichelis",
    createdByEmail: "admin@liga.com",
  },
  {
    name: "Racing del Fondo",
    dt: "Gustavo Costas",
    createdByEmail: "admin@liga.com",
  },
];

const TOURNAMENTS_SEED = [
  { name: "Torneo Apertura Barrial", createdByEmail: "admin@liga.com" },
  { name: "Copa Amigos del Potrero", createdByEmail: "juan@liga.com" },
];

const MATCHES_SEED = [
  {
    localTeamName: "Los Pibes FC",
    visitorTeamName: "Deportivo Barrio",
    date: "2026-06-15T18:00",
    stadium: "Cancha Barrio Norte",
    status: "finalizado",
    localGoals: 2,
    visitorGoals: 1,
    createdByEmail: "juan@liga.com",
    tournamentName: "Torneo Apertura Barrial",
  },
  {
    localTeamName: "Atlético Esquina",
    visitorTeamName: "Unión Potrero",
    date: "2026-06-16T20:00",
    stadium: "Polideportivo Sur",
    status: "finalizado",
    localGoals: 0,
    visitorGoals: 0,
    createdByEmail: "maria@liga.com",
    tournamentName: "Torneo Apertura Barrial",
  },
  {
    localTeamName: "Deportivo Barrio",
    visitorTeamName: "Real Cancha",
    date: "2026-06-18T17:00",
    stadium: "Club El Porvenir",
    status: "finalizado",
    localGoals: 3,
    visitorGoals: 2,
    createdByEmail: "juan@liga.com",
    tournamentName: null,
  },
  {
    localTeamName: "Real Cancha",
    visitorTeamName: "Racing del Fondo",
    date: "2026-06-22T19:30",
    stadium: "Estadio Municipal",
    status: "programado",
    localGoals: null,
    visitorGoals: null,
    createdByEmail: "juan@liga.com",
    tournamentName: "Copa Amigos del Potrero",
  },
  {
    localTeamName: "Los Pibes FC",
    visitorTeamName: "Atlético Esquina",
    date: "2026-06-24T21:00",
    stadium: "Cancha Barrio Norte",
    status: "programado",
    localGoals: null,
    visitorGoals: null,
    createdByEmail: "maria@liga.com",
    tournamentName: null,
  },
  {
    localTeamName: "Unión Potrero",
    visitorTeamName: "Racing del Fondo",
    date: "2026-06-10T16:00",
    stadium: "Cancha Los Aromos",
    status: "cancelado",
    localGoals: null,
    visitorGoals: null,
    createdByEmail: "maria@liga.com",
    tournamentName: null,
  },
];

async function clearCollections() {
  await Promise.all([
    User.deleteMany({}),
    Team.deleteMany({}),
    Tournament.deleteMany({}),
    Match.deleteMany({}),
  ]);
}

async function seedUsers() {
  const users = [];
  for (const userData of USERS_SEED) {
    const user = await User.create(userData);
    users.push(user);
  }
  return users;
}

function seedTeams(users) {
  const userIdByEmail = new Map(users.map((user) => [user.email, user._id]));

  const teamsToInsert = TEAMS_SEED.map((team) => {
    const createdBy = userIdByEmail.get(team.createdByEmail);

    if (!createdBy) {
      throw new Error(
        `No se encontró el usuario "${team.createdByEmail}" entre los usuarios insertados.`,
      );
    }

    return {
      name: team.name,
      dt: team.dt,
      createdBy,
    };
  });

  return Team.insertMany(teamsToInsert);
}

function seedTournaments(users) {
  const userIdByEmail = new Map(users.map((user) => [user.email, user._id]));

  const tournamentsToInsert = TOURNAMENTS_SEED.map((tournament) => {
    const createdBy = userIdByEmail.get(tournament.createdByEmail);

    if (!createdBy) {
      throw new Error(
        `No se encontró el usuario "${tournament.createdByEmail}" entre los usuarios insertados.`,
      );
    }

    return { name: tournament.name, createdBy };
  });

  return Tournament.insertMany(tournamentsToInsert);
}

async function seedMatches(teams, tournaments, users) {
  const teamIdByName = new Map(teams.map((team) => [team.name, team._id]));
  const tournamentIdByName = new Map(
    tournaments.map((tournament) => [tournament.name, tournament._id]),
  );
  const userIdByEmail = new Map(users.map((user) => [user.email, user._id]));

  const matchesToInsert = MATCHES_SEED.map((match) => {
    const localTeam = teamIdByName.get(match.localTeamName);
    const visitorTeam = teamIdByName.get(match.visitorTeamName);
    const createdBy = userIdByEmail.get(match.createdByEmail);
    const tournament = match.tournamentName
      ? tournamentIdByName.get(match.tournamentName)
      : null;

    if (!localTeam || !visitorTeam) {
      throw new Error(
        `No se encontró el equipo "${match.localTeamName}" o "${match.visitorTeamName}" entre los equipos insertados.`,
      );
    }
    if (!createdBy) {
      throw new Error(
        `No se encontró el usuario "${match.createdByEmail}" entre los usuarios insertados.`,
      );
    }
    if (match.tournamentName && !tournament) {
      throw new Error(
        `No se encontró el torneo "${match.tournamentName}" entre los torneos insertados.`,
      );
    }

    return {
      localTeam,
      visitorTeam,
      tournament,
      date: new Date(match.date),
      stadium: match.stadium,
      status: match.status,
      localGoals: match.localGoals,
      visitorGoals: match.visitorGoals,
      createdBy,
    };
  });

  return Match.insertMany(matchesToInsert);
}

async function seed() {
  await connectDB();

  try {
    await clearCollections();

    const users = await seedUsers();
    const teams = await seedTeams(users);
    const tournaments = await seedTournaments(users);
    const matches = await seedMatches(teams, tournaments, users);

    console.log(
      `[seed] Insertados ${users.length} usuarios, ${teams.length} equipos, ${tournaments.length} torneos y ${matches.length} partidos.`,
    );

    await mongoose.disconnect();
  } catch (error) {
    console.error("[seed] Error al cargar los datos iniciales:", error);
    await mongoose.disconnect();
  }
}

seed();
