import { Link } from "react-router-dom";
import { useMatchForm } from "../hooks/useMatchForm";
import FormField from "../components/ui/FormField";
import Icon from "../components/ui/Icon";

const FIELD =
  "w-full bg-surface-container-high border-2 border-transparent focus:border-primary focus:outline-none text-on-surface rounded-lg p-sm font-body-md transition-colors";

const SCORE_INPUT =
  "w-20 h-20 bg-surface-container-high border-2 border-transparent focus:border-primary focus:outline-none text-on-surface rounded-lg text-center font-score-display text-score-display transition-colors";

export default function MatchFormPage() {
  const {
    isEdit,
    teams,
    form,
    errors,
    notFound,
    forbidden,
    handleChange,
    handleSubmit,
  } = useMatchForm();

  if (notFound) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-md text-center">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">
          Partido no encontrado
        </h2>
        <Link
          to="/fixture"
          className="bg-primary text-on-primary font-label-md text-label-md font-bold py-3 px-6 rounded-full glow-primary">
          Volver al fixture
        </Link>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-md text-center">
        <span className="text-error">
          <Icon name="lock" size={48} />
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">
          Sin permisos
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          No podés editar un partido que no creaste.
        </p>
        <Link
          to="/fixture"
          className="bg-primary text-on-primary font-label-md text-label-md font-bold py-3 px-6 rounded-full glow-primary">
          Volver al fixture
        </Link>
      </div>
    );
  }

  return (
    <>
      <header>
        <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">
          {isEdit ? "Actualizar Partido" : "Organizar Partido"}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          {isEdit
            ? "Editá el estado y el resultado del encuentro."
            : "Configurá un nuevo encuentro de la liga."}
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="glass-panel rounded-xl p-md md:p-lg flex flex-col gap-md w-full max-w-3xl">
        <div className="flex items-center gap-sm border-b border-white/10 pb-sm text-primary">
          <Icon name="sports_soccer" size={32} />
          <h2 className="font-headline-md text-headline-md text-primary-fixed">
            {isEdit ? "Datos del encuentro" : "Nuevo encuentro"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
          <FormField label="Equipo local" error={errors.localTeamId}>
            <select
              name="localTeamId"
              value={form.localTeamId}
              onChange={handleChange}
              className={FIELD}>
              <option value="">Seleccionar equipo</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Equipo visitante" error={errors.visitorTeamId}>
            <select
              name="visitorTeamId"
              value={form.visitorTeamId}
              onChange={handleChange}
              className={FIELD}>
              <option value="">Seleccionar equipo</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
          <FormField label="Fecha y hora" error={errors.date}>
            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={`${FIELD} [color-scheme:dark]`}
            />
          </FormField>

          <FormField label="Estadio / Cancha" error={errors.stadium}>
            <div className="relative">
              <span className="absolute left-sm top-1/2 -translate-y-1/2 text-tertiary pointer-events-none">
                <Icon name="stadium" size={20} />
              </span>
              <input
                type="text"
                name="stadium"
                value={form.stadium}
                onChange={handleChange}
                placeholder="Ej. Complejo Deportivo 5"
                className={`${FIELD} pl-xl placeholder:text-tertiary`}
              />
            </div>
          </FormField>
        </div>

        <FormField label="Estado del partido">
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={FIELD}>
            <option value="programado">Programado</option>
            <option value="finalizado">Finalizado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </FormField>

        {form.status === "finalizado" && (
          <div className="bg-surface-container-lowest rounded-lg p-md flex items-start justify-between border border-surface-container-high">
            <div className="flex flex-col items-center gap-sm w-1/3">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Local
              </span>
              <input
                type="number"
                min="0"
                name="localGoals"
                value={form.localGoals}
                onChange={handleChange}
                className={SCORE_INPUT}
              />
              {errors.localGoals && (
                <span className="font-label-md text-label-md text-error text-center">
                  {errors.localGoals}
                </span>
              )}
            </div>
            <span className="font-headline-lg text-headline-lg text-surface-variant w-1/3 text-center pt-lg">
              -
            </span>
            <div className="flex flex-col items-center gap-sm w-1/3">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Visita
              </span>
              <input
                type="number"
                min="0"
                name="visitorGoals"
                value={form.visitorGoals}
                onChange={handleChange}
                className={SCORE_INPUT}
              />
              {errors.visitorGoals && (
                <span className="font-label-md text-label-md text-error text-center">
                  {errors.visitorGoals}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-sm mt-sm">
          <button
            type="submit"
            className="flex-1 py-sm bg-primary text-on-primary font-headline-md text-headline-md font-bold rounded-full glow-primary transition-all duration-300 cursor-pointer">
            {isEdit ? "Guardar cambios" : "Confirmar partido"}
          </button>
          <Link
            to="/fixture"
            className="flex-1 py-sm border border-outline text-on-surface font-label-md text-label-md font-bold rounded-full hover:bg-surface-variant/40 transition-colors text-center flex items-center justify-center">
            Cancelar
          </Link>
        </div>
      </form>
    </>
  );
}
