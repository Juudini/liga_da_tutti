import { useEffect, useState } from "react";
import { Card, Icon } from "@shared/components/ui";
import { useConfirm } from "@shared/hooks/useConfirm";
import { useToast } from "@shared/hooks/useToast";
import useAuthStore from "@features/auth/hooks/useAuthStore";
import useTeamsStore from "./hooks/useTeamsStore";
import TeamForm from "./components/TeamForm";
import TeamList from "./components/TeamList";

export default function Teams() {
  const teams = useTeamsStore((s) => s.teams);
  const status = useTeamsStore((s) => s.status);
  const fetchTeams = useTeamsStore((s) => s.fetchTeams);
  const addTeam = useTeamsStore((s) => s.addTeam);
  const updateTeam = useTeamsStore((s) => s.updateTeam);
  const deleteTeam = useTeamsStore((s) => s.deleteTeam);
  const canModify = useTeamsStore((s) => s.canModify);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const user = useAuthStore((s) => s.user);
  const confirm = useConfirm();
  const toast = useToast();

  const [editingTeam, setEditingTeam] = useState(null);

  useEffect(() => {
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const error = useTeamsStore((s) => s.error);
  useEffect(() => {
    if (status === "error" && error) {
      toast.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, error]);

  async function handleSubmit(data) {
    if (editingTeam) {
      const result = await updateTeam(editingTeam.id, data);
      if (result.ok) {
        toast.success("Equipo actualizado correctamente");
        setEditingTeam(null);
      } else {
        toast.error(result.error || "No se pudo actualizar el equipo");
      }
    } else {
      const result = await addTeam(data);
      if (result.ok) {
        toast.success("Equipo creado correctamente");
      } else {
        toast.error(result.error || "No se pudo crear el equipo");
      }
    }
  }

  async function handleDelete(team) {
    const ok = await confirm({
      title: "Eliminar equipo",
      description: `¿Querés eliminar a "${team.name}"? Esta acción no se puede deshacer.`,
      confirmLabel: "Eliminar",
      variant: "destructive",
    });
    if (!ok) return;

    const result = await deleteTeam(team.id);
    if (result.ok) {
      toast.success("Equipo eliminado correctamente");
      if (editingTeam?.id === team.id) setEditingTeam(null);
    } else {
      toast.error(result.error || "No se pudo eliminar el equipo");
    }
  }

  return (
    <>
      <header>
        <h1 className="font-display-lg text-display-lg text-foreground mb-xs">
          Equipos
        </h1>
        <p className="font-body-lg text-body-lg text-muted-foreground">
          Creá o editá equipos con su logo para el fixture.
        </p>
      </header>

      <Card className="p-md md:p-lg">
        <div className="flex items-center gap-sm mb-md">
          <span className="text-primary">
            <Icon name={editingTeam ? "edit" : "add_circle"} size={22} />
          </span>
          <h2 className="font-headline-md text-headline-md text-foreground">
            {editingTeam ? `Editar "${editingTeam.name}"` : "Agregar equipo"}
          </h2>
        </div>
        <TeamForm
          key={editingTeam?.id ?? "new"}
          team={editingTeam}
          onSubmit={handleSubmit}
          onCancel={() => setEditingTeam(null)}
        />
      </Card>

      {status === "loading" && teams.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-xl text-center text-muted-foreground">
          <p className="font-body-md text-body-md">Cargando equipos…</p>
        </div>
      ) : (
        <TeamList
          teams={teams}
          onEdit={setEditingTeam}
          onDelete={handleDelete}
          canDelete={isAdmin}
          canEdit={(team) => canModify(team, user)}
        />
      )}
    </>
  );
}
