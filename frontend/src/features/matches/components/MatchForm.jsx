import { Controller, useFieldArray } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMatchForm } from "../hooks/useMatchForm";
import {
  Button,
  Card,
  Field,
  Input,
  Select,
  Icon,
} from "@shared/components/ui";

const TEAM_SIDE_OPTIONS = [
  { value: "local", label: "Local" },
  { value: "visitor", label: "Visitante" },
];

const CARD_TYPE_OPTIONS = [
  { value: "amarilla", label: "Amarilla" },
  { value: "roja", label: "Roja" },
];

function PlayerEventRow({
  control,
  register,
  errors,
  index,
  namePrefix,
  onRemove,
  showCardType,
  teamLabels,
}) {
  const rowErrors = errors?.[index] ?? {};
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[5rem_1fr_5rem_8rem_auto] gap-sm items-start bg-muted/30 border border-border rounded-md p-sm">
      <Field label="N°" error={rowErrors.playerNumber?.message}>
        <Input
          type="number"
          min="1"
          placeholder="9"
          aria-invalid={Boolean(rowErrors.playerNumber)}
          {...register(`${namePrefix}.${index}.playerNumber`, {
            required: "Requerido",
            min: { value: 1, message: "≥ 1" },
          })}
        />
      </Field>

      <Field label="Jugador" error={rowErrors.playerName?.message}>
        <Input
          type="text"
          placeholder="Nombre del jugador"
          aria-invalid={Boolean(rowErrors.playerName)}
          {...register(`${namePrefix}.${index}.playerName`, {
            required: "Requerido",
            validate: (value) => Boolean(value && value.trim()) || "Requerido",
          })}
        />
      </Field>

      <Field label="Minuto" error={rowErrors.minute?.message}>
        <Input
          type="number"
          min="0"
          max="130"
          placeholder="45"
          aria-invalid={Boolean(rowErrors.minute)}
          {...register(`${namePrefix}.${index}.minute`, {
            required: "Requerido",
            min: { value: 0, message: "0-130" },
            max: { value: 130, message: "0-130" },
          })}
        />
      </Field>

      <Field label="Equipo" error={rowErrors.team?.message}>
        <Controller
          control={control}
          name={`${namePrefix}.${index}.team`}
          rules={{ required: "Requerido" }}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <Select.Trigger />
              <Select.Content>
                {TEAM_SIDE_OPTIONS.map((opt) => (
                  <Select.Item key={opt.value} value={opt.value}>
                    {teamLabels[opt.value] ?? opt.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          )}
        />
      </Field>

      {showCardType && (
        <Field label="Tarjeta" error={rowErrors.cardType?.message}>
          <Controller
            control={control}
            name={`${namePrefix}.${index}.cardType`}
            rules={{ required: "Requerido" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <Select.Trigger />
                <Select.Content>
                  {CARD_TYPE_OPTIONS.map((opt) => (
                    <Select.Item key={opt.value} value={opt.value}>
                      {opt.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            )}
          />
        </Field>
      )}

      <button
        type="button"
        onClick={onRemove}
        aria-label="Quitar"
        className="self-end sm:self-center h-10 w-10 inline-flex items-center justify-center rounded-md text-destructive hover:bg-destructive/10 transition-colors">
        <Icon name="delete" size={18} />
      </button>
    </div>
  );
}
export default function MatchForm() {
  const {
    isEdit,
    teams,
    tournaments,
    loading,
    notFound,
    forbidden,
    form,
    onSubmit,
  } = useMatchForm();
  const {
    register,
    control,
    watch,
    getValues,
    handleSubmit,
    formState: { errors },
  } = form;

  const status = watch("status");
  const isFinished = status === "finalizado";

  const localTeamId = watch("localTeamId");
  const visitorTeamId = watch("visitorTeamId");
  const teamLabels = {
    local:
      teams.find((t) => String(t.id) === String(localTeamId))?.name ?? "Local",
    visitor:
      teams.find((t) => String(t.id) === String(visitorTeamId))?.name ??
      "Visitante",
  };

  const goalsArray = useFieldArray({ control, name: "goals" });
  const cardsArray = useFieldArray({ control, name: "cards" });

  const watchedGoals = watch("goals") ?? [];
  const localGoalsCount = watchedGoals.filter((g) => g.team === "local").length;
  const visitorGoalsCount = watchedGoals.filter(
    (g) => g.team === "visitor",
  ).length;
  const localGoalsLimit = Number(watch("localGoals")) || 0;
  const visitorGoalsLimit = Number(watch("visitorGoals")) || 0;
  const canAddGoal =
    localGoalsCount < localGoalsLimit || visitorGoalsCount < visitorGoalsLimit;

  function nextScorerTeam() {
    if (localGoalsCount < localGoalsLimit) return "local";
    if (visitorGoalsCount < visitorGoalsLimit) return "visitor";
    return "local";
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground font-body-md text-body-md">
        Cargando partido…
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-md text-center">
        <h2 className="font-headline-lg text-headline-lg text-foreground">
          Partido no encontrado
        </h2>
        <Link
          to="/fixture"
          className="inline-flex items-center justify-center rounded-md h-10 px-6 bg-primary text-primary-foreground font-label-md text-label-md font-bold hover:bg-primary/90 transition-colors">
          Volver al fixture
        </Link>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-md text-center">
        <span className="text-destructive">
          <Icon name="lock" size={48} />
        </span>
        <h2 className="font-headline-lg text-headline-lg text-foreground">
          Sin permisos
        </h2>
        <p className="font-body-md text-body-md text-muted-foreground">
          No podés editar un partido que no creaste.
        </p>
        <Link
          to="/fixture"
          className="inline-flex items-center justify-center rounded-md h-10 px-6 bg-primary text-primary-foreground font-label-md text-label-md font-bold hover:bg-primary/90 transition-colors">
          Volver al fixture
        </Link>
      </div>
    );
  }

  return (
    <>
      <header>
        <h1 className="font-display-lg text-display-lg text-foreground mb-xs">
          {isEdit ? "Actualizar Partido" : "Organizar Partido"}
        </h1>
        <p className="font-body-lg text-body-lg text-muted-foreground">
          {isEdit
            ? "Editá el estado y el resultado del encuentro."
            : "Configurá un nuevo encuentro de la liga."}
        </p>
      </header>

      <Card className="p-md md:p-lg w-full max-w-3xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
            <Field label="Equipo local" error={errors.localTeamId?.message}>
              <Controller
                control={control}
                name="localTeamId"
                rules={{ required: "Seleccioná el equipo local" }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Seleccionar equipo">
                    <Select.Trigger />
                    <Select.Content>
                      {teams.map((t) => (
                        <Select.Item key={t.id} value={String(t.id)}>
                          {t.name}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                )}
              />
            </Field>

            <Field
              label="Equipo visitante"
              error={errors.visitorTeamId?.message}>
              <Controller
                control={control}
                name="visitorTeamId"
                rules={{
                  required: "Seleccioná el equipo visitante",
                  validate: (value) =>
                    value !== getValues("localTeamId") ||
                    "Un equipo no puede jugar contra sí mismo",
                }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Seleccionar equipo">
                    <Select.Trigger />
                    <Select.Content>
                      {teams.map((t) => (
                        <Select.Item key={t.id} value={String(t.id)}>
                          {t.name}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                )}
              />
            </Field>
          </div>

          <Field label="Torneo" error={errors.tournamentId?.message}>
            {/* `value=""` representa "Amistoso" (sin torneo asociado,
             * ver `Match.tournament` en el backend). El `<Select>` base
             * trata cualquier `value` falsy como "sin selección" y cae al
             * `placeholder` en vez de resolver el label del item — por
             * eso `placeholder="Amistoso"` coincide a propósito con el
             * label del `Select.Item value=""` de abajo. */}
            <Controller
              control={control}
              name="tournamentId"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Amistoso">
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="">Amistoso</Select.Item>
                    {tournaments.map((t) => (
                      <Select.Item key={t.id} value={String(t.id)}>
                        {t.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              )}
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
            <Field
              label="Fecha y hora"
              htmlFor="date"
              error={errors.date?.message}>
              <Input
                id="date"
                type="datetime-local"
                aria-invalid={Boolean(errors.date)}
                {...register("date", {
                  required: "La fecha y hora son obligatorias",
                })}
              />
            </Field>

            <Field
              label="Estadio / Cancha"
              htmlFor="stadium"
              error={errors.stadium?.message}>
              <Input
                id="stadium"
                type="text"
                placeholder="Ej. Complejo Deportivo 5"
                aria-invalid={Boolean(errors.stadium)}
                {...register("stadium", {
                  required: "El estadio es obligatorio",
                  validate: (value) =>
                    Boolean(value && value.trim()) ||
                    "El estadio es obligatorio",
                })}
              />
            </Field>
          </div>

          <Field label="Estado del partido">
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="programado">Programado</Select.Item>
                    <Select.Item value="finalizado">Finalizado</Select.Item>
                    <Select.Item value="cancelado">Cancelado</Select.Item>
                  </Select.Content>
                </Select>
              )}
            />
          </Field>

          {isFinished && (
            <div className="bg-muted/40 rounded-lg p-md flex items-start justify-between border border-border">
              <div className="flex flex-col items-center gap-sm w-1/3">
                <span className="font-label-md text-label-md text-muted-foreground uppercase tracking-wider">
                  Local
                </span>
                <Input
                  type="number"
                  min="0"
                  className="w-20 h-20 text-center font-score-display text-score-display"
                  aria-invalid={Boolean(errors.localGoals)}
                  {...register("localGoals", {
                    validate: (value) => {
                      if (watch("status") !== "finalizado") return true;
                      const num = Number(value);
                      if (
                        value === "" ||
                        value == null ||
                        Number.isNaN(num) ||
                        num < 0
                      ) {
                        return "Ingresá los goles del local (número ≥ 0)";
                      }
                      return true;
                    },
                  })}
                />
                {errors.localGoals && (
                  <span className="font-label-md text-label-md text-destructive text-center">
                    {errors.localGoals.message}
                  </span>
                )}
              </div>
              <span className="font-headline-lg text-headline-lg text-muted-foreground w-1/3 text-center pt-lg">
                -
              </span>
              <div className="flex flex-col items-center gap-sm w-1/3">
                <span className="font-label-md text-label-md text-muted-foreground uppercase tracking-wider">
                  Visita
                </span>
                <Input
                  type="number"
                  min="0"
                  className="w-20 h-20 text-center font-score-display text-score-display"
                  aria-invalid={Boolean(errors.visitorGoals)}
                  {...register("visitorGoals", {
                    validate: (value) => {
                      if (watch("status") !== "finalizado") return true;
                      const num = Number(value);
                      if (
                        value === "" ||
                        value == null ||
                        Number.isNaN(num) ||
                        num < 0
                      ) {
                        return "Ingresá los goles del visitante (número ≥ 0)";
                      }
                      return true;
                    },
                  })}
                />
                {errors.visitorGoals && (
                  <span className="font-label-md text-label-md text-destructive text-center">
                    {errors.visitorGoals.message}
                  </span>
                )}
              </div>
            </div>
          )}

          {isFinished && (
            <div className="flex flex-col gap-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-md text-headline-md text-foreground flex items-center gap-xs">
                  <Icon name="sports_soccer" size={20} />
                  Goleadores
                  <span className="font-label-md text-label-md text-muted-foreground font-normal">
                    ({localGoalsCount}/{localGoalsLimit} local ·{" "}
                    {visitorGoalsCount}/{visitorGoalsLimit} visitante)
                  </span>
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!canAddGoal}
                  title={
                    canAddGoal
                      ? undefined
                      : "Ya se registraron tantos goleadores como goles marcó cada equipo"
                  }
                  onClick={() =>
                    goalsArray.append({
                      playerNumber: "",
                      playerName: "",
                      minute: "",
                      team: nextScorerTeam(),
                    })
                  }>
                  <Icon name="add" size={16} />
                  Agregar gol
                </Button>
              </div>

              {!canAddGoal &&
                (localGoalsLimit > 0 || visitorGoalsLimit > 0) && (
                  <p className="font-label-md text-label-md text-muted-foreground flex items-center gap-xs">
                    <Icon name="info" size={16} />
                    Ya registraste el máximo de goleadores según el marcador
                    actual.
                  </p>
                )}
              {errors.goals?.message && (
                <p className="font-label-md text-label-md text-destructive flex items-center gap-xs">
                  <Icon name="info" size={16} />
                  {errors.goals.message}
                </p>
              )}

              {goalsArray.fields.length === 0 ? (
                <p className="font-body-md text-body-md text-muted-foreground">
                  No se registraron goleadores.
                </p>
              ) : (
                <div className="flex flex-col gap-sm">
                  {goalsArray.fields.map((field, index) => (
                    <PlayerEventRow
                      key={field.id}
                      control={control}
                      register={register}
                      errors={errors.goals}
                      index={index}
                      namePrefix="goals"
                      onRemove={() => goalsArray.remove(index)}
                      teamLabels={teamLabels}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {isFinished && (
            <div className="flex flex-col gap-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-md text-headline-md text-foreground flex items-center gap-xs">
                  <Icon name="crop_portrait" size={20} />
                  Tarjetas
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    cardsArray.append({
                      playerNumber: "",
                      playerName: "",
                      minute: "",
                      team: "local",
                      cardType: "amarilla",
                    })
                  }>
                  <Icon name="add" size={16} />
                  Agregar tarjeta
                </Button>
              </div>

              {cardsArray.fields.length === 0 ? (
                <p className="font-body-md text-body-md text-muted-foreground">
                  No se registraron tarjetas.
                </p>
              ) : (
                <div className="flex flex-col gap-sm">
                  {cardsArray.fields.map((field, index) => (
                    <PlayerEventRow
                      key={field.id}
                      control={control}
                      register={register}
                      errors={errors.cards}
                      index={index}
                      namePrefix="cards"
                      onRemove={() => cardsArray.remove(index)}
                      showCardType
                      teamLabels={teamLabels}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-sm mt-sm">
            <Button type="submit" size="lg" className="flex-1">
              {isEdit ? "Guardar cambios" : "Confirmar partido"}
            </Button>
            <Link
              to="/fixture"
              className="flex-1 inline-flex items-center justify-center rounded-md h-11 border border-border text-foreground font-label-md text-label-md font-bold hover:bg-muted transition-colors">
              Cancelar
            </Link>
          </div>
        </form>
      </Card>
    </>
  );
}
