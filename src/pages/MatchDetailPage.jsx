import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTournament } from "../hooks/useTournament";
import { useAuth } from "../hooks/useAuth";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Icon from "../components/ui/Icon";

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
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-surface-variant border border-white/10 flex items-center justify-center text-[40px]">
        {team ? team.logo : "?"}
      </div>
      <span className="font-headline-md text-headline-md text-on-surface text-center leading-tight">
        {team ? team.name : "—"}
      </span>
      {team && (
        <span className="font-label-md text-label-md text-secondary">
          DT: {team.dt}
        </span>
      )}
    </div>
  );
}

export default function MatchDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMatchById, getTeamById, deleteMatch, cancelMatch, canModify } =
    useTournament();
  const { user } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const match = getMatchById(id);
  if (!match) {
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

  const local = getTeamById(match.localTeamId);
  const visitor = getTeamById(match.visitorTeamId);
  const editable = canModify(match, user);
  const isFinished = match.status === "finalizado";
  const status = STATUS[match.status] ?? STATUS.programado;

  function handleDelete() {
    deleteMatch(match.id);
    navigate("/fixture");
  }

  return (
    <>
      <Link
        to="/fixture"
        className="flex items-center gap-xs font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors w-fit">
        <Icon name="arrow_back" size={18} />
        Volver al fixture
      </Link>

      <article className="bg-surface-container/60 backdrop-blur-xl border border-white/10 rounded-[1.5rem] glass-edge overflow-hidden">
        <div className="p-md flex justify-between items-center border-b border-white/5 bg-surface-container-low/30">
          <div className="flex items-center gap-xs">
            <span className={`w-2 h-2 rounded-full ${status.dot}`}></span>
            <span
              className={`font-label-md text-label-md ${status.text} uppercase tracking-wider`}>
              {status.label}
            </span>
          </div>
          <span className="font-label-md text-label-md text-secondary">
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
                <span className="font-score-display text-score-display text-on-surface">
                  {match.localGoals}
                </span>
                <span className="font-headline-lg text-headline-lg text-surface-variant">
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
          </div>
          <TeamColumn team={visitor} />
        </div>
      </article>

      <div className="bg-surface-container/40 border border-white/5 rounded-xl p-md grid grid-cols-1 sm:grid-cols-2 gap-sm font-body-md text-body-md">
        <p className="flex items-center gap-xs text-on-surface-variant">
          <span className="text-tertiary">
            <Icon name="stadium" size={20} />
          </span>
          <span className="text-on-surface">{match.stadium}</span>
        </p>
        <p className="flex items-center gap-xs text-on-surface-variant">
          <span className="text-tertiary">
            <Icon name="person" size={20} />
          </span>
          Organizado por{" "}
          <span className="text-on-surface">{match.createdBy}</span>
        </p>
      </div>

      {editable ? (
        <div className="flex flex-wrap gap-sm">
          <Link
            to={`/matches/${match.id}/edit`}
            className="bg-primary text-on-primary font-label-md text-label-md font-bold py-3 px-6 rounded-full glow-primary flex items-center gap-xs">
            <Icon name="edit" size={18} />
            Editar
          </Link>
          {match.status !== "cancelado" && (
            <button
              type="button"
              onClick={() => cancelMatch(match.id)}
              className="border border-outline text-on-surface font-label-md text-label-md py-3 px-6 rounded-full hover:bg-surface-variant/40 transition-colors flex items-center gap-xs cursor-pointer">
              <Icon name="close" size={18} />
              Cancelar partido
            </button>
          )}
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="border border-error/30 text-error font-label-md text-label-md py-3 px-6 rounded-full hover:bg-error/10 hover:border-error transition-colors flex items-center gap-xs cursor-pointer">
            <Icon name="delete" size={18} />
            Eliminar
          </button>
        </div>
      ) : (
        <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-xs">
          <Icon name="info" size={18} />
          Solo el organizador que creó este partido puede modificarlo.
        </p>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar partido"
        message="Esta acción no se puede deshacer. ¿Querés eliminar el partido definitivamente?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
