import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resolveAssetUrl } from "@shared/utils/assetUrl";
import useMatchesStore from "../hooks/useMatchesStore";
import useAuthStore from "@features/auth/hooks/useAuthStore";
import { useConfirm } from "@shared/hooks/useConfirm";
import { useToast } from "@shared/hooks/useToast";
import { Badge, Button, Icon } from "@shared/components/ui";

const STATUS_VARIANT = {
  programado: "secondary",
  finalizado: "default",
  cancelado: "destructive",
};

const STATUS_LABEL = {
  programado: "Programado",
  finalizado: "Terminado",
  cancelado: "Cancelado",
};

function TeamColumn({ team }) {
  const logoUrl = resolveAssetUrl(team?.logoUrl);
  return (
    <div className="flex flex-col items-center gap-sm w-1/3">
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden">
        {logoUrl ? (
          <img src={logoUrl} alt="" className="w-full h-full object-cover" />
        ) : team ? (
          <Icon
            name="sports_soccer"
            size={40}
            className="text-muted-foreground"
          />
        ) : (
          <span className="font-headline-lg text-headline-lg text-muted-foreground">
            ?
          </span>
        )}
      </div>
      <span className="font-headline-md text-headline-md text-foreground text-center leading-tight">
        {team ? team.name : "—"}
      </span>
      {team?.dt && (
        <span className="font-label-md text-label-md text-muted-foreground">
          DT: {team.dt}
        </span>
      )}
    </div>
  );
}

const CARD_COLOR_CLASS = {
  amarilla: "bg-yellow-400",
  roja: "bg-destructive",
};

function PlayerEventsList({
  title,
  icon,
  events,
  teamNames,
  emptyLabel,
  renderBadge,
}) {
  if (!events || events.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-md">
        <h3 className="font-headline-md text-headline-md text-foreground flex items-center gap-xs mb-sm">
          <Icon name={icon} size={20} />
          {title}
        </h3>
        <p className="font-body-md text-body-md text-muted-foreground">
          {emptyLabel}
        </p>
      </div>
    );
  }

  const sortedEvents = [...events].sort((a, b) => a.minute - b.minute);

  return (
    <div className="bg-card border border-border rounded-lg p-md">
      <h3 className="font-headline-md text-headline-md text-foreground flex items-center gap-xs mb-sm">
        <Icon name={icon} size={20} />
        {title}
      </h3>
      <ul className="flex flex-col gap-xs">
        {sortedEvents.map((event, index) => (
          <li
            key={`${event.playerNumber}-${event.minute}-${index}`}
            className="flex items-center gap-sm font-body-md text-body-md text-foreground">
            <span className="font-label-md text-label-md text-muted-foreground w-10 shrink-0">
              {event.minute}'
            </span>
            {renderBadge?.(event)}
            <span className="font-bold shrink-0">#{event.playerNumber}</span>
            <span className="truncate">{event.playerName}</span>
            <span className="text-muted-foreground text-label-md shrink-0 ml-auto">
              {teamNames[event.team] ?? event.team}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const status = useMatchesStore((s) => s.status);
  const fetchMatches = useMatchesStore((s) => s.fetchMatches);
  const match = useMatchesStore((s) =>
    s.matches.find((m) => String(m.id) === String(id)),
  );
  const deleteMatch = useMatchesStore((s) => s.deleteMatch);
  const cancelMatch = useMatchesStore((s) => s.cancelMatch);
  const canModify = useMatchesStore((s) => s.canModify);
  const user = useAuthStore((s) => s.user);
  const confirm = useConfirm();
  const toast = useToast();

  useEffect(() => {
    fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!match) {
    if (status === "loading" || status === "idle") {
      return (
        <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground font-body-md text-body-md">
          Cargando partido…
        </div>
      );
    }
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

  const local = match.localTeam;
  const visitor = match.visitorTeam;
  const editable = canModify(match, user);
  const isFinished = match.status === "finalizado";
  const statusVariant = STATUS_VARIANT[match.status] ?? "secondary";
  const statusLabel = STATUS_LABEL[match.status] ?? match.status;
  const organizerLabel = match.createdBy?.name ?? match.createdBy?.email ?? "—";

  async function handleCancel() {
    const ok = await confirm({
      title: "Cancelar partido",
      description:
        "¿Querés cancelar este partido? Esta acción no se puede deshacer.",
      confirmLabel: "Cancelar partido",
      variant: "destructive",
    });
    if (!ok) return;
    const result = await cancelMatch(match.id);
    if (!result.ok) {
      toast.error(result.error || "No se pudo cancelar el partido");
    }
  }

  async function handleDelete() {
    const ok = await confirm({
      title: "Eliminar partido",
      description:
        "Esta acción no se puede deshacer. ¿Querés eliminar el partido definitivamente?",
      confirmLabel: "Eliminar",
      variant: "destructive",
    });
    if (!ok) return;
    const result = await deleteMatch(match.id);
    if (result.ok) {
      navigate("/fixture");
    } else {
      toast.error(result.error || "No se pudo eliminar el partido");
    }
  }

  return (
    <>
      <Link
        to="/fixture"
        className="flex items-center gap-xs font-label-md text-label-md text-muted-foreground hover:text-primary transition-colors w-fit">
        <Icon name="arrow_back" size={18} />
        Volver al fixture
      </Link>

      <article className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-md flex justify-between items-center border-b border-border">
          <div className="flex items-center gap-sm">
            <Badge variant={statusVariant}>{statusLabel}</Badge>
            <span className="font-label-md text-label-md text-muted-foreground flex items-center gap-xs">
              <Icon name="trophy" size={14} />
              {match.tournament?.name ?? "Amistoso"}
            </span>
          </div>
          <span className="font-label-md text-label-md text-muted-foreground">
            {new Date(match.date).toLocaleString("es-AR", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </span>
        </div>

        <div className="p-lg flex items-center justify-between min-h-[180px]">
          <TeamColumn team={local} />
          <div className="flex flex-col items-center justify-center w-1/3">
            {isFinished ? (
              <div className="flex items-center gap-sm">
                <span className="font-score-display text-score-display text-foreground">
                  {match.localGoals}
                </span>
                <span className="font-headline-lg text-headline-lg text-muted-foreground">
                  -
                </span>
                <span className="font-score-display text-score-display text-foreground">
                  {match.visitorGoals}
                </span>
              </div>
            ) : (
              <span className="font-display-lg text-display-lg text-muted-foreground font-black opacity-50">
                VS
              </span>
            )}
          </div>
          <TeamColumn team={visitor} />
        </div>
      </article>

      <div className="bg-muted/40 border border-border rounded-lg p-md grid grid-cols-1 sm:grid-cols-2 gap-sm font-body-md text-body-md">
        <p className="flex items-center gap-xs text-muted-foreground">
          <Icon name="stadium" size={20} />
          <span className="text-foreground">{match.stadium}</span>
        </p>
        <p className="flex items-center gap-xs text-muted-foreground">
          <Icon name="person" size={20} />
          Organizado por{" "}
          <span className="text-foreground">{organizerLabel}</span>
        </p>
      </div>

      {isFinished && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
          <PlayerEventsList
            title="Goleadores"
            icon="sports_soccer"
            events={match.goals}
            teamNames={{
              local: local?.name ?? "Local",
              visitor: visitor?.name ?? "Visitante",
            }}
            emptyLabel="No se registraron goleadores."
          />
          <PlayerEventsList
            title="Tarjetas"
            icon="crop_portrait"
            events={match.cards}
            teamNames={{
              local: local?.name ?? "Local",
              visitor: visitor?.name ?? "Visitante",
            }}
            emptyLabel="No se registraron tarjetas."
            renderBadge={(event) => (
              <span
                className={`w-3 h-4 rounded-sm shrink-0 ${CARD_COLOR_CLASS[event.cardType] ?? "bg-muted-foreground"}`}
                aria-label={`Tarjeta ${event.cardType}`}
              />
            )}
          />
        </div>
      )}

      {editable ? (
        <div className="flex flex-wrap gap-sm">
          <Link
            to={`/matches/${match.id}/edit`}
            className="inline-flex items-center justify-center gap-xs h-10 px-6 rounded-md bg-primary text-primary-foreground font-label-md text-label-md font-bold hover:bg-primary/90 transition-colors">
            <Icon name="edit" size={18} />
            Editar
          </Link>
          {match.status !== "cancelado" && (
            <Button variant="outline" onClick={handleCancel}>
              <Icon name="close" size={18} />
              Cancelar partido
            </Button>
          )}
          <Button variant="destructive" onClick={handleDelete}>
            <Icon name="delete" size={18} />
            Eliminar
          </Button>
        </div>
      ) : (
        <p className="font-body-md text-body-md text-muted-foreground flex items-center gap-xs">
          <Icon name="info" size={18} />
          Solo el organizador que creó este partido puede modificarlo.
        </p>
      )}
    </>
  );
}
