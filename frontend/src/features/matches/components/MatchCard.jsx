import { Link } from "react-router-dom";
import { Badge, Icon } from "@shared/components/ui";
import { resolveAssetUrl } from "@shared/utils/assetUrl";
import useMatchesStore from "../hooks/useMatchesStore";
import useAuthStore from "@features/auth/hooks/useAuthStore";
import { useConfirm } from "@shared/hooks/useConfirm";
import { useToast } from "@shared/hooks/useToast";

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

const LINK_BUTTON =
  "flex-1 min-w-[120px] inline-flex items-center justify-center gap-xs h-10 rounded-md border border-border bg-transparent text-foreground font-label-md text-label-md font-bold hover:bg-muted transition-colors";

const LINK_BUTTON_DESTRUCTIVE =
  "flex-1 min-w-[120px] inline-flex items-center justify-center gap-xs h-10 rounded-md border border-destructive/30 bg-transparent text-destructive font-label-md text-label-md font-bold hover:bg-destructive/10 hover:border-destructive transition-colors cursor-pointer";

function TeamColumn({ team }) {
  const logoUrl = resolveAssetUrl(team?.logoUrl);
  return (
    <div className="flex flex-col items-center gap-sm w-1/3">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden">
        {logoUrl ? (
          <img src={logoUrl} alt="" className="w-full h-full object-cover" />
        ) : team ? (
          <Icon
            name="sports_soccer"
            size={28}
            className="text-muted-foreground"
          />
        ) : (
          <span className="font-headline-md text-headline-md text-muted-foreground">
            ?
          </span>
        )}
      </div>
      <span className="font-headline-md text-headline-md text-foreground text-center leading-tight">
        {team ? team.name : "—"}
      </span>
    </div>
  );
}

export default function MatchCard({ match }) {
  const canModify = useMatchesStore((s) => s.canModify);
  const cancelMatch = useMatchesStore((s) => s.cancelMatch);
  const user = useAuthStore((s) => s.user);
  const confirm = useConfirm();
  const toast = useToast();

  const localTeam = match.localTeam;
  const visitorTeam = match.visitorTeam;
  const canEdit = canModify(match, user);
  const isFinished = match.status === "finalizado";
  const dateLabel = new Date(match.date).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });

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

  return (
    <article className="bg-card border border-border rounded-lg flex flex-col overflow-hidden">
      <div className="p-md flex justify-between items-center border-b border-border">
        <div className="flex items-center gap-sm">
          <Badge variant={STATUS_VARIANT[match.status] ?? "secondary"}>
            {STATUS_LABEL[match.status] ?? match.status}
          </Badge>
          <span className="font-label-md text-label-md text-muted-foreground flex items-center gap-xs">
            <Icon name="trophy" size={14} />
            {match.tournament?.name ?? "Amistoso"}
          </span>
        </div>
        <span className="font-label-md text-label-md text-muted-foreground">
          {dateLabel}
        </span>
      </div>

      <div className="p-md flex items-center justify-between flex-1 min-h-[140px]">
        <TeamColumn team={localTeam} />
        <div className="flex flex-col items-center justify-center w-1/3 gap-xs">
          {isFinished ? (
            <div className="flex items-center gap-sm">
              <span className="font-score-display text-score-display text-foreground">
                {match.localGoals}
              </span>
              <span className="font-headline-md text-headline-md text-muted-foreground">
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
          <span className="font-label-md text-label-md text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border text-center">
            {match.stadium}
          </span>
        </div>
        <TeamColumn team={visitorTeam} />
      </div>

      <div className="p-md pt-0 flex flex-wrap gap-sm mt-auto">
        <Link to={`/matches/${match.id}`} className={LINK_BUTTON}>
          <Icon name="visibility" size={16} />
          Ver detalle
        </Link>
        {canEdit && (
          <>
            <Link to={`/matches/${match.id}/edit`} className={LINK_BUTTON}>
              <Icon name="edit" size={16} />
              Editar
            </Link>
            {match.status !== "cancelado" && (
              <button
                type="button"
                onClick={handleCancel}
                className={LINK_BUTTON_DESTRUCTIVE}>
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
