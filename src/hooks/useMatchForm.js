import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTournament } from "./useTournament";
import { useAuth } from "./useAuth";
import { validateMatch } from "../utils/validators";

const EMPTY = {
  localTeamId: "",
  visitorTeamId: "",
  date: "",
  stadium: "",
  status: "programado",
  localGoals: "",
  visitorGoals: "",
};

function toFormState(m) {
  return {
    localTeamId: String(m.localTeamId),
    visitorTeamId: String(m.visitorTeamId),
    date: m.date,
    stadium: m.stadium,
    status: m.status,
    localGoals: m.localGoals ?? "",
    visitorGoals: m.visitorGoals ?? "",
  };
}

export function useMatchForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { teams, getMatchById, addMatch, updateMatch, canModify } =
    useTournament();
  const { user } = useAuth();

  const existing = isEdit ? getMatchById(id) : null;
  const [form, setForm] = useState(() =>
    existing ? toFormState(existing) : EMPTY,
  );
  const [errors, setErrors] = useState({});

  const notFound = isEdit && !existing;
  const forbidden = isEdit && existing && !canModify(existing, user);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const result = validateMatch(form);
    setErrors(result.errors);
    if (!result.valid) return;

    if (isEdit) {
      updateMatch(id, form);
      navigate(`/matches/${id}`);
    } else {
      const created = addMatch(form, user.email);
      navigate(`/matches/${created.id}`);
    }
  }

  return {
    isEdit,
    teams,
    form,
    errors,
    notFound,
    forbidden,
    handleChange,
    handleSubmit,
  };
}
