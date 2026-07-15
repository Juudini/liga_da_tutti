import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import useMatchesStore from "./useMatchesStore";
import useTeamsStore from "@features/teams/hooks/useTeamsStore";
import useTournamentsStore from "@features/tournaments/hooks/useTournamentsStore";
import useAuthStore from "@features/auth/hooks/useAuthStore";

const EMPTY_VALUES = {
  localTeamId: "",
  visitorTeamId: "",
  tournamentId: "",
  date: "",
  stadium: "",
  status: "programado",
  localGoals: "",
  visitorGoals: "",
  goals: [],
  cards: [],
};

function toDateTimeLocalValue(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  const localTime = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return localTime.toISOString().slice(0, 16);
}

function toFormValues(m) {
  return {
    localTeamId: String(m.localTeam?.id ?? m.localTeam ?? ""),
    visitorTeamId: String(m.visitorTeam?.id ?? m.visitorTeam ?? ""),
    tournamentId: m.tournament?.id ? String(m.tournament.id) : "",
    date: toDateTimeLocalValue(m.date),
    stadium: m.stadium ?? "",
    status: m.status,
    localGoals: m.localGoals ?? "",
    visitorGoals: m.visitorGoals ?? "",
    goals: m.goals ?? [],
    cards: m.cards ?? [],
  };
}

function toApiPayload(data) {
  const finished = data.status === "finalizado";
  return {
    localTeam: data.localTeamId,
    visitorTeam: data.visitorTeamId,
    tournament: data.tournamentId,
    date: data.date,
    stadium: data.stadium.trim(),
    status: data.status || "programado",
    localGoals: finished ? Number(data.localGoals) : null,
    visitorGoals: finished ? Number(data.visitorGoals) : null,
    goals: finished
      ? (data.goals ?? []).map((goal) => ({
          ...goal,
          playerNumber: Number(goal.playerNumber),
          minute: Number(goal.minute),
        }))
      : [],
    cards: finished
      ? (data.cards ?? []).map((card) => ({
          ...card,
          playerNumber: Number(card.playerNumber),
          minute: Number(card.minute),
        }))
      : [],
  };
}

export function useMatchForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const teams = useTeamsStore((s) => s.teams);
  const fetchTeams = useTeamsStore((s) => s.fetchTeams);
  const tournaments = useTournamentsStore((s) => s.tournaments);
  const fetchTournaments = useTournamentsStore((s) => s.fetchTournaments);
  const matchesStatus = useMatchesStore((s) => s.status);
  const fetchMatches = useMatchesStore((s) => s.fetchMatches);
  const existing = useMatchesStore((s) =>
    isEdit ? s.matches.find((m) => String(m.id) === String(id)) : null,
  );
  const addMatch = useMatchesStore((s) => s.addMatch);
  const updateMatch = useMatchesStore((s) => s.updateMatch);
  const canModify = useMatchesStore((s) => s.canModify);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    fetchTeams();
    fetchTournaments();
    if (isEdit) fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loading =
    isEdit &&
    !existing &&
    (matchesStatus === "loading" || matchesStatus === "idle");
  const notFound = isEdit && !existing && !loading;
  const forbidden = isEdit && Boolean(existing) && !canModify(existing, user);

  const form = useForm({
    defaultValues: existing ? toFormValues(existing) : EMPTY_VALUES,
    shouldUnregister: true,
  });

  // Resincroniza el formulario cuando `existing` pasa de `undefined` a un match real
  useEffect(() => {
    if (existing) form.reset(toFormValues(existing));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing?.id]);

  function onSubmit(data) {
    if (data.status === "finalizado") {
      const localScorers = (data.goals ?? []).filter(
        (g) => g.team === "local",
      ).length;
      const visitorScorers = (data.goals ?? []).filter(
        (g) => g.team === "visitor",
      ).length;
      const localLimit = Number(data.localGoals) || 0;
      const visitorLimit = Number(data.visitorGoals) || 0;

      if (localScorers > localLimit) {
        form.setError("goals", {
          type: "manual",
          message:
            "La cantidad de goleadores del equipo local no puede superar el marcador",
        });
        return;
      }
      if (visitorScorers > visitorLimit) {
        form.setError("goals", {
          type: "manual",
          message:
            "La cantidad de goleadores del equipo visitante no puede superar el marcador",
        });
        return;
      }
    }

    const payload = toApiPayload(data);
    if (isEdit) {
      updateMatch(id, payload).then((result) => {
        if (result.ok) navigate(`/matches/${id}`);
      });
    } else {
      addMatch(payload).then((result) => {
        if (result.ok) navigate(`/matches/${result.match.id}`);
      });
    }
  }

  return {
    isEdit,
    teams,
    tournaments,
    loading,
    notFound,
    forbidden,
    form,
    onSubmit,
  };
}
