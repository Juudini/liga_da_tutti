const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin({ email, password }) {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = "El email es obligatorio";
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "El formato del email no es válido";
  }

  if (!password) {
    errors.password = "La contraseña es obligatoria";
  } else if (password.length < 4) {
    errors.password = "La contraseña debe tener al menos 4 caracteres";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateMatch(data) {
  const errors = {};
  const localTeamId = data.localTeamId ? Number(data.localTeamId) : null;
  const visitorTeamId = data.visitorTeamId ? Number(data.visitorTeamId) : null;

  if (!localTeamId) errors.localTeamId = "Seleccioná el equipo local";
  if (!visitorTeamId) errors.visitorTeamId = "Seleccioná el equipo visitante";
  if (localTeamId && visitorTeamId && localTeamId === visitorTeamId) {
    errors.visitorTeamId = "Un equipo no puede jugar contra sí mismo";
  }

  if (!data.date) errors.date = "La fecha y hora son obligatorias";
  if (!data.stadium || !data.stadium.trim())
    errors.stadium = "El estadio es obligatorio";

  // Los goles solo se validan si el partido esta como finalizado.
  if (data.status === "finalizado") {
    const localGoals = Number(data.localGoals);
    const visitorGoals = Number(data.visitorGoals);
    if (
      data.localGoals === "" ||
      data.localGoals == null ||
      Number.isNaN(localGoals) ||
      localGoals < 0
    ) {
      errors.localGoals = "Ingresá los goles del local (número ≥ 0)";
    }
    if (
      data.visitorGoals === "" ||
      data.visitorGoals == null ||
      Number.isNaN(visitorGoals) ||
      visitorGoals < 0
    ) {
      errors.visitorGoals = "Ingresá los goles del visitante (número ≥ 0)";
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
