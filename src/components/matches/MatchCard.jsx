import { Link } from "react-router-dom";
import Icon from "../ui/Icon";

const STATUS = {
  programado: {
    label: "Programado",
    dot: "bg-tertiary",
    text: "text-tertiary",
  },
  finalizado: { label: "Terminado", dot: "bg-primary", text: "text-primary" },
  cancelado: { label: "Cancelado", dot: "bg-error", text: "text-error" },
};

function TeamColumn({ team }) {
  return (
    <div className="flex flex-col items-center gap-sm w-1/3">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-surface-variant border border-white/10 flex items-center justify-center text-[28px]">
        {team ? team.logo : "?"}
      </div>
      <span className="font-headline-md text-headline-md text-on-surface text-center leading-tight">
        {team ? team.name : "—"}
      </span>
    </div>
  );
}

export default function MatchCard({
  match,
  localTeam,
  visitorTeam,
  canEdit,
  onCancel,
}) {
  const status = STATUS[match.status] ?? STATUS.programado;
  const isFinished = match.status === "finalizado";
  const dateLabel = new Date(match.date).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <article className="bg-surface-container/60 backdrop-blur-xl border border-white/10 rounded-[1.5rem] glass-edge flex flex-col overflow-hidden">
      <div className="p-md flex justify-between items-center border-b border-white/5 bg-surface-container-low/30">
        <div className="flex items-center gap-xs">
          <span className={`w-2 h-2 rounded-full ${status.dot}`}></span>
          <span
            className={`font-label-md text-label-md ${status.text} uppercase tracking-wider`}>
            {status.label}
          </span>
        </div>
        <span className="font-label-md text-label-md text-secondary">
          {dateLabel}
        </span>
      </div>

      <div className="p-md flex items-center justify-between flex-1 min-h-[140px]">
        <TeamColumn team={localTeam} />
        <div className="flex flex-col items-center justify-center w-1/3 gap-xs">
          {isFinished ? (
            <div className="flex items-center gap-sm">
              <span className="font-score-display text-score-display text-on-surface">
                {match.localGoals}
              </span>
              <span className="font-headline-md text-headline-md text-surface-variant">
                -
              </span>
              <span className="font-score-display text-score-display text-on-surface">
                {match.visitorGoals}
              </span>
            </div>
          ) : (
            <span className="font-display-lg text-display-lg text-surface-variant font-black opacity-50">
              VS
            </span>
          )}
          <span className="font-label-md text-label-md text-secondary bg-surface-variant/30 px-3 py-1 rounded-full border border-white/5 text-center">
            {match.stadium}
          </span>
        </div>
        <TeamColumn team={visitorTeam} />
      </div>

      <div className="p-md pt-0 flex flex-wrap gap-sm mt-auto">
        <Link
          to={`/matches/${match.id}`}
          className="flex-1 min-w-[120px] bg-transparent border border-outline text-on-surface font-label-md text-label-md py-3 rounded-full hover:bg-surface-variant/50 transition-colors flex items-center justify-center gap-xs">
          <Icon name="visibility" size={16} />
          Ver detalle
        </Link>
        {canEdit && (
          <>
            <Link
              to={`/matches/${match.id}/edit`}
              className="flex-1 min-w-[120px] bg-transparent border border-outline text-on-surface font-label-md text-label-md py-3 rounded-full hover:bg-surface-variant/50 transition-colors flex items-center justify-center gap-xs">
              <Icon name="edit" size={16} />
              Editar
            </Link>
            {match.status !== "cancelado" && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 min-w-[120px] bg-transparent border border-error/30 text-error font-label-md text-label-md py-3 rounded-full hover:bg-error/10 hover:border-error transition-colors flex items-center justify-center gap-xs cursor-pointer">
                <Icon name="close" size={16} />
                Cancelar
              </button>
            )}
          </>
        )}
      </div>
    </article>
  );
}
