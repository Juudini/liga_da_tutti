import { useEffect, useState } from "react";
import { Card, Icon } from "@shared/components/ui";
import { useConfirm } from "@shared/hooks/useConfirm";
import { useToast } from "@shared/hooks/useToast";
import useAuthStore from "@features/auth/hooks/useAuthStore";
import useTournamentsStore from "./hooks/useTournamentsStore";
import TournamentForm from "./components/TournamentForm";
import TournamentList from "./components/TournamentList";

export default function Tournaments() {
  const tournaments = useTournamentsStore((s) => s.tournaments);
  const status = useTournamentsStore((s) => s.status);
  const fetchTournaments = useTournamentsStore((s) => s.fetchTournaments);
  const addTournament = useTournamentsStore((s) => s.addTournament);
  const updateTournament = useTournamentsStore((s) => s.updateTournament);
  const deleteTournament = useTournamentsStore((s) => s.deleteTournament);
  const canModify = useTournamentsStore((s) => s.canModify);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const user = useAuthStore((s) => s.user);
  const confirm = useConfirm();
  const toast = useToast();

  const [editingTournament, setEditingTournament] = useState(null);

  useEffect(() => {
    fetchTournaments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const error = useTournamentsStore((s) => s.error);
  useEffect(() => {
    if (status === "error" && error) {
      toast.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, error]);

  async function handleSubmit(data) {
    if (editingTournament) {
      const result = await updateTournament(editingTournament.id, data);
      if (result.ok) {
        toast.success("Torneo actualizado correctamente");
        setEditingTournament(null);
      } else {
        toast.error(result.error || "No se pudo actualizar el torneo");
      }
    } else {
      const result = await addTournament(data);
      if (result.ok) {
        toast.success("Torneo creado correctamente");
      } else {
        toast.error(result.error || "No se pudo crear el torneo");
      }
    }
  }

  async function handleDelete(tournament) {
    const ok = await confirm({
      title: "Eliminar torneo",
      description: `¿Querés eliminar "${tournament.name}"? Esta acción no se puede deshacer.`,
      confirmLabel: "Eliminar",
      variant: "destructive",
    });
    if (!ok) return;

    const result = await deleteTournament(tournament.id);
    if (result.ok) {
      toast.success("Torneo eliminado correctamente");
      if (editingTournament?.id === tournament.id) setEditingTournament(null);
    } else {
      toast.error(result.error || "No se pudo eliminar el torneo");
    }
  }

  return (
    <>
      <header>
        <h1 className="font-display-lg text-display-lg text-foreground mb-xs">
          Torneos
        </h1>
        <p className="font-body-lg text-body-lg text-muted-foreground">
          Creá o editá torneos para asociarlos a los partidos.
        </p>
      </header>

      <Card className="p-md md:p-lg">
        <div className="flex items-center gap-sm mb-md">
          <span className="text-primary">
            <Icon name={editingTournament ? "edit" : "add_circle"} size={22} />
          </span>
          <h2 className="font-headline-md text-headline-md text-foreground">
            {editingTournament
              ? `Editar "${editingTournament.name}"`
              : "Agregar torneo"}
          </h2>
        </div>
        <TournamentForm
          key={editingTournament?.id ?? "new"}
          tournament={editingTournament}
          onSubmit={handleSubmit}
          onCancel={() => setEditingTournament(null)}
        />
      </Card>

      {status === "loading" && tournaments.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-xl text-center text-muted-foreground">
          <p className="font-body-md text-body-md">Cargando torneos…</p>
        </div>
      ) : (
        <TournamentList
          tournaments={tournaments}
          onEdit={setEditingTournament}
          onDelete={handleDelete}
          canDelete={isAdmin}
          canEdit={(tournament) => canModify(tournament, user)}
        />
      )}
    </>
  );
}
